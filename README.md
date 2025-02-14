# Immidee Watch Party Project

This project is a **collaborative Watch Party app**, allowing users to watch YouTube videos together in sync. The frontend is written in **TypeScript**, and we implemented robust **unit tests** using **Jest**.

## Implemented Features
- [x] **Creating a session** – Users can create a watch party session.
- [x] **Joining a session** – Users can join a session using a shareable link.
- [x] **Playing/pausing the video** – The video stays in sync across all users.
- [x] **Seeking functionality** – Jumping to a certain time updates for everyone.
- [x] **Late joining synchronization** – New users see the correct playback state.
- [x] **Player controls validation** – Ensures play, pause, and seek behave as expected.

---

## How to Run the Project

### **1. Install Dependencies**
```sh
npm install
```

### **2. Create and Configure Firebase**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a **Firestore Database**
3. In your project settings, copy the Firebase credentials
4. Create a `.env` file and add:

```env
FIREBASE_CONFIG={
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_STORAGE_BUCKET",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID"
}
```

### **3. Start the Development Server**

```sh
npm run dev
```

### **4. Run Unit Tests**

```sh
npm test
```

### **5. Run End-to-End (E2E) Tests with Playwright**

```sh
npx playwright test
```

To run a specific test file:

```sh
npx playwright test tests/e2e/playVideo.test.ts
```

---

## Implemented Unit Tests

Unit Tests were developed using Jest to ensure the full workflow is functioning correctly

### **Tested Functions**

| Function      | Purpose                         | Status      |
| ------------- | ------------------------------- | ----------- |
| `createRoom`  | Create a new session            | ✅ Completed |
| `enterRoom`   | Allow a user to join a session  | ✅ Completed |
| `addVideo`    | Add a video to a session        | ✅ Completed |
| `playVideo`   | Control play/pause state        | ✅ Completed |
| `seekVideo`   | Synchronize the seek position   | ✅ Completed |
| `pauseVideo`  | Pause the video playback        | ✅ Completed |
| `stopVideo`   | Stop and reset video playback   | ✅ Completed |
| `removeVideo` | Remove a video from the session | ✅ Completed |

---

## Implemented End-to-End (E2E) Tests

End-to-End (E2E) tests were developed using Playwright to ensure the full workflow is functioning correctly

### **Tested Features**

| Test Case                 | Purpose                                      | Status      |
| -------------------------- | -------------------------------------------- | ----------- |
| `addVideo.test.ts`        | Ensure a video can be added successfully     | ✅ Completed |
| `addMultipleVideos.test.ts` | Verify multiple videos can be added         | ✅ Completed |
| `playVideo.test.ts`       | Validate video play functionality           | ✅ Completed |
| `pauseVideo.test.ts`      | Validate video pause functionality          | ✅ Completed |
| `removeVideo.test.ts`     | Ensure a video can be removed successfully  | ✅ Completed |
| `auth.test.ts`           | Verify homepage loads correctly              | ✅ Completed |

---

## Architecture Questions

### 1️ **How do we ensure accurate synchronization when a new user joins?**

- I store **currentTime** and **startedAt** in Firestore.
- When a new user joins, they retrieve the current playback state.
- If the video is playing, we calculate the exact position using **serverTimestamp()**.

### 2️ **Potential Race Conditions and Edge Cases**

- **Delayed Firestore Writes** → Could cause temporary desyncs if updates aren’t immediate.
- **Network Latency** → Users with slow connections might lag behind.
- **Concurrent Control Updates** → If multiple users change playback state simultaneously, we ensure **Firestore updates are atomic**.

### 3️ **Scaling for 1M+ DAUs & Large Sessions**

- **Infrastructure Scaling**:
  - Use **Firestore’s real-time listeners** for efficient state management.
  - Optimize Firestore reads/writes to reduce latency.
  - Implement **Redis caching** to reduce database load.
- **Frontend Enhancements**:
  - Use **WebRTC** or **WebSockets** instead of Firestore for ultra-low latency sync.
  - Introduce **adaptive video buffering** for smoother playback.

---

## ⚠️ **Frontend Structure Note**

I did not modify the frontend route structure since it was already well-structured and supported the required functionalities without changes. The existing setup efficiently handled navigation and state management, allowing me to focus on backend logic and testing. The main components remain in `./routes/_index.tsx` as per the original setup. I only added `data-testid` attributes to facilitate test automation.


---

## 🚨 **Known Issues & Bug Reports**

I have identified an issue and logged it for further investigation:

- **Bug:** When adding a video and switching to another browser tab for a few minutes, the UI becomes broken upon returning.
- **Status:** Open
- **Affected Component:** Video playback UI
- **Reported on:** `docs/bug-reports/ui-breaks-after-tab-switch.md`



