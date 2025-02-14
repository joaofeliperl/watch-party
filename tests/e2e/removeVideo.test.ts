import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test("should remove a video successfully", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();

    const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    await homePage.addVideo(videoUrl);

    const firstVideo = await homePage.getFirstVideo();
    await expect(firstVideo).toBeVisible();

    await homePage.removeVideo();

    await page.waitForTimeout(1000);

    const videoCount = await homePage.getVideoCount();
    expect(videoCount).toBe(0);
});
