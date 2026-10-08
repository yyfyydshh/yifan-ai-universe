import { expect, test } from "@playwright/test";
import { projects } from "../../lib/site-data";

test("studio windows and room lighting follow the day and night control without framing hovered objects", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/work");
  await page.locator(".studio-room-background:not(.studio-room-background-night)").evaluate((image: HTMLImageElement) => image.decode());
  const windows = page.locator(".studio-room-background-night");
  await windows.evaluate((image: HTMLImageElement) => image.decode());
  await expect(windows).toHaveCSS("opacity", "0");
  await expect(page.locator(".zone-continue")).toHaveCount(0);
  await expect(page.locator(".world-footer")).toHaveCount(0);
  await page.getByRole("button", { name: "切换到夜晚" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  await expect(windows).toHaveCSS("opacity", "1");
  const room = page.locator(".studio-room-canvas");
  const sceneBounds = await room.boundingBox(), nightBounds = await windows.boundingBox();
  expect(nightBounds).toEqual(sceneBounds);

  const phone = page.locator('a.studio-room-object[href="/work/sales-copilot"]');
  await phone.hover();
  await expect(phone.getByRole("tooltip")).toBeVisible();
  const frame = await phone.evaluate(node => getComputedStyle(node, "::before").borderWidth);
  expect(frame).toBe("0px");
  await expect.poll(() => phone.evaluate(node => getComputedStyle(node, "::after").opacity)).toBe("1");

  await page.getByRole("button", { name: "切换到白天" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "day");
  await expect(windows).toHaveCSS("opacity", "0");
});

test("seven room objects expose descriptions on hover and keyboard focus, then enter the real project", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/work");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("我的工作室");
  const objects = page.locator(".studio-room-objects a.studio-room-object");
  await expect(objects).toHaveCount(7);
  for (const project of projects) {
    const object = objects.filter({ has: page.locator(`[id="room-tip-${project.slug}"]`) });
    const tooltip = object.getByRole("tooltip");
    await expect(object).toHaveAttribute("href", `/work/${project.slug}`);
    await object.hover();
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator("b")).toHaveText(project.shortTitle);
    await expect(tooltip).toContainText("点击进入项目");
    expect((await tooltip.locator(":scope > span").innerText()).length).toBeGreaterThan(8);
    await page.mouse.move(2, 2);
    await expect(tooltip).toBeHidden();
    await page.keyboard.press("Tab");
    await object.focus();
    await expect(object).toBeFocused(); await expect(tooltip).toBeVisible();
    const bounds = await tooltip.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(1440);
  }
  const first = page.locator('a.studio-room-object[href="/work/global-opinion"]');
  await first.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/global-opinion\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(projects[0].title);
  await page.locator('.op-back[href="/work"]').click();
  await page.locator('a.studio-room-object[href="/work/sales-copilot"]').click();
  await expect(page).toHaveURL(/\/work\/sales-copilot\/?$/);
  await expect(page.locator(".sales-simulator")).toBeVisible();
});

test("computer window opens from both controls, traps keyboard focus and returns it to its trigger", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/work");
  const dialog = page.getByRole("dialog", { name: "工作室电脑", exact: true });
  const originalOverflow = await page.evaluate(() => document.body.style.overflow);
  for (const label of ["打开工作室电脑，查看全部项目", "打开电脑 · 全部项目"]) {
    const trigger = page.getByRole("button", { name: label, exact: true });
    await expect(dialog).toBeHidden();
    await trigger.focus(); await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "关闭电脑窗口", exact: true })).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await expect(dialog.locator(".studio-tool")).toHaveCount(7);
    for (const project of projects) {
      const link = dialog.locator(`.studio-tool[href="/work/${project.slug}"]`);
      await expect(link).toBeVisible(); await expect(link.getByRole("heading", { level: 3 })).toHaveText(project.shortTitle);
    }
    for (let index = 0; index < 14; index++) {
      await page.keyboard.press("Tab");
      if (await page.evaluate(() => document.activeElement === document.body)) await page.keyboard.press("Tab");
      expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden(); await expect(trigger).toBeFocused();
    // Native dialog closes before React's effect cleanup restores scrolling.
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(originalOverflow);
    await trigger.click();
    await dialog.getByRole("button", { name: "关闭电脑窗口", exact: true }).click();
    await expect(dialog).toBeHidden(); await expect(trigger).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(originalOverflow);
  }
});

test("computer project directory opens a real project and releases modal scroll locking", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("button", { name: "打开电脑 · 全部项目", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "工作室电脑", exact: true });
  await dialog.locator(".studio-directory > summary").click();
  await expect(dialog.locator(".studio-directory > div > a")).toHaveCount(7);
  await dialog.locator('.studio-tool[href="/work/tender-cleaner"]').click();
  await expect(page).toHaveURL(/\/work\/tender-cleaner\/?$/);
  await expect(page.locator('.tp-desk')).toBeVisible();
  await expect(page.locator(".studio-os-window")).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test.describe("touch room", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("real taps select all seven objects without navigating, with a clear entry link", async ({ page }) => {
    await page.goto("/work");
    const room = page.getByRole("region", { name: "木屋工作室，左右滑动可以看完整个房间", exact: true });
    const selection = page.getByRole("region", { name: "选中物件介绍", exact: true });
    const dimensions = await room.evaluate(node => ({ client: node.clientWidth, scroll: node.scrollWidth }));
    expect(dimensions.scroll).toBeGreaterThan(dimensions.client);
    await expect(selection).toHaveAttribute("data-selected", "false");
    let furthestScroll = 0;
    for (const project of projects) {
      const object = page.locator(`a.studio-room-object[href="/work/${project.slug}"]`);
      await object.scrollIntoViewIfNeeded(); await object.tap();
      await expect(page).toHaveURL(/\/work\/?$/);
      await expect(object).toHaveAttribute("data-selected", "true");
      await expect(selection).toHaveAttribute("data-selected", "true");
      await expect(selection.getByRole("heading", { level: 2 })).toHaveText(project.shortTitle);
      const enter = selection.getByRole("link", { name: "进入项目", exact: true });
      await expect(enter).toHaveAttribute("href", `/work/${project.slug}`);
      expect((await enter.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await expect(object.getByRole("tooltip")).toBeHidden();
      furthestScroll = Math.max(furthestScroll, await room.evaluate(node => node.scrollLeft));
    }
    expect(furthestScroll).toBeGreaterThan(100);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await selection.getByRole("link", { name: "进入项目", exact: true }).tap();
    await expect(page).toHaveURL(/\/work\/humanizer\/?$/);
    await expect(page.locator(".writing-simulator")).toBeVisible();
  });

  test("mobile computer remains reachable and its projects work through real taps", async ({ page }) => {
    await page.goto("/work");
    const trigger = page.getByRole("button", { name: "打开电脑 · 全部项目", exact: true });
    await trigger.tap();
    const dialog = page.getByRole("dialog", { name: "工作室电脑", exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".studio-tool")).toHaveCount(7);
    const bounds = await dialog.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0); expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
    await dialog.getByRole("button", { name: "回到房间", exact: true }).tap();
    await expect(dialog).toBeHidden(); await expect(trigger).toBeFocused();
    await trigger.tap();
    await dialog.locator('.studio-tool[href="/work/docs-system"]').tap();
    await expect(page).toHaveURL(/\/work\/docs-system\/?$/);
    await expect(page.locator(".db-book")).toBeVisible();
    await expect(page.locator(".world-footer")).toHaveCount(1);
  });
});
