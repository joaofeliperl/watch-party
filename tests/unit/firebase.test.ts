import { createRoom } from "../../app/services/firebase";


jest.mock("firebase/firestore", () => {
    const actualFirestore = jest.requireActual("firebase/firestore");

    return {
        ...actualFirestore,
        getFirestore: jest.fn(() => ({
            collection: jest.fn(),
            doc: jest.fn(),
            setDoc: jest.fn(),
            updateDoc: jest.fn(),
            getDoc: jest.fn(() => ({
                exists: jest.fn(() => true),
                data: jest.fn(() => ({})),
            })),
        })),
        collection: jest.fn(),
        doc: jest.fn(),
        setDoc: jest.fn(),
        updateDoc: jest.fn(),
        serverTimestamp: jest.fn(() => "mocked_timestamp"),
    };
});


describe("Firebase - createRoom", () => {
    it("should create a room in Firestore", async () => {
        const mockRoomId = "abc123";
        await createRoom(mockRoomId);

        expect(require("firebase/firestore").setDoc).toHaveBeenCalled();
    });
});
