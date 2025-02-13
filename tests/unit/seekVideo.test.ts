import { seekVideo } from "../../app/services/firebase";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";


jest.mock("firebase/firestore", () => {
    const actualFirestore = jest.requireActual("firebase/firestore");

    return {
        ...actualFirestore,
        updateDoc: jest.fn(),
        doc: jest.fn(),
        serverTimestamp: jest.fn(() => new Date("2025-02-12T00:00:00Z")),
    };
});

describe("Firebase - seekVideo", () => {
    it("should update the video seek time", async () => {
        const mockRoomId = "abc123";
        const mockTime = 120; // 2 minutes

        await seekVideo(mockRoomId, mockTime);

        expect(updateDoc).toHaveBeenCalledWith(
            doc(expect.anything(), "parties", mockRoomId),
            {
                currentTime: mockTime,
                startedAt: expect.anything(),
            }
        );
    });
});
