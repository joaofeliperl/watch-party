export default {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["<rootDir>/tests/setupFirebase.ts"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["**/tests/unit/**/*.test.ts"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{ts,tsx}"],
};
