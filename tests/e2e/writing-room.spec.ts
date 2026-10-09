import { expect, test } from "@playwright/test";

test("cottage objects open an honest collection, trap focus and return to the room", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/writing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("写作小屋");
  const dialog = page.locator("#writing-book");
  const originalOverflow = await page.evaluate(() => document.body.style.overflow);
  for (const [label, text] of [
    ["桌上文集：翻开文集", "第一篇，留给即将到来的作品"],
    ["主题书架：看看书架", "书架，等文字慢慢住进来"],
    ["一封来信：公众号", "公众号信息待补充"],
  ]) {
    const trigger = page.getByRole("button", { name: label, exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(text);
    await expect(dialog.getByRole("button", { name: "合上文集，回到小屋", exact: true })).toBeFocused();
    for (let index = 0; index < 8; index++) {
      await page.keyboard.press("Tab");
      if (await page.evaluate(() => document.activeElement === document.body)) await page.keyboard.press("Tab");
      expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
    }
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(originalOverflow);
  }
  await expect(page.locator(".writing-article-list li")).toHaveCount(0);
  await expect(page.locator('a[href*="mp.weixin.qq.com"]')).toHaveCount(0);
});

test("day and night preserve hotspot geometry and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/writing");
  const images = page.locator(".writing-room .studio-room-background");
  for (const image of await images.all()) await image.evaluate((node: HTMLImageElement) => node.decode());
  const book = page.getByRole("button", { name: "桌上文集：翻开文集", exact: true });
  const before = await book.boundingBox();
  await page.getByRole("button", { name: "切换到夜晚", exact: true }).click();
  await expect(page.locator(".writing-room-art--night")).toHaveCSS("opacity", "1");
  expect(await book.boundingBox()).toEqual(before);
  await book.click();
  await expect(page.locator("#writing-book")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "回到房间", exact: true }).click();
  await page.getByRole("button", { name: "切换到白天", exact: true }).click();
  await expect(page.locator(".writing-room-art--night")).toHaveCSS("opacity", "0");
});

test("room and reading sheets fit small screens with reachable controls", async ({ page }) => {
  for (const width of [320, 375, 414, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/writing");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const room = page.locator(".studio-room-scroll");
    if (width <= 900) expect(await room.evaluate(node => node.scrollWidth)).toBe(780);
    for (const button of await page.locator(".writing-room-object").all()) {
      await button.scrollIntoViewIfNeeded();
      const bounds = (await button.boundingBox())!;
      expect(bounds.width).toBeGreaterThanOrEqual(44);
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
    const trigger = page.getByRole("button", { name: "翻开文集 · 全部文章", exact: true });
    await trigger.click();
    for (const label of ["所有文章", "按主题读", "关于公众号"]) {
      const dialog = page.locator("#writing-book");
      await dialog.getByRole("button", { name: label, exact: true }).click();
      const box = (await dialog.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(await dialog.evaluate(node => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(900);
    }
    await page.getByRole("button", { name: "回到房间", exact: true }).click();
    await expect(trigger).toBeFocused();
  }
});

test("writing and studio share scene geometry, heading scale, navigation and window chrome", async ({ page }) => {
  await page.setViewportSize({ width: 1822, height: 927 });
  const readStyle = async (selector: string) => page.locator(selector).evaluate(node => {
    const style = getComputedStyle(node);
    return { fontSize: style.fontSize, padding: style.padding, border: style.border, radius: style.borderRadius, background: style.backgroundColor };
  });
  await page.goto("/work");
  const studioCanvas = await page.locator(".studio-room-canvas").boundingBox();
  const studioHeading = await readStyle(".studio-room-heading");
  const studioTitle = await readStyle(".studio-room-heading h1");
  const studioNav = await page.locator(".world-header nav").boundingBox();
  await page.getByRole("button", { name: "打开电脑 · 全部项目", exact: true }).click();
  const studioWindow = await readStyle(".studio-os-window");
  const studioTitlebar = await readStyle(".studio-os-titlebar");
  await page.goto("/writing");
  expect(await page.locator(".studio-room-canvas").boundingBox()).toEqual(studioCanvas);
  expect(await readStyle(".studio-room-heading")).toEqual(studioHeading);
  expect(await readStyle(".studio-room-heading h1")).toEqual(studioTitle);
  expect(await page.locator(".world-header nav").boundingBox()).toEqual(studioNav);
  await expect(page.locator(".studio-room-object-label")).toHaveCount(1);
  await expect(page.locator(".studio-room-help > button")).toHaveCount(1);
  for (const object of await page.locator(".writing-room-object").all()) {
    await object.hover();
    const tooltip = object.getByRole("tooltip");
    await expect(tooltip).toBeVisible();
    const box = (await tooltip.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(1822);
    expect(await object.evaluate(node => getComputedStyle(node, "::before").borderWidth)).toBe("0px");
    await object.click();
    await expect(page.locator("#writing-book")).toBeVisible();
    expect(await readStyle(".studio-os-window")).toEqual(studioWindow);
    expect(await readStyle(".studio-os-titlebar")).toEqual(studioTitlebar);
    await page.keyboard.press("Escape");
  }
});

test.describe("touch cottage", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("swipe-sized room previews secondary objects and opens the collection directly", async ({ page }) => {
    await page.goto("/writing");
    const room = page.locator(".studio-room-scroll");
    const selection = page.getByRole("region", { name: "选中物件介绍", exact: true });
    const dialog = page.locator("#writing-book");
    expect(await room.evaluate(node => node.scrollWidth)).toBeGreaterThan(390);
    for (const [label, title, action, content] of [
      ["主题书架：看看书架", "主题书架", "看看书架", "书架，等文字慢慢住进来"],
      ["一封来信：公众号", "一封来信", "公众号", "公众号信息待补充"],
    ]) {
      const object = page.getByRole("button", { name: label, exact: true });
      await object.scrollIntoViewIfNeeded();
      await object.tap();
      await expect(dialog).toBeHidden();
      await expect(selection.getByRole("heading", { level: 2 })).toHaveText(title);
      await expect(object.getByRole("tooltip")).toBeHidden();
      const enter = selection.getByRole("button", { name: action, exact: true });
      expect((await enter.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await enter.tap();
      await expect(dialog).toContainText(content);
      await dialog.getByRole("button", { name: "回到房间", exact: true }).tap();
      await expect(enter).toBeFocused();
    }
    expect(await room.evaluate(node => node.scrollLeft)).toBeGreaterThan(100);
    for (const label of ["桌上文集：翻开文集", "翻开文集 · 全部文章"]) {
      const trigger = page.getByRole("button", { name: label, exact: true });
      await trigger.scrollIntoViewIfNeeded();
      await trigger.tap();
      await expect(dialog).toContainText("第一篇，留给即将到来的作品");
      await dialog.getByRole("button", { name: "回到房间", exact: true }).tap();
      await expect(trigger).toBeFocused();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
});
