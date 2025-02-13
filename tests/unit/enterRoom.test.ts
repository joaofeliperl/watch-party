import { db } from "../../app/services/firebase";
import { setDoc, doc } from "firebase/firestore";

export async function enterRoom(roomId: string, userId: string) {
    const userRef = doc(db, "parties", roomId, "users", userId);
    await setDoc(userRef, { uid: userId }, { merge: true });
}

jest.mock("firebase/firestore");

describe("Firebase - enterRoom", () => {
    it("should allow a user to join a room", async () => {
        const mockRoomId = "abc123";
        const mockUserId = "user456";

        await enterRoom(mockRoomId, mockUserId);

        expect(setDoc).toHaveBeenCalledWith(
            doc(expect.anything(), "parties", mockRoomId, "users", mockUserId),
            { uid: mockUserId },
            { merge: true }
        );
    });
});
