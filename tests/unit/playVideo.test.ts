import { playVideo } from "../../app/services/firebase";
import { updateDoc, doc } from "firebase/firestore";


jest.mock("firebase/firestore");

describe("Firebase - playVideo", () => {
    it("should update the video playback status", async () => {
        const mockRoomId = "abc123";
        const mockData = { playing: true, currentTime: 42 };

        await playVideo(mockRoomId, mockData);

        expect(updateDoc).toHaveBeenCalledWith(
            doc(expect.anything(), "parties", mockRoomId),
            mockData
        );
    });
});
