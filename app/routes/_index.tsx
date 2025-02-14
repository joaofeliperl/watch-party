import { Icon } from "@iconify-icon/react";
import type { MetaFunction } from "@remix-run/node";
import { DocumentData, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { v4 as uuidv4 } from "uuid";
import { Button } from "~/components/ui/button";
import ToggleIcon from "~/components/ui/toggle-icon";
import useDebounce from "~/hooks/use-debounce";
import fromUrl from "~/lib/parser";
import humanizeSeconds from "~/lib/text";
import { cn } from "~/lib/utils";
import {
  addVideo,
  createRoom,
  getRoom,
  getVideos,
  pauseVideo,
  playVideo,
  removeVideo,
  seekVideo,
  stopVideo,
} from "~/services/firebase";

const Alert = withReactContent(Swal);

const USER_ID = uuidv4();

export const meta: MetaFunction = () => {
  return [
    { title: "Watch Party" },
    { name: "description", content: "Watch videos with everyone" },
  ];
};

export default function Index() {
  const [currentVideo, setCurrentVideo] = useState<DocumentData>();
  const [duration, setDuration] = useState<number>();
  const [muted, setMuted] = useState(true);
  const [manulSeek, setManulSeek] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);
  const [room, setRoom] = useState<DocumentData>();
  const [url, setUrl] = useState<string>("");
  const [videos, setVideos] = useState<DocumentData[]>([]);

  const player = useRef<ReactPlayer>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const rid = searchParams.get("rid") || "";

  const fetchNewRoom = async (id: string) => {
    await createRoom(id);
  };

  const goSeek = (roomData?: DocumentData) => {
    if (
      roomData?.currentTime !== undefined &&
      roomData.startedAt &&
      roomData.playing
    ) {
      const start = new Date(roomData.startedAt?.seconds * 1000);
      const end = new Date();
      const seconds = (end.getTime() - start.getTime()) / 1000;
      player?.current?.seekTo(roomData.currentTime + seconds);
    }
  };

  const handleStartVideo = async (vid: string) => {
    if (vid !== room?.vid) {
      await playVideo(rid, { vid, currentTime: 0, playing: true });
    } else if (vid === room?.vid && !room?.playing) {
      await playVideo(rid, { startedAt: serverTimestamp(), playing: true });
    } else if (vid === room?.vid && room?.playing) {
      await pauseVideo(rid, player.current?.getCurrentTime());
    }
  };

  const handleAddUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url) return;

    const vid = fromUrl(`${url}`);

    if (!vid) {
      return Alert.fire({
        title: "Invalid URL",
        text: "Please provide a valid url",
      });
    }

    const data = await fetch(
      `https://noembed.com/embed?format=json&url=${url}`
    ).then((data) => data.json());

    const video = await addVideo(rid, USER_ID, vid, data?.title);

    if (video?.id && videos.length === 0)
      await playVideo(rid, { vid: video?.id, currentTime: 0, playing: true });

    setUrl("");
  };

  const handlePlayerReady = () => {
    setDuration(player.current?.getDuration());
    goSeek(room);
  };

  const handlePlayerProgress = (state: OnProgressProps) => {
    if (!manulSeek) setPlayedSeconds(state.playedSeconds);
  };

  const seekVideoDebounced = useDebounce((rid: string, seconds: number) => {
    seekVideo(rid, seconds);
    setTimeout(() => setManulSeek(false), 250);
  }, 250);

  const handlePlayerSeek = async (seconds: number) => {
    setManulSeek(true);
    setPlayedSeconds(seconds);
    if (rid) seekVideoDebounced(rid, seconds);
  };

  const handlePlayerEnded = async () => {
    if (rid) await stopVideo(rid);
  };

  const handleVideoDelete = async (id: string) => {
    if (rid) {
      await removeVideo(rid, id);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (rid) {
        await getRoom(rid, async (doc) => {
          if (doc?.exists()) {
            const roomData = doc.data();

            await getVideos(rid, (data) => {
              const currentVideoData = data.find(
                (item) => item.id === roomData.vid
              );
              setCurrentVideo(currentVideoData);
              setVideos(data);
              setRoom(roomData);
              goSeek(roomData);
            });
          } else await fetchNewRoom(rid);
        });
      } else {
        await fetchNewRoom(uuidv4());
      }
    };

    fetchData().catch(console.error);
  }, [rid]);

  useEffect(() => {
    if (!rid) {
      const newId = uuidv4();
      createRoom(newId).then(() => setSearchParams({ rid: newId }));
    }
  }, [rid, setSearchParams]);

  return (
    <div className="container mx-auto root">
      <h1 data-testid="page-title" className="text-6xl font-thin text-slate-300 py-12">Watch Party</h1>
      <div className="flex items-center w-full">
        <div className="flex-none flex flex-col w-full gap-4">
          <form onSubmit={handleAddUrl}>
            <div
              className={cn(
                "flex py-2 gap-2 items-center rounded bg-neutral-900 h-12 text-white text-sm bg-opacity-90 hover:bg-neutral-700 border border-transparent px-2 max-w-md"
              )}
            >
              <img
                src="/youtube.png"
                alt="youtube"
                className="flex-none w-10"
              />
              <div className="w-full outline-none text-slate-700 rounded px-2 shadow-inner h-8 bg-white flex items-center">
                <input
                  name="rid"
                  data-testid="youtube-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Add a youtube URL to watch with your friends"
                  className="w-full outline-none text-slate-700 bg-transparent"
                />
              </div>
              <button
                type="submit"
                data-testid="create-session"
                className="flex-none w-8 h-8 flex items-center justify-center hover:bg-red-600 rounded"
              >
                <Icon icon="mdi:add-circle" style={{ fontSize: 24 }} />
              </button>
            </div>
          </form>
          <div
            className={cn(`w-full flex gap-2 p-2 rounded bg-opacity-90`, {
              "bg-neutral-900": videos.length,
              "bg-slate-200 shadow-inner": !videos.length,
            })}
          >
            <div data-testid="video-list" className="flex-none w-96 flex flex-col">
              {videos.map((video) => (
                <button
                  data-testid={`video-item-${video.id}`}
                  key={video.id}
                  className={`cursor-pointer h-9 p-1 pl-2 w-full flex gap-2 items-center text-white rounded justify-between ${video.id === room?.vid
                    ? "border-neutral-600 bg-red-500 hover:bg-red-600"
                    : "border-transparent bg-transparent"
                    }`}
                  onClick={() => handleStartVideo(video.id)}
                >
                  <div className="w-full text-left truncate font-light text-sm">
                    {video.title || `https://youtu.be/${video.vid}`}
                  </div>
                  {video.id === room?.vid && (
                    <ToggleIcon
                      active={room?.playing}
                      from="mdi:pause-circle-filled"
                      to="mdi:play-circle-filled"
                      size={28}
                      className="flex items-center"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="w-full">
              {!currentVideo && (
                <div
                  className={cn("pt-[56.25%] relative", {
                    "bg-black": videos.length,
                  })}
                />
              )}
              {currentVideo && (
                <div className="overflow-hidden pt-[56.25%] relative h-0 bg-black group">
                  <ReactPlayer
                    ref={player}
                    url={`https://www.youtube.com/embed/${currentVideo?.vid}`}
                    playing={room?.playing}
                    controls={false}
                    muted={muted}
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0"
                    onEnded={handlePlayerEnded}
                    onReady={handlePlayerReady}
                    onProgress={handlePlayerProgress}
                    config={{
                      youtube: {
                        playerVars: {
                          showinfo: 0,
                          controls: 0,
                          enablejsapi: 1,
                          modestbranding: 1,
                          cc_load_policy: 3,
                          iv_load_policy: 3,
                        },
                      },
                    }}
                  />
                  <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center">
                    {!room?.playing && (
                      <Button
                        data-testid="play-video"
                        className="w-24 h-24 rounded-full text-white"
                        onClick={() => handleStartVideo(currentVideo.id)}
                      >
                        <Icon icon="mdi:play" style={{ fontSize: 48 }} />
                      </Button>
                    )}
                    <Button
                      data-testid={`remove-video-${currentVideo.id}`}
                      className="absolute top-4 right-4 transition-opacity opacity-0 group-hover:opacity-100 flex items-center justify-center w-12 h-12 bg-neutral-800 hover:bg-neutral-900 cursor-pointer text-white rounded"
                      onClick={() => handleVideoDelete(currentVideo.id)}
                      title="Remove video from the playlist"
                    >
                      <Icon icon="mdi:close" style={{ fontSize: 24 }} />
                    </Button>
                    <div className="absolute w-full bottom-0 transition-opacity opacity-0 group-hover:opacity-100 flex gap-3 p-2 items-center bg-gradient-to-t from-neutral-900 to-transparent">
                      <ToggleIcon
                        className="cursor-pointer text-white w-6 h-6 flex items-center justify-center flex-none"
                        onClick={() => handleStartVideo(currentVideo.id)}
                        active={room?.playing}
                        from="mdi:pause-circle-filled"
                        to="mdi:play-circle-filled"
                        size={24}
                        data-testid={room?.playing ? "pause-video" : "play-video"}
                      />
                      <div className="w-full h-5">
                        {duration && (
                          <input
                            type="range"
                            min="1"
                            max={duration}
                            value={playedSeconds}
                            onChange={(e) =>
                              handlePlayerSeek(Number(e.target.value))
                            }
                            className="w-full accent-red-500"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-none">
                        <ToggleIcon
                          className="cursor-pointer pb-[3px] text-white w-6 h-6 flex items-center justify-center"
                          onClick={() => setMuted(!muted)}
                          active={muted}
                          from="material-symbols:volume-off"
                          to="material-symbols:volume-up"
                        />
                        <div className="text-white text-xs whitespace-nowrap w-24 font-light text-right">
                          {[
                            humanizeSeconds(playedSeconds),
                            humanizeSeconds(duration),
                          ].join(" / ")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
