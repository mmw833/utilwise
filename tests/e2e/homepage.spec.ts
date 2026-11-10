import { expect, test } from "@playwright/test";

test("Korean homepage loads and calculator search filters results", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/UTILWISE/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("일상에 필요한");

  const search = page.getByRole("textbox", { name: "도구 검색" });
  await search.fill("대출 이자");

  await expect(page.getByRole("link", { name: /대출 이자 계산기/ })).toHaveAttribute("href", "/loan");
  await expect(page.getByRole("link", { name: /퇴직금 계산기/ })).toHaveCount(0);
});

test("English homepage loads with calculator navigation", async ({ page }) => {
  await page.goto("/en");
  await expect(page).toHaveTitle(/UTILWISE/);
  await expect(page.getByRole("heading", { name: "All the tools you need, made simple." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Area Converter" })).toHaveAttribute("href", "/en/area");
});

test("mobile homepage exposes the collapsible navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only navigation check");
  await page.goto("/");
  const menu = page.locator("details.mobile-menu");
  await expect(menu).toBeVisible();
  await menu.locator("summary").click();
  await expect(menu.getByRole("link", { name: "유용한 계산기" })).toBeVisible();
});
