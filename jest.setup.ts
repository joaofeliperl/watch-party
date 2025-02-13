import { jest } from "@jest/globals";
import "dotenv/config";


jest.mock("firebase/app", () => {
    return {
        initializeApp: jest.fn(() => ({
            name: "[DEFAULT]",
        })),
        getApps: jest.fn(() => [{ name: "[DEFAULT]" }]),
        getApp: jest.fn(() => ({
            name: "[DEFAULT]",
        })),
    };
});


jest.mock("firebase/firestore", () => {
    return {
        getFirestore: jest.fn(() => ({
            collection: jest.fn(() => ({
                doc: jest.fn(() => ({
                    set: jest.fn(),
                    get: jest.fn(() => ({
                        exists: jest.fn(() => true),
                        data: jest.fn(() => ({
                            id: "mocked-id",
                            name: "Mocked Data",
                        })),
                    })),
                })),
            })),
            doc: jest.fn(() => ({
                set: jest.fn(),
                get: jest.fn(() => ({
                    exists: jest.fn(() => true),
                    data: jest.fn(() => ({
                        id: "mocked-doc-id",
                        value: "Mocked Value",
                    })),
                })),
            })),
            setDoc: jest.fn(),
            updateDoc: jest.fn(),
            getDoc: jest.fn(() => ({
                exists: jest.fn(() => true),
                data: jest.fn(() => ({
                    id: "mocked-id",
                    name: "Mocked Name",
                })),
            })),
            deleteDoc: jest.fn(),
        })),
    };
});
