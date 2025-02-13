import { stopVideo } from "../../app/services/firebase";
import { updateDoc, doc } from "firebase/firestore";


jest.mock("firebase/firestore", () => {
    const actualFirestore = jest.requireActual("firebase/firestore");

    return {
        ...actualFirestore,
        updateDoc: jest.fn(),
        doc: jest.fn(),
    };
});

describe("Firebase - stopVideo", () => {
    it("should stop the video and reset progress", async () => {
        const mockRoomId = "abc123";

        await stopVideo(mockRoomId);

        expect(updateDoc).toHaveBeenCalledWith(
            doc(expect.anything(), "parties", mockRoomId),
            {
                playing: false,
                currentTime: 0,
                startedAt: null,
            }
        );
    });
});
