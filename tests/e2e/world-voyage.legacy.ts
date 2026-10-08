import { expect, test, type Page } from "@playwright/test";
import { zones } from "../../lib/world-data";

async function openVoyage(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".world-viewport")).toHaveAttribute("data-renderer", "ready", { timeout: 30_000 });
  return page.getByRole("region", { name: "环岛漫游", exact: true });
}

async function pauseClock(page: Page) {
  const now = Date.now();
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now + 100);
}

test("optional voyage visits all seven zones manually, discloses pending content and restores the world", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const voyage = await openVoyage(page);
  const launch = voyage.getByRole("button", { name: "带我逛一圈", exact: true });
  const overlay = page.locator(".world-overlay");
  const center = await overlay.evaluate(node => getComputedStyle(node).transform);
  await expect(voyage).toHaveAttribute("data-active", "false");
  await expect(page.locator(".world-sign")).toHaveCount(7);
  await launch.focus(); await page.keyboard.press("Enter");
  await expect(voyage.getByRole("heading", { name: "工作室", exact: true })).toBeFocused();
  await expect(voyage.getByRole("button", { name: "上一站", exact: true })).toBeDisabled();
  await expect.poll(() => overlay.evaluate(node => getComputedStyle(node).transform)).not.toBe(center);
  const workCamera = (await page.locator(".world-viewport").getAttribute("data-camera"))!.split(",").map(Number);
  for (const [index, zone] of zones.entries()) {
    await expect(voyage).toHaveAttribute("data-current-zone", zone.id);
    await expect(voyage.getByRole("heading", { level: 2 })).toHaveText(zone.title);
    await expect(voyage.locator(".voyage-description")).toHaveText(zone.description);
    await expect(voyage.locator(".voyage-progress")).toContainText(`第 ${index + 1} / 7 站`);
    await expect(voyage.getByText("内容待更新", { exact: true })).toHaveCount(zone.status === "coming" ? 1 : 0);
    if (index === 1) {
      // Work and writing must frame different buildings, even when the camera
      // clamps their X coordinates to the same boundary.
      await expect.poll(async () => {
        const writingCamera = (await page.locator(".world-viewport").getAttribute("data-camera"))!.split(",").map(Number);
        return Math.hypot(writingCamera[0] - workCamera[0], writingCamera[1] - workCamera[1]);
      }).toBeGreaterThan(20);
    }
    if (index < zones.length - 1) await voyage.getByRole("button", { name: "下一站", exact: true }).click();
  }
  await expect(voyage.getByRole("button", { name: "下一站", exact: true })).toBeDisabled();
  await expect(voyage.getByRole("status")).toContainText("减少动态效果已开启");
  await voyage.getByRole("button", { name: "上一站", exact: true }).click();
  await expect(voyage).toHaveAttribute("data-current-zone", "thoughts");
  await page.keyboard.press("Escape");
  await expect(voyage).toHaveAttribute("data-active", "false");
  await expect(launch).toBeFocused();
  await expect.poll(() => overlay.evaluate(node => getComputedStyle(node).transform)).toBe(center);
});

test("automatic voyage requires explicit opt-in, advances every six seconds and stops at the last zone", async ({ page }) => {
  const voyage = await openVoyage(page);
  await pauseClock(page);
  await voyage.getByRole("button", { name: "带我逛一圈", exact: true }).click();
  await page.clock.fastForward(12_000);
  await expect(voyage).toHaveAttribute("data-current-zone", "work");
  await expect(voyage).toHaveAttribute("data-automatic", "false");
  await voyage.getByRole("button", { name: "自动漫游", exact: true }).click();
  await page.clock.fastForward(5_999);
  await expect(voyage).toHaveAttribute("data-current-zone", "work");
  await page.clock.fastForward(1);
  await expect(voyage).toHaveAttribute("data-current-zone", "writing");
  for (const zone of zones.slice(2)) {
    await page.clock.fastForward(6_000);
    await expect(voyage).toHaveAttribute("data-current-zone", zone.id);
  }
  await expect(voyage).toHaveAttribute("data-automatic", "false");
  await expect(voyage.getByRole("button", { name: "自动漫游", exact: true })).toBeDisabled();
  await expect(voyage.getByRole("status")).toHaveText("七个角落，已经逛完啦");
  await page.clock.fastForward(18_000);
  await expect(voyage).toHaveAttribute("data-current-zone", "stuff");
});

test("automatic voyage pauses behind dialogs and hidden tabs, then manual navigation cancels it", async ({ page }) => {
  const voyage = await openVoyage(page);
  await pauseClock(page);
  await voyage.getByRole("button", { name: "带我逛一圈", exact: true }).click();
  await voyage.getByRole("button", { name: "自动漫游", exact: true }).click();
  await page.getByRole("button", { name: "区域目录", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(voyage).toHaveAttribute("data-paused", "true");
  await page.clock.fastForward(18_000);
  await expect(voyage).toHaveAttribute("data-current-zone", "work");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(voyage).toHaveAttribute("data-paused", "false");
  await page.clock.fastForward(6_000);
  await expect(voyage).toHaveAttribute("data-current-zone", "writing");
  // Headless browser pages do not become hidden by switching OS windows.
  // Exercise the browser's visibility contract without changing application state.
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(voyage).toHaveAttribute("data-paused", "true");
  await page.clock.fastForward(18_000);
  await expect(voyage).toHaveAttribute("data-current-zone", "writing");
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "visibilityState");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(voyage).toHaveAttribute("data-paused", "false");
  await page.clock.fastForward(6_000);
  await expect(voyage).toHaveAttribute("data-current-zone", "music");
  await voyage.getByRole("button", { name: "下一站", exact: true }).click();
  await expect(voyage).toHaveAttribute("data-current-zone", "games");
  await expect(voyage).toHaveAttribute("data-automatic", "false");
  await page.clock.fastForward(18_000);
  await expect(voyage).toHaveAttribute("data-current-zone", "games");
});

test("reduced motion prevents automatic camera travel without removing manual entry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const voyage = await openVoyage(page);
  await voyage.getByRole("button", { name: "带我逛一圈", exact: true }).click();
  await expect(voyage.getByRole("button", { name: "自动漫游", exact: true })).toBeDisabled();
  await voyage.getByRole("button", { name: "下一站", exact: true }).click();
  await expect(voyage).toHaveAttribute("data-current-zone", "writing");
  await voyage.getByRole("button", { name: "走进这里", exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("写作小屋");
});

test.describe("touch voyage", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("compact tour keeps native scrolling and opens the selected destination through real taps", async ({ page }) => {
    await page.goto("/");
    const voyage = page.getByRole("region", { name: "环岛漫游", exact: true });
    await expect(voyage).toHaveClass(/world-voyage--compact/);
    await voyage.getByRole("button", { name: "带我逛一圈", exact: true }).tap();
    await voyage.getByRole("button", { name: "下一站", exact: true }).tap();
    await voyage.getByRole("button", { name: "下一站", exact: true }).tap();
    await expect(voyage).toHaveAttribute("data-current-zone", "music");
    await expect(voyage.getByText("内容待更新", { exact: true })).toBeVisible();
    for (const button of await voyage.getByRole("button").all()) expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const journey = page.getByRole("region", { name: "七区插画目录", exact: true });
    await journey.getByRole("link", { name: "进入思考山丘", exact: true }).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);
    await voyage.getByRole("button", { name: "走进这里", exact: true }).tap();
    await expect(page).toHaveURL(/\/music\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("声音房");
    await expect(page.getByText("待更新", { exact: true }).first()).toBeVisible();
  });
});
