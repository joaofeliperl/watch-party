import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    timeout: 30000,
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        trace: "on-first-retry",
        baseURL: "http://localhost:5050",
    },
});
