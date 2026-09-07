import { expect, test } from "@playwright/test";

for (const route of ["/", "/work"]) {
  test(`star atlas reveals locally, persists at rest and fades after leaving on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    const atlas = page.locator(".interactive-starfield");
    await expect(atlas).toBeVisible();
    await expect(atlas).toHaveAttribute("data-ready", "true");
    const ink = async (point: { x: number; y: number }) => atlas.evaluate((node, center) => {
      const canvas = node as HTMLCanvasElement;
      const bounds = canvas.getBoundingClientRect();
      const scale = canvas.width / bounds.width;
      const x = Math.round((center.x - bounds.left - 100) * scale);
      const y = Math.round((center.y - bounds.top - 100) * scale);
      const pixels = canvas.getContext("2d")!.getImageData(x, y, 200 * scale, 200 * scale).data;
      let alpha = 0;
      for (let i = 3; i < pixels.length; i += 4) alpha += pixels[i];
      return alpha;
    }, point);
    const first = { x: 800, y: 220 };
    const second = { x: 1260, y: 700 };
    expect(await ink(first)).toBe(0);
    await page.mouse.move(first.x, first.y);
    await expect(atlas).toHaveAttribute("data-active", "true");
    await expect.poll(() => ink(first)).toBeGreaterThan(200);
    expect(await ink(second)).toBe(0);
    await page.waitForTimeout(1100);
    expect(await ink(first)).toBeGreaterThan(200);
    await page.screenshot({ path: `qa/spatial/${route === "/" ? "home" : "work"}-atlas-active.png` });
    await page.mouse.move(second.x, second.y);
    await expect.poll(() => ink(second)).toBeGreaterThan(200);
    await expect.poll(() => ink(first)).toBe(0);
    await page.mouse.move(300, 25);
    await expect(atlas).toHaveAttribute("data-active", "false");
    await expect.poll(() => ink(second)).toBe(0);
  });
}

test("background interaction is limited to two pages and respects motion and mobile preferences", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of ["/career", "/profile", "/notes", "/notes/agent-reliability", "/work/global-opinion"]) {
    await page.goto(route);
    await expect(page.locator(".interactive-starfield")).toHaveCount(0);
  }
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(800, 220);
  await expect(page.locator(".interactive-starfield")).toBeHidden();
  await expect(page.locator(".interactive-starfield")).toHaveAttribute("data-active", "false");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 375, height: 844 });
  await expect(page.locator(".interactive-starfield")).toBeHidden();
});

for (const route of ["/", "/work"]) {
  test(`meteor trail, cursor and scroll respond without taking over navigation on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    const atlas = page.locator(".interactive-starfield");
    const cursor = page.locator(".stellar-cursor");
    await expect(atlas).toHaveAttribute("data-ready", "true");
    await page.mouse.move(720, 210);
    await page.mouse.move(960, 260, { steps: 16 });
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await expect(page.locator(".meteor-overlay")).toHaveAttribute("data-active", "true");
    await page.screenshot({ path: `qa/spatial/${route === "/" ? "home" : "work"}-meteor.png` });
    await page.mouse.wheel(0, 260);
    await expect.poll(() => atlas.evaluate(node => Number.parseFloat(getComputedStyle(node.parentElement!).getPropertyValue("--scroll-depth"))))
      .toBeGreaterThan(8);
    await page.screenshot({ path: `qa/spatial/${route === "/" ? "home" : "work"}-scroll.png` });
    await page.evaluate(() => scrollTo(0, 0));
    const link = page.locator(".project-orb").first();
    await link.hover({ force: true });
    await expect(cursor).toHaveAttribute("data-action", "link");
    await page.mouse.move(200, 25);
    await expect(cursor).toHaveAttribute("data-visible", "false");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.mouse.move(800, 220);
    await expect(cursor).toHaveAttribute("data-visible", "false");
    await page.goto("/career");
    await expect(cursor).toHaveCount(0);
  });
}
