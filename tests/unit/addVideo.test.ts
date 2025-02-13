import { addVideo } from "../../app/services/firebase";
import { addDoc, collection } from "firebase/firestore";



jest.mock("firebase/firestore", () => {
    const actualFirestore = jest.requireActual("firebase/firestore");

    return {
        ...actualFirestore,
        getFirestore: jest.fn(() => ({
            collection: jest.fn(),
            doc: jest.fn(),
            setDoc: jest.fn(),
            updateDoc: jest.fn(),
        })),
        addDoc: jest.fn(),
        collection: jest.fn(),
        doc: jest.fn(),
        serverTimestamp: jest.fn(() => new Date("2025-02-12T00:00:00Z")),
    };
});


describe("Firebase - addVideo", () => {
    it("should add a video to the room", async () => {
        const mockRoomId = "abc123";
        const mockUserId = "user456";
        const mockVideoId = "video789";
        const mockTitle = "Teste de Vídeo";

        await addVideo(mockRoomId, mockUserId, mockVideoId, mockTitle);

        expect(addDoc).toHaveBeenCalledWith(
            collection(expect.anything(), "parties", mockRoomId, "videos"),
            {
                uid: mockUserId,
                vid: mockVideoId,
                title: mockTitle,
                timestamp: expect.anything(),
            }
        );
    });
});
