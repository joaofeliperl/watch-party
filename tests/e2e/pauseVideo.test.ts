import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test("should pause a playing video successfully", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();
    await homePage.addVideo("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    await page.waitForTimeout(5000);

    const firstVideo = page.locator('[data-testid^="video-item-"]').first();
    await firstVideo.waitFor({ state: "visible", timeout: 10000 });

    await page.waitForTimeout(5000);

    await expect(await homePage.isPlayButtonVisible()).toBeFalsy();

    await homePage.pauseVideo();
    await page.waitForTimeout(5000);

    await expect(await homePage.isPlayButtonVisible()).toBeTruthy();
});
