import { expect, test } from "@playwright/test";
import { literaryFragments, fragmentEdited, fragmentOriginal } from "../../lib/humanizer-editor-demo";

test("literary samples preserve their locks, original text and local-only boundary", async ({ page }) => {
  await page.goto("/work/humanizer");
  const sim = page.locator(".he-workbench");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator(".project-tour")).toHaveCount(0);
  for (const fragment of literaryFragments) {
    await sim.getByRole("group", { name: "选择文学片段" }).getByRole("button", { name: fragment.label, exact: true }).click();
    await expect(sim).toHaveAttribute("data-phase", "original");
    const box = await sim.locator(".he-stage").boundingBox();
    await sim.getByRole("button", { name: "试改受保护的句子" }).click();
    await expect(sim.getByRole("status")).toHaveText(fragment.lockReason);
    await expect(sim.locator(".he-protected")).toHaveText(fragment.protectedText);
    await sim.getByRole("button", { name: "橡皮：擦去多余解释", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(sim).toHaveAttribute("data-phase", "edited");
    await expect(sim).toHaveAttribute("data-blocked", "false");
    await expect(sim.locator(".he-protected")).toHaveText(fragment.protectedText);
    expect((await sim.locator(".he-stage").boundingBox())!.height).toBe(box!.height);
    const compare = sim.getByRole("button", { name: "看看改了哪里" });
    await compare.focus(); await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".he-compare-pages article").nth(0).locator("p")).toHaveText(fragmentOriginal(fragment));
    await expect(dialog.locator(".he-compare-pages article").nth(1).locator("p")).toHaveText(fragmentEdited(fragment));
    await expect(dialog.locator(".he-compare-reason")).toHaveText(fragment.reason);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden(); await expect(compare).toBeFocused();
    await sim.getByRole("button", { name: "摸摸小牛" }).click();
    await expect(sim.getByRole("button", { name: "摸摸小牛" })).toHaveAttribute("aria-pressed", "true");
    await sim.getByRole("button", { name: "还原手稿" }).click();
    await expect(sim).toHaveAttribute("data-phase", "original");
    await expect(sim.locator(".he-extra")).toHaveText(fragment.extra);
    await expect(sim.getByRole("button", { name: "摸摸小牛" })).toHaveAttribute("aria-pressed", "false");
    await expect(dialog).toBeHidden();
  }
  await expect(sim.locator(".he-boundary")).toContainText("不判断文字是否由 AI 创作");
  await expect(page.getByRole("navigation", { name: "去 AI 味项目链接" }).locator("a").first()).toHaveAttribute("href", "https://github.com/yyfyydshh/humanizer-literary-suite");
});

test("dragging the eraser only edits when it reaches the highlighted sentence", async ({ page }) => {
  await page.goto("/work/humanizer");
  const sim = page.locator(".he-workbench");
  const eraser = await sim.locator(".he-eraser-body").boundingBox();
  const start = { x: eraser!.x + eraser!.width / 2, y: eraser!.y + eraser!.height / 2 };
  await page.mouse.move(start.x, start.y); await page.mouse.down();
  await page.mouse.move(start.x - 50, start.y + 30, { steps: 5 }); await page.mouse.up();
  await expect(sim).toHaveAttribute("data-phase", "original");
  await expect(sim.getByRole("status")).toContainText("把橡皮拖到标出的句子上");
  const sentence = await sim.locator(".he-extra").boundingBox();
  await page.mouse.move(start.x, start.y); await page.mouse.down();
  await page.mouse.move(sentence!.x + sentence!.width / 2, sentence!.y + sentence!.height / 2, { steps: 12 });
  await expect(sim.locator(".he-extra")).toHaveAttribute("data-over", "true");
  await page.mouse.up();
  await expect(sim).toHaveAttribute("data-phase", "edited");
});

test("touch dragging edits the marked sentence on a phone", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 1000 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/work/humanizer");
  await page.locator(".he-eraser").scrollIntoViewIfNeeded();
  const eraser = (await page.locator(".he-eraser-body").boundingBox())!;
  const sentence = (await page.locator(".he-extra").boundingBox())!;
  const client = await context.newCDPSession(page);
  const start = { x: eraser.x + eraser.width / 2, y: eraser.y + eraser.height / 2 };
  const end = { x: sentence.x + sentence.width / 2, y: sentence.y + sentence.height / 2 };
  await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
  for (let step = 1; step <= 8; step++) {
    await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + (end.x - start.x) * step / 8, y: start.y + (end.y - start.y) * step / 8 }] });
  }
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.locator(".he-workbench")).toHaveAttribute("data-phase", "edited");
  await expect(page.locator(".he-protected")).toHaveText(literaryFragments[0].protectedText);
  await context.close();
});

for (const width of [320, 375, 414, 768, 1440]) {
  test(`manuscript and comparison fit ${width}px without layout shifts`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 }); await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await page.goto("/work/humanizer");
    const sim = page.locator(".he-workbench");
    const sizes: number[] = [];
    for (const fragment of literaryFragments) {
      await sim.getByRole("group", { name: "选择文学片段" }).getByRole("button", { name: fragment.label, exact: true }).click();
      sizes.push((await sim.locator(".he-stage").boundingBox())!.height);
      const audit = await sim.evaluate(element => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        targets: [...element.querySelectorAll<HTMLButtonElement>("button")].filter(button => button.getBoundingClientRect().width > 0 && !button.closest("dialog")).map(button => ({ label:button.getAttribute("aria-label") || button.textContent, height:button.getBoundingClientRect().height })),
      }));
      expect(audit.overflow).toBeLessThanOrEqual(1);
      const paper = await sim.locator(".he-manuscript").boundingBox();
      const footer = await sim.locator(".he-manuscript > footer").boundingBox();
      expect(footer!.y + footer!.height).toBeLessThanOrEqual(paper!.y + paper!.height);
      for (const target of audit.targets) expect(target.height, `${target.label} at ${width}`).toBeGreaterThanOrEqual(44);
      await sim.getByRole("button", { name: "删去多余解释", exact: true }).click();
      await expect(sim).toHaveAttribute("data-phase", "edited");
      await sim.getByRole("button", { name: "看看改了哪里" }).click();
      const box = await page.getByRole("dialog").boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(box!.y).toBeGreaterThanOrEqual(0); expect(box!.y + box!.height).toBeLessThanOrEqual(1000);
      await page.getByRole("button", { name: "收起对照" }).click();
    }
    expect(new Set(sizes).size).toBe(1); expect(errors).toEqual([]);
  });
}
