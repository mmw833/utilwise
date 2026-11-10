import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/en",
  "/about",
  "/en/about",
  "/volume",
  "/en/volume",
  "/qr-code-generator",
  "/en/qr-code-generator",
];

for (const route of publicRoutes) {
  test(`public route renders: ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response, `No document response for ${route}`).not.toBeNull();
    expect(response!.status(), `Unexpected HTTP status for ${route}`).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
  });
}
