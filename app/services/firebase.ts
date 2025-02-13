import { initializeApp, getApps, getApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  FieldValue,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG ?? "{}");

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };

async function upsertUser(uid: string) {
  try {
    await setDoc(doc(db, "users", uid), {});
  } catch (error) {
    console.error(error);
  }
}

async function createRoom(rid: string) {
  try {
    await setDoc(doc(db, "parties", rid), {
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

async function getRoom(
  rid: string,
  callback: (doc: DocumentSnapshot<DocumentData>) => void
) {
  try {
    return onSnapshot(doc(db, "parties", rid), (snapshot) => {
      callback(snapshot);
    });
  } catch (error) {
    console.error(error);
  }
}

async function getUsers(callback: (docs: DocumentData[]) => void) {
  return onSnapshot(collection(db, "users"), (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
}

async function getVideos(
  rid: string,
  callback: (docs: DocumentData[]) => void
) {
  return onSnapshot(
    query(collection(db, "parties", rid, "videos"), orderBy("timestamp")),
    (snapshot) => {
      callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
  );
}

async function enterRoom(rid: string, uid: string) {
  try {
    await updateDoc(doc(db, "parties", rid, "users", uid), { uid });
  } catch (error) {
    console.error(error);
  }
}

async function addVideo(
  rid: string,
  uid: string,
  vid: string,
  title: string = ""
) {
  try {
    return addDoc(collection(db, "parties", rid, "videos"), {
      uid,
      vid,
      title,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

async function playVideo(
  rid: string,
  body: {
    startedAt?: FieldValue;
    vid?: string;
    currentTime?: number;
    playing: boolean;
  }
) {
  try {
    await updateDoc(doc(db, "parties", rid), body);
  } catch (error) {
    console.error(error);
  }
}

async function seekVideo(rid: string, currentTime: number) {
  try {
    await updateDoc(doc(db, "parties", rid), {
      currentTime,
      startedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

async function pauseVideo(rid: string, currentTime?: number) {
  try {
    await updateDoc(doc(db, "parties", rid), {
      playing: false,
      currentTime,
      startedAt: null,
    });
  } catch (error) {
    console.error(error);
  }
}

async function stopVideo(rid: string) {
  try {
    await updateDoc(doc(db, "parties", rid), {
      playing: false,
      currentTime: 0,
      startedAt: null,
    });
  } catch (error) {
    console.error(error);
  }
}

async function removeVideo(rid: string, id: string) {
  try {
    const refDoc = doc(db, "parties", rid);
    const ref = (await getDoc(refDoc)).data();
    if (ref?.vid === id) {
      await updateDoc(refDoc, {
        playing: false,
        currentTime: 0,
        startedAt: null,
      });
    }
    await deleteDoc(doc(db, "parties", rid, "videos", id));
  } catch (error) {
    console.error(error);
  }
}

export {
  addVideo,
  createRoom,
  enterRoom,
  getRoom,
  getUsers,
  getVideos,
  pauseVideo,
  playVideo,
  removeVideo,
  seekVideo,
  stopVideo,
  upsertUser,
};
