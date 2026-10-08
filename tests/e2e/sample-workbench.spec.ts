import { expect, test, type Page } from "@playwright/test";
import { tenderPrinterFields, tenderPrinterRows, tenderPrinterSample } from "../../lib/tender-printer-demo";

async function printNotice(page: Page) {
  const desk = page.locator(".tp-desk");
  await dragNotice(page);
  await expect(desk).toHaveAttribute("data-state", "loaded");
  await desk.getByRole("button", { name: "点绿色按钮，清洗并打印字段", exact: true }).click();
  await expect(desk).toHaveAttribute("data-state", "ready");
  await desk.getByRole("button", { name: "查看打印好的结果", exact: true }).click();
  await expect(desk).toHaveAttribute("data-state", "done");
  return desk;
}

async function dragNotice(page: Page) {
  const paper = page.locator(".tp-feed-action");
  await paper.scrollIntoViewIfNeeded();
  const from = (await paper.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + Math.min(80, from.height / 2));
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 15, from.y + 90, { steps: 3 });
  await expect(page.locator(".tp-desk")).toHaveAttribute("data-dragging", "true");
  await page.locator(".tp-feed-target").scrollIntoViewIfNeeded();
  const to = (await page.locator(".tp-feed-target").boundingBox())!;
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 10 });
  await expect(page.locator(".tp-desk")).toHaveAttribute("data-over", "true");
  await expect(page.locator(".tp-person-place")).toHaveAttribute("data-pose", "guide");
  await expect(page.locator(".tp-cat-place")).toHaveAttribute("data-pose", "reach");
  await page.mouse.up();
}

test("printer sample retains canonical fields and source references", () => {
  expect(tenderPrinterFields).toHaveLength(29);
  expect(new Set(tenderPrinterFields).size).toBe(29);
  expect(tenderPrinterRows.map(row => row.field)).toEqual(tenderPrinterFields);
  for (const row of tenderPrinterRows) {
    if (row.sourceIndex !== null) expect(tenderPrinterSample.source[row.sourceIndex]).toBeTruthy();
  }
  for (const field of ["来源链接", "招标金额", "中标人", "中标金额"]) {
    expect(tenderPrinterRows.find(row => row.field === field)?.value).toBe("");
  }
});

test("feed, print and click a field to understand its original evidence", async ({ page }) => {
  await page.goto("/work/tender-cleaner");
  const desk = page.locator(".tp-desk");
  await expect(desk).toContainText("虚构样本");
  await expect(desk.locator(".tp-print-key")).toBeDisabled();
  await printNotice(page);
  await expect(desk.locator(".tp-featured-fields button")).toHaveCount(5);
  await desk.locator(".tp-featured-fields button").filter({ hasText: "项目规模" }).click();
  await expect(desk.locator('.tp-notice-lines p[data-highlight="true"]')).toContainText("1,200 平方米");
  await desk.locator(".tp-featured-fields button").filter({ hasText: "招标金额" }).click();
  await expect(desk.locator(".tp-field-evidence")).toContainText("300 元是标书费");
  await expect(desk.locator('.tp-notice-lines p[data-highlight="true"]')).toContainText("标书费");
  await desk.locator(".tp-featured-fields button").filter({ hasText: "中标人" }).click();
  await expect(desk.locator(".tp-field-evidence")).toContainText("还没有中标结果");
  await desk.locator(".tp-all-fields summary").click();
  await expect(desk.locator(".tp-all-fields button")).toHaveCount(29);
  await expect(desk.locator(".tp-delivery")).toContainText("CSV");
  await expect(desk.locator("a[download]")).toHaveCount(0);
});

test("reset cancels pending printer operations and clears results", async ({ page }) => {
  await page.goto("/work/tender-cleaner");
  const desk = page.locator(".tp-desk");
  await desk.locator(".tp-feed-action").press("Enter");
  await desk.getByRole("button", { name: "再整理一次" }).click();
  await page.waitForTimeout(1000);
  await expect(desk).toHaveAttribute("data-state", "idle");
  await desk.locator(".tp-feed-action").press("Enter");
  await expect(desk).toHaveAttribute("data-state", "loaded");
  await desk.locator(".tp-print-key").click();
  await desk.getByRole("button", { name: "再整理一次" }).click();
  await page.waitForTimeout(3200);
  await expect(desk).toHaveAttribute("data-state", "idle");
  await expect(desk.locator(".tp-result-paper")).toHaveCount(0);
  await printNotice(page);
  await desk.getByRole("button", { name: "再整理一次" }).click();
  await expect(desk.locator(".tp-feed-action")).toBeFocused();
});

test("a click does not feed, and invalid or cancelled drags return the paper", async ({ page }) => {
  await page.goto("/work/tender-cleaner");
  const desk = page.locator(".tp-desk");
  const paper = desk.locator(".tp-feed-action");
  await paper.click();
  await expect(desk).toHaveAttribute("data-state", "idle");
  for (const cancel of ["outside", "Escape", "blur", "resize"]) {
    await paper.scrollIntoViewIfNeeded();
    const box = (await paper.boundingBox())!;
    await page.mouse.move(box.x + 100, box.y + 80);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, box.y + 100);
    await expect(desk).toHaveAttribute("data-dragging", "true");
    if (cancel === "Escape") await page.keyboard.press("Escape");
    if (cancel === "blur") await page.evaluate(() => window.dispatchEvent(new Event("blur")));
    if (cancel === "resize") await page.setViewportSize({ width: 1300, height: 900 });
    await page.mouse.up();
    await expect(desk).toHaveAttribute("data-dragging", "false");
    await expect(desk).toHaveAttribute("data-state", "idle");
    await expect(desk.locator(".tp-drag-paper")).toHaveCount(0);
  }
  await printNotice(page);
});

test("sheet follows the tray perspective and waits for the visitor to read it", async ({ page }) => {
  await page.goto("/work/tender-cleaner");
  const desk = page.locator(".tp-desk");
  await dragNotice(page);
  await expect(desk).toHaveAttribute("data-state", "loaded");
  await desk.locator(".tp-print-key").click();
  await expect(desk).toHaveAttribute("data-state", "printing");
  const slip = desk.locator(".tp-output-slip");
  const first = await slip.evaluate(node => ({ height: node.getBoundingClientRect().height, x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y }));
  await page.waitForTimeout(700);
  const second = await slip.evaluate(node => ({ height: node.getBoundingClientRect().height, x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y }));
  expect(second.height).toBeCloseTo(first.height, 0);
  expect(second.x).toBeGreaterThan(first.x);
  expect(second.y).toBeGreaterThan(first.y);
  await expect(desk).toHaveAttribute("data-state", "ready");
  await expect(desk.locator(".tp-result-paper")).toHaveCount(0);
  const settled = await slip.boundingBox();
  await page.waitForTimeout(1000);
  await expect(desk).toHaveAttribute("data-state", "ready");
  expect(await slip.boundingBox()).toEqual(settled);
  await page.setViewportSize({ width: 1300, height: 900 });
  await expect(desk).toHaveAttribute("data-state", "ready");
  const output = desk.getByRole("button", { name: "查看打印好的结果", exact: true });
  const target = (await output.boundingBox())!;
  expect(target.width).toBeGreaterThanOrEqual(44);
  expect(target.height).toBeGreaterThanOrEqual(44);
  await output.click();
  await expect(desk.locator(".tp-person-place")).toHaveAttribute("data-pose", "receive");
  await expect(desk.locator(".tp-result-paper")).toBeVisible();
  await desk.getByRole("button", { name: "再整理一次" }).click();
  await page.waitForTimeout(1100);
  await expect(desk).toHaveAttribute("data-state", "idle");
  await expect(desk.locator(".tp-output-slip")).toHaveCount(0);
  await expect(desk.locator(".tp-result-paper")).toHaveCount(0);
});

test("touch dragging scrolls toward the feed slot and accepts a real finger release", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/work/tender-cleaner");
  const desk = page.locator(".tp-desk");
  const paper = desk.locator(".tp-feed-action");
  await paper.scrollIntoViewIfNeeded();
  const box = (await paper.boundingBox())!;
  const client = await context.newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + 110, y: box.y + 80 }] });
  await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + 125, y: box.y + 100 }] });
  await expect(desk).toHaveAttribute("data-dragging", "true");
  const before = await page.evaluate(() => scrollY);
  await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 190, y: 825 }] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 50);
  await desk.locator(".tp-feed-target").scrollIntoViewIfNeeded();
  const target = (await desk.locator(".tp-feed-target").boundingBox())!;
  await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: target.x + target.width / 2, y: target.y + target.height / 2 }] });
  await expect(desk).toHaveAttribute("data-over", "true");
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(desk).toHaveAttribute("data-state", "loaded");
  await context.close();
});

test("keyboard and reduced motion maintain focus from feeding to reading", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/tender-cleaner");
  const desk = page.locator(".tp-desk");
  await desk.locator(".tp-feed-action").focus();
  await page.keyboard.press("Enter");
  await expect(desk.locator(".tp-print-key")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(desk.locator(".tp-take-report")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(desk.locator(".tp-featured-fields button").first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(desk.locator(".tp-field-evidence")).toContainText("项目名称");
});

for (const width of [320, 390, 768, 1440]) {
  test(`printer fits ${width}px and remains readable at night`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/work/tender-cleaner");
    const desk = await printNotice(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const key = await desk.locator(".tp-print-key").boundingBox();
    expect(key!.width).toBeGreaterThanOrEqual(44);
    expect(key!.height).toBeGreaterThanOrEqual(44);
    await page.getByRole("button", { name: "切换到夜晚" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
    await expect(desk.locator(".tp-result-paper h3")).toHaveCSS("color", "rgb(45, 73, 59)");
    await expect(desk.locator(".tp-result-paper")).toBeVisible();
  });
}
