import { expect, test } from "@playwright/test";

const route = "/work/global-opinion";

test("visitors collect, remove a duplicate and open the resulting report through objects", async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("全球舆情与品牌口碑分析 Skill");
  await page.getByRole("button", { name: "动手整理一次" }).click();
  const globe = page.getByRole("button", { name: "点地球仪，收集全球信息" });
  await expect(globe).toBeFocused();
  await expect(page.getByRole("button", { name: "打开分析报告" })).toHaveCount(0);
  await globe.click();
  const duplicate = page.getByRole("button", { name: "把重复新闻放进纸篓" });
  await expect(duplicate).toBeEnabled();
  await expect(page.locator(".op-toy-paper")).toHaveCount(4);
  await expect(page.locator(".op-toy-paper").filter({ hasText: "售后咨询讨论" })).toHaveCount(2);
  await duplicate.click();
  const folder = page.getByRole("button", { name: "打开分析报告" });
  await expect(folder).toBeVisible();
  await expect(duplicate).toHaveCount(0);
  await expect(page.locator(".op-toy-paper")).toHaveCount(3);
  await expect(page.locator(".op-kept-note")).toContainText("来源已保留");
  await folder.click();
  await expect(page.locator(".op-toy-report")).toContainText("售后体验");
  await expect(page.locator(".op-report-delivery")).toContainText("可复用的数据");
  for (const [id, title] of [["EV-014", "售后咨询量上升的讨论"], ["EV-028", "维修等待体验反馈"], ["EV-041", "服务说明页面更新"]]) {
    await page.getByRole("button", { name: id, exact: true }).click();
    await expect(page.locator(".op-report-original")).toContainText(title);
    await expect(page.locator(".op-report-original")).toContainText("演示原文");
    await expect(page.locator(".op-toy-paper[data-highlight='true']")).toContainText(id);
  }
  await page.getByRole("button", { name: "EV-041", exact: true }).click();
  await expect(page.locator(".op-report-original")).toHaveCount(0);
});

test("restarting during motion cancels the pending result and restores the objects", async ({ page }) => {
  await page.goto(route);
  const globe = page.getByRole("button", { name: "点地球仪，收集全球信息" });
  await globe.click();
  await page.getByRole("button", { name: "重新整理" }).click();
  await page.waitForTimeout(1400);
  await expect(page.locator(".op-play-desk")).toHaveAttribute("data-state", "idle");
  await expect(globe).toBeEnabled();
  await expect(page.locator(".op-toy-paper")).toHaveCount(0);
  await globe.click();
  await page.getByRole("button", { name: "把重复新闻放进纸篓" }).click();
  await page.getByRole("button", { name: "重新整理" }).click();
  await page.waitForTimeout(900);
  await expect(page.getByRole("button", { name: "打开分析报告" })).toHaveCount(0);
  await expect(globe).toBeFocused();
});

test("objects support touch-sized targets, keyboard and reduced motion across widths", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 414, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(route);
    await page.getByRole("button", { name: "动手整理一次" }).click();
    await page.keyboard.press("Enter");
    const duplicate = page.getByRole("button", { name: "把重复新闻放进纸篓" });
    await expect(duplicate).toBeFocused();
    await page.keyboard.press("Enter");
    const folder = page.getByRole("button", { name: "打开分析报告" });
    await expect(folder).toBeFocused();
    const box = await folder.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "EV-028", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".op-report-original")).toContainText("预计完成时间");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${width}px overflow after evidence expands`).toBeLessThanOrEqual(1);
    await page.getByRole("button", { name: "重新整理" }).click();
    await expect(page.locator(".op-toy-report")).toHaveCount(0);
  }
});
