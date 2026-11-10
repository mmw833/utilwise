import { expect, test } from "@playwright/test";

test("volume calculator updates rectangular-prism volume", async ({ page }) => {
  await page.goto("/volume");
  await expect(page.locator("#volume-length")).toHaveValue("100");
  await expect(page.locator(".result strong")).toContainText("0.2 m³");
  await expect(page.getByText("200 L", { exact: true })).toBeVisible();

  await page.locator("#volume-length").fill("200");
  await expect(page.locator(".result strong")).toContainText("0.4 m³");
  await expect(page.getByText("400 L", { exact: true })).toBeVisible();
});

test("volume calculator switches to cylinder inputs and calculates", async ({ page }) => {
  await page.goto("/volume");
  await page.getByRole("button", { name: "원기둥" }).click();
  await expect(page.locator("#volume-diameter")).toBeVisible();
  await expect(page.locator("#volume-width")).toHaveCount(0);
  await expect(page.locator(".result strong")).toContainText("0.028274 m³");
});

test("tip calculator recalculates total and per-person share", async ({ page }) => {
  await page.goto("/tip");
  await expect(page.locator(".result strong")).toContainText("57,500");
  await expect(page.getByText("28,750", { exact: false }).last()).toBeVisible();

  await page.locator("#tip-bill").fill("60000");
  await expect(page.locator(".result strong")).toContainText("69,000");
  await expect(page.getByText("34,500", { exact: false }).last()).toBeVisible();
});

test("tip calculator supports changing tip rate and currency", async ({ page }) => {
  await page.goto("/tip");
  await page.getByRole("button", { name: "20%" }).click();
  await expect(page.locator(".result strong")).toContainText("60,000");

  await page.locator("#tip-currency").selectOption("USD");
  await expect(page.locator(".result strong")).toContainText("$");
});
