import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test("portrait artwork keeps one proportional artboard from 320px to 768px without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 900 });
  await page.goto("/");
  const portrait = page.locator(".journey-portrait");
  const selectors = [".journey-ground", ".journey-person img", ".journey-cat img"];
  await portrait.evaluate(async (node, images) => {
    await Promise.all(images.map(selector => (node.querySelector(selector) as HTMLImageElement).decode()));
  }, selectors);
  const measure = () => portrait.evaluate((node, images) => {
    const board = node.getBoundingClientRect();
    return {
      board: { x: board.x, right: board.right, width: board.width, height: board.height },
      images: images.map(selector => {
        const image = node.querySelector(selector)!.getBoundingClientRect();
        return { x: (image.x - board.x) / board.width, y: (image.y - board.y) / board.height, width: image.width / board.width, height: image.height / board.height };
      }),
    };
  }, selectors);
  const baseline = await measure();
  for (const width of [320, 390, 440, 768]) {
    await page.setViewportSize({ width, height: 900 });
    const current = await measure();
    expect(current.board.width).toBeCloseTo(Math.min(width, 440), 1);
    expect(current.board.width / current.board.height).toBeCloseTo(440 / 410, 3);
    expect(current.board.x).toBeGreaterThanOrEqual(0);
    expect(current.board.right).toBeLessThanOrEqual(width);
    await expect(portrait).toHaveCSS("overflow", "hidden");
    current.images.forEach((image, index) => {
      for (const key of ["x", "y", "width", "height"] as const) {
        expect(Math.abs(image[key] - baseline.images[index][key]), `${selectors[index]} ${key} at ${width}px`).toBeLessThan(.001);
      }
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  // This checks responsive geometry only. Painted shoe/grass contact and
  // occlusion still require the separate visual review of the actual artwork.
});

test("real mobile taps animate the portrait and cat, restart their timers and return to rest", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".world-viewport")).toHaveCount(0);
  const portrait = page.locator(".journey-portrait");
  const person = portrait.getByRole("button", { name: "和杨逸凡打个招呼", exact: true });
  const cat = portrait.getByRole("button", { name: "摸摸小牛", exact: true });
  const now = Date.now(); await page.clock.install({ time: now }); await page.clock.pauseAt(now + 100);
  await expect(portrait).toHaveAttribute("data-person-action", "idle");
  await expect(portrait).toHaveAttribute("data-cat-action", "sleep");
  for (const actor of [person, cat]) {
    const box = (await actor.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await person.tap();
  await expect(portrait).toHaveAttribute("data-person-action", "wave");
  await expect(person.locator("img")).toHaveAttribute("src", /\/world\/yifan-wave\.webp$/);
  await expect(portrait.getByRole("status")).toContainText("你好，欢迎来到我的世界。");
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.clock.fastForward(1_800);
  await person.tap(); await page.clock.fastForward(1_000);
  await expect(portrait).toHaveAttribute("data-person-action", "wave");
  await page.clock.fastForward(1_100);
  await expect(portrait).toHaveAttribute("data-person-action", "idle");
  await expect(person.locator("img")).toHaveAttribute("src", /\/world\/yifan-cartoon-v2\.webp$/);
  await expect(portrait.getByRole("status")).toHaveCount(0);

  await cat.tap();
  await expect(portrait).toHaveAttribute("data-cat-action", "stretch");
  await expect(cat.locator("img")).toHaveAttribute("src", /\/world\/cat-stretch\.webp$/);
  await page.clock.fastForward(2_400);
  await expect(portrait).toHaveAttribute("data-cat-action", "awake");
  await expect(cat.locator("img")).toHaveAttribute("src", /\/world\/cat-awake\.webp$/);
  await page.clock.fastForward(3_600);
  await cat.tap(); await page.clock.fastForward(1_000);
  await expect(portrait).toHaveAttribute("data-cat-action", "stretch");
  await page.clock.fastForward(1_400);
  await expect(portrait).toHaveAttribute("data-cat-action", "awake");
  await page.clock.fastForward(4_100);
  await expect(portrait).toHaveAttribute("data-cat-action", "sleep");
  await expect(cat.locator("img")).toHaveAttribute("src", /\/world\/cat-cartoon\.webp$/);
  await expect(portrait.getByRole("status")).toHaveCount(0);
});

test("reduced-motion mobile greetings still expose a separate accessible profile entry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const now = Date.now(); await page.clock.install({ time: now }); await page.clock.pauseAt(now + 100);
  const portrait = page.locator(".journey-portrait");
  await portrait.getByRole("button", { name: "和杨逸凡打个招呼", exact: true }).tap();
  await expect(portrait).toHaveAttribute("data-person-action", "wave");
  await expect(page.getByRole("dialog")).toBeHidden();
  const entry = portrait.getByRole("button", { name: "认识一下", exact: true });
  expect((await entry.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await entry.tap();
  const dialog = page.getByRole("dialog", { name: "你好，我是杨逸凡", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "下载简历", exact: true })).toHaveAttribute("href", /\/resume\/.+\.pdf$/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(entry).toBeFocused();
  await page.clock.fastForward(2_100);
  await expect(portrait).toHaveAttribute("data-person-action", "idle");
});
