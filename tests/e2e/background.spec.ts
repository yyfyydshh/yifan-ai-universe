import { expect, test } from "@playwright/test";

test("archipelago night selection persists through reload and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#loading")).toBeHidden({ timeout: 30_000 });
  await expect(page.locator(".sky-night")).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: "切换到夜晚", exact: true }).click();
  await expect(page.locator(".island-home")).toHaveAttribute("data-theme", "night");
  await expect(page.locator(".sky-night")).toHaveCSS("opacity", "1");
  await page.reload();
  await expect(page.getByRole("button", { name: "切换到白天", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "区域目录", exact: true }).click();
  await page.getByRole("navigation", { name: "区域目录", exact: true }).getByRole("link", { name: /思考山丘/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "思考山丘" })).toBeVisible();
  await expect(page.getByRole("button", { name: "切换到白天", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "切换到白天", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "切换到夜晚", exact: true })).toBeVisible();
});

test("coarse-pointer screens retain seven usable island and directory destinations", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 1024, height: 768 }, hasTouch: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.locator("#loading")).toBeHidden({ timeout: 30_000 });
    await expect(page.locator("[data-zone]")).toHaveCount(7);
    await page.getByRole("button", { name: "区域目录", exact: true }).tap();
    const directory = page.getByRole("navigation", { name: "区域目录", exact: true });
    await expect(directory.getByRole("link")).toHaveCount(7);
    await directory.getByRole("link", { name: /写作小屋/ }).tap();
    await expect(page).toHaveURL(/\/writing\/?$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});

test("renderer failure leaves all seven destinations reachable through the directory", async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
  await page.goto("/");
  await expect(page.locator(".island-home")).toHaveAttribute("data-failed", "true", { timeout: 30_000 });
  await expect(page.locator("#loading")).toHaveText("可从区域目录继续探索。");
  await page.getByRole("button", { name: "区域目录", exact: true }).click();
  const directory = page.getByRole("navigation", { name: "区域目录", exact: true });
  await expect(directory.getByRole("link")).toHaveCount(7);
  await directory.getByRole("link", { name: /工作室/ }).click();
  await expect(page).toHaveURL(/\/work\/?$/);
  await expect(page.locator(".studio-room-objects a.studio-room-object")).toHaveCount(7);
});

test("reduced motion keeps islands steady and project video autoplay paused", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#loading")).toBeHidden({ timeout: 30_000 });
  const island = page.locator("[data-original]");
  const initial = await island.getAttribute("transform");
  await page.waitForTimeout(300);
  expect(await island.getAttribute("transform")).toBe(initial);
  await page.goto("/work/global-opinion");
  await page.locator(".project-disclosure > summary", { hasText: "项目视频与完整技术证据" }).click();
  const video = page.locator("#project-demo video");
  await expect(video).toBeVisible();
  await expect(page.locator(".demo-media-toolbar")).toContainText("减少动态效果");
  expect(await video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true);
});
