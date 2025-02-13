import { removeVideo } from "../../app/services/firebase";
import { updateDoc, deleteDoc, getDoc, doc } from "firebase/firestore";


jest.mock("firebase/firestore", () => {
    const actualFirestore = jest.requireActual("firebase/firestore");

    return {
        ...actualFirestore,
        updateDoc: jest.fn(),
        deleteDoc: jest.fn(),
        getDoc: jest.fn(() => ({
            exists: jest.fn(() => true),
            data: jest.fn(() => ({ vid: "video789" })),
        })),
        doc: jest.fn(),
    };
});

describe("Firebase - removeVideo", () => {
    it("should remove a video from the room", async () => {
        const mockRoomId = "abc123";
        const mockVideoId = "video789";

        await removeVideo(mockRoomId, mockVideoId);

        expect(updateDoc).toHaveBeenCalledWith(
            doc(expect.anything(), "parties", mockRoomId),
            {
                playing: false,
                currentTime: 0,
                startedAt: null,
            }
        );

        expect(deleteDoc).toHaveBeenCalledWith(
            doc(expect.anything(), "parties", mockRoomId, "videos", mockVideoId)
        );
    });
});
