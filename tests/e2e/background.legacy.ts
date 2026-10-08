import { expect, test } from "@playwright/test";

test("explicit day and night selection persists across reload and content navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto("/");
  const daySky = await page.locator(".world-sky").evaluate(node => getComputedStyle(node).backgroundImage);
  await page.getByRole("button", { name: "切换到夜晚", exact: true }).click();
  await expect(page.getByRole("button", { name: "切换到白天", exact: true })).toBeVisible();
  await expect.poll(() => page.locator(".world-sky").evaluate(node => getComputedStyle(node).backgroundImage)).not.toBe(daySky);
  await page.reload(); await expect(page.getByRole("button", { name: "切换到白天", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "区域目录", exact: true }).click();
  await page.getByRole("navigation", { name: "区域目录", exact: true }).getByRole("link", { name: /思考山丘/ }).click();
  await expect(page).toHaveURL(/\/thoughts\/?$/);
  await expect(page.getByRole("button", { name: "切换到白天", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "思考山丘" })).toBeVisible();
  await page.getByRole("button", { name: "切换到白天", exact: true }).click(); await page.reload();
  await expect(page.getByRole("button", { name: "切换到夜晚", exact: true })).toBeVisible();
});

test("mobile journey contains seven zones and supports ordinary page scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/");
  await expect(page.locator(".world-viewport")).toHaveCount(0);
  const journey = page.getByRole("region", { name: "七区插画目录" });
  await expect(journey.locator("article")).toHaveCount(7);
  await expect(page.getByRole("img", { name: "坐在创作岛上的杨逸凡" })).toBeVisible();
  await expect(journey.getByText("待更新 · 暂未上架", { exact: true })).toHaveCount(4);
  await journey.getByRole("link", { name: "进入思考山丘" }).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await journey.getByRole("link", { name: "进入思考山丘" }).click(); await expect(page).toHaveURL(/\/thoughts\/?$/);
});

test("large coarse-pointer devices receive the illustrated directory", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 1024, height: 768 }, hasTouch: true });
  const page = await context.newPage();
  try {
    await page.goto("/"); expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
    await expect(page.locator(".world-viewport")).toHaveCount(0);
    await expect(page.getByRole("region", { name: "七区插画目录" }).getByRole("link")).toHaveCount(7);
    await page.getByRole("button", { name: "区域目录", exact: true }).click(); await expect(page.getByRole("dialog")).toBeVisible();
  } finally { await context.close(); }
});

test("narrow desktops use the journey while 1024px fine-pointer screens keep the world", async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 900 }); await page.goto("/");
  await expect(page.locator(".world-viewport")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "七区插画目录", exact: true }).getByRole("link")).toHaveCount(7);
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(page.locator(".world-viewport")).toHaveAttribute("data-renderer", "ready", { timeout: 30_000 });
  await expect(page.locator(".world-sign")).toHaveCount(7);
  await expect(page.getByRole("region", { name: "七区插画目录", exact: true })).toHaveCount(0);
});

test("canvas renderer failure leaves every zone reachable through the fallback", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    // Pixi can recover from WebGL failure with Canvas2D. Exercise the actual
    // unavailable-renderer case instead of treating that built-in recovery as a failure.
    HTMLCanvasElement.prototype.getContext = () => null;
    if (typeof OffscreenCanvas !== "undefined") OffscreenCanvas.prototype.getContext = () => null;
    Object.defineProperty(navigator, "gpu", { value: undefined, configurable: true });
  });
  await page.goto("/"); await expect(page.getByRole("status")).toContainText("已切换到插画目录", { timeout: 30_000 });
  await expect(page.getByRole("region", { name: "七区插画目录" }).getByRole("link")).toHaveCount(7);
  await page.getByRole("link", { name: "进入工作室", exact: true }).click(); await expect(page).toHaveURL(/\/work\/?$/);
});

test("reduced motion preserves exploration, prevents drift and pauses video autoplay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/");
  const world = page.locator(".world-viewport"); await expect(world).toHaveAttribute("data-renderer", "ready", { timeout: 30_000 });
  const sign = world.getByRole("button", { name: "工作室，打开预览" }); const start = await sign.boundingBox();
  await world.focus(); await page.keyboard.press("ArrowRight");
  await expect.poll(async () => (await sign.boundingBox())!.x).toBeLessThan(start!.x - 5);
  const moved = await sign.boundingBox();
  // Observe a real interval for unwanted continuous motion.
  await page.waitForTimeout(500); expect(Math.abs((await sign.boundingBox())!.x - moved!.x)).toBeLessThan(1);
  await sign.focus(); await page.keyboard.press("Enter");
  await page.getByRole("dialog").getByRole("link", { name: "进入工作室" }).click();
  await page.locator('a.studio-room-object[href="/work/global-opinion"]').click();
  const video = page.locator("#project-demo video"); await expect(video).toHaveCount(0);
  await page.locator(".project-disclosure > summary", { hasText: "观看项目演示" }).click();
  await expect(video).toBeVisible();
  await expect(page.locator(".demo-media-toolbar")).toContainText("减少动态效果");
  expect(await video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true);
  await expect(page.locator(".world-viewport")).toHaveCount(0);
});

test("breeze controls pause actual atmosphere animations and reduced motion suppresses them", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/");
  await expect(page.locator(".world-viewport")).toHaveAttribute("data-renderer", "ready", { timeout: 30_000 });
  const home = page.locator(".world-home");
  const leaf = page.locator(".breeze-leaf").first();
  const flag = page.locator(".garland-flag").first();
  await expect(home).toHaveAttribute("data-breeze", "true");
  await expect(leaf).toHaveCSS("animation-play-state", "running");
  await page.getByRole("button", { name: "暂停清风动效", exact: true }).click();
  await expect(home).toHaveAttribute("data-breeze", "false");
  await expect(leaf).toHaveCSS("animation-play-state", "paused");
  await expect(flag).toHaveCSS("animation-play-state", "paused");
  await expect(page.locator(".toy-chime > svg")).toHaveCSS("animation-play-state", "paused");
  const resume = page.getByRole("button", { name: "开启清风动效", exact: true });
  await resume.focus(); await page.keyboard.press("Enter");
  await expect(home).toHaveAttribute("data-breeze", "true");
  await expect(leaf).toHaveCSS("animation-play-state", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(leaf).toBeHidden();
  await expect(page.locator(".passing-cloud").first()).toBeHidden();
  await expect(page.locator(".world-pointer-leaf")).toBeHidden();
  await expect(flag).toHaveCSS("animation-name", "none");
  await expect(page.locator(".toy-chime > svg")).toHaveCSS("animation-name", "none");
  await expect(page.getByRole("button", { name: "区域目录", exact: true })).toBeVisible();
});

test("desktop pointer feedback follows the pointer while blank clicks ripple without navigating", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/");
  await expect(page.locator(".world-viewport")).toHaveAttribute("data-renderer", "ready", { timeout: 30_000 });
  const hero = page.locator(".world-hero"); const box = (await hero.boundingBox())!;
  const point = { x: box.x + 78, y: box.y + 78 };
  await page.mouse.move(point.x, point.y);
  await expect.poll(() => hero.evaluate(node => node.style.getPropertyValue("--pointer-visible"))).toBe("1");
  const pointer = await hero.evaluate(node => ({ x: parseFloat(node.style.getPropertyValue("--mouse-x")), unit: parseFloat(node.style.getPropertyValue("--pointer-x")) }));
  expect(Math.abs(pointer.x - 78)).toBeLessThan(2); expect(pointer.unit).toBeLessThan(0);
  await page.mouse.click(point.x, point.y);
  await expect.poll(() => hero.locator(".world-click-ripple").evaluate(node => node.getAnimations().length)).toBeGreaterThan(0);
  await expect(page).toHaveURL(/\/$/);
  // The floating header leaves the hero at the viewport origin; (2, 2) is
  // still inside it. Move to a real element outside the hero to test leave.
  await page.getByRole("contentinfo").hover();
  await expect.poll(() => hero.evaluate(node => node.style.getPropertyValue("--pointer-visible"))).toBe("0");
});
