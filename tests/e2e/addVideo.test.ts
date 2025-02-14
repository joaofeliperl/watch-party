import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test("should add a video successfully", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();
    await homePage.addVideo("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    const videoCount = await homePage.getVideoCount();
    expect(videoCount).toBeGreaterThan(0);
});
