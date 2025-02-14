import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test("should add multiple videos successfully", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();

    const videos = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
        "https://www.youtube.com/watch?v=l482T0yNkeo"
    ];

    for (const video of videos) {
        await homePage.addVideo(video);
        await page.waitForTimeout(3000);
    }

    const videoCount = await homePage.getVideoCount();
    expect(videoCount).toBe(videos.length);
});
