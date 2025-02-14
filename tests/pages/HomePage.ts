import { Page, Locator } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly title: Locator;
    readonly youtubeUrlInput: Locator;
    readonly createSessionButton: Locator;
    readonly videoList: Locator;
    readonly firstVideo: Locator;
    readonly playButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator("h1");
        this.youtubeUrlInput = page.locator('input[name="rid"]');
        this.createSessionButton = page.locator('[data-testid="create-session"]');
        this.videoList = page.locator('[data-testid^="video-item-"]');
        this.firstVideo = this.videoList.first();
        this.playButton = page.locator('button[data-testid="play-video"]');
    }

    async navigate() {
        await this.page.goto("/");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async addVideo(videoUrl: string) {
        await this.page.waitForTimeout(5000);
        await this.youtubeUrlInput.fill(videoUrl);
        await this.page.waitForTimeout(500);
        await this.createSessionButton.click();
        await this.page.waitForSelector('[data-testid^="video-item-"]', { state: "visible", timeout: 15000 });
    }

    async removeVideo() {
        await this.videoList.waitFor({ state: "visible", timeout: 5000 });

        const firstVideo = this.firstVideo;
        await firstVideo.waitFor({ state: "visible", timeout: 5000 });

        const videoId = await firstVideo.getAttribute("data-testid");
        if (!videoId) throw new Error("Video ID not found");

        const removeButton = this.page.locator(`[data-testid="remove-video-${videoId.replace('video-item-', '')}"]`);
        await removeButton.waitFor({ state: "visible", timeout: 5000 });
        await removeButton.click();

        await this.page.waitForSelector(`[data-testid="${videoId}"]`, { state: "detached", timeout: 5000 });

        const videoCount = await this.getVideoCount();
        if (videoCount > 0) {
            console.warn("A remoção do vídeo pode não ter sido bem-sucedida.");
        }
    }

    async getVideoCount(): Promise<number> {
        return this.videoList.count();
    }

    async getFirstVideo(): Promise<Locator> {
        return this.firstVideo;
    }

    async isVideoPlaying(): Promise<boolean> {
        return this.page.evaluate(() => {
            const video = document.querySelector("video") as HTMLVideoElement | null;
            return video ? !video.paused && video.currentTime > 0 : false;
        });
    }

    async isVideoPaused(): Promise<boolean> {
        return this.page.evaluate(() => {
            const video = document.querySelector("video") as HTMLVideoElement | null;
            return video ? video.paused : false;
        });
    }

    async hoverOverVideo() {
        const videoElement = this.page.locator("video");
        await videoElement.waitFor({ state: "attached", timeout: 20000 });
        await videoElement.waitFor({ state: "visible", timeout: 20000 });
        await videoElement.hover();
    }

    async pauseVideo() {
        await this.firstVideo.click();
        await this.page.waitForTimeout(5000);
    }

    async playVideo() {
        await this.firstVideo.click();
        await this.page.waitForTimeout(5000);
    }

    async isPlayButtonVisible(): Promise<boolean> {
        return this.playButton.isVisible();
    }

}
