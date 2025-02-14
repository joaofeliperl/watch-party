import { test, expect } from "@playwright/test";

test("should load the homepage correctly", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveText("Watch Party");
    await expect(page.locator('input[name="rid"]')).toBeVisible();
    await expect(page.locator('[data-testid="create-session"]')).toBeVisible();
});
