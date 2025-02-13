import { pauseVideo } from "../../app/services/firebase";
import { updateDoc, doc } from "firebase/firestore";


jest.mock("firebase/firestore", () => {
    const actualFirestore = jest.requireActual("firebase/firestore");

    return {
        ...actualFirestore,
        updateDoc: jest.fn(),
        doc: jest.fn(),
    };
});

describe("Firebase - pauseVideo", () => {
    it("should pause the video in the room", async () => {
        const mockRoomId = "abc123";
        const mockTime = 75; // 1 minute 15 seconds

        await pauseVideo(mockRoomId, mockTime);

        expect(updateDoc).toHaveBeenCalledWith(
            doc(expect.anything(), "parties", mockRoomId),
            {
                playing: false,
                currentTime: mockTime,
                startedAt: null,
            }
        );
    });
});
