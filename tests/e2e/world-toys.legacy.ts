import { expect, test } from "@playwright/test";
import { notes } from "../../lib/site-data";

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test.describe(`island toys at ${viewport.width}px`, () => {
  test.use({ viewport, hasTouch: viewport.width < 768, isMobile: viewport.width < 768 });
  test(`all eight island toys work and keep their meaning at ${viewport.width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize(viewport); await page.goto("/");
    if (viewport.width > 767) await expect(page.locator(".world-viewport")).toHaveAttribute("data-renderer", "ready", { timeout: 30_000 });
    const toys = page.locator(viewport.width > 767 ? ".world-viewport .world-toys" : ".world-toys--compact");
    await expect(toys.locator(".world-toy")).toHaveCount(8);
    await expect(toys.locator(".toy-record")).toHaveAttribute("aria-pressed", "false");
    const plane = toys.getByRole("button", { name: "放飞纸飞机", exact: true });
    await plane[viewport.width < 768 ? "tap" : "click"](); await expect(toys.getByRole("status")).toContainText("纸飞机绕着小岛飞一圈");
    await expect(plane).toHaveClass(/is-flying/);
    await expect(plane).not.toHaveClass(/is-flying/, { timeout: 8_000 });
    const record = toys.locator(".toy-record");
    await record[viewport.width < 768 ? "tap" : "click"](); await expect(record).toHaveAttribute("aria-pressed", "true");
    await expect(toys.getByRole("status")).toContainText("示例旋律");
    await record[viewport.width < 768 ? "tap" : "click"](); await expect(record).toHaveAttribute("aria-pressed", "false");
    await expect(toys.getByRole("status")).toContainText("唱片暂停了");

    const home = page.locator(".world-home");
    await page.getByRole("button", { name: "暂停清风动效", exact: true })[viewport.width < 768 ? "tap" : "click"]();
    await expect(home).toHaveAttribute("data-breeze", "false");
    await toys.getByRole("button", { name: "拨动风铃，吹来一阵清风", exact: true })[viewport.width < 768 ? "tap" : "click"]();
    await expect(home).toHaveAttribute("data-breeze", "true");
    await expect(page.locator(".world-atmosphere")).toHaveClass(/has-gust/);
    await expect(toys.getByRole("status")).toContainText("风铃也跟着轻轻晃了起来");

    const jar = toys.locator(".toy-jar");
    for (let count = 1; count <= 3; count++) {
      await jar[viewport.width < 768 ? "tap" : "click"](); await expect(jar).toHaveAttribute("aria-label", `收集灵感，已收藏 ${count} 颗星星`);
    }
    await jar[viewport.width < 768 ? "tap" : "click"](); await expect(jar).toContainText("3 / 3 颗灵感");
    await expect(toys.getByRole("status")).toContainText("三颗灵感装满了");

    const notebook = toys.getByRole("button", { name: "翻开随手笔记", exact: true });
    await notebook.focus(); await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText("随手记下的想法");
    await expect(dialog.getByRole("button", { name: "上一页", exact: true })).toBeDisabled();
    for (const [index, note] of notes.entries()) {
      await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(note.title);
      const section = note.conclusionType === "个人随笔" ? "writing" : "thoughts";
      await expect(dialog.getByRole("link", { name: "读这篇文章", exact: true })).toHaveAttribute("href", `/${section}/${note.slug}`);
      if (index < notes.length - 1) await dialog.getByRole("button", { name: "下一页", exact: true })[viewport.width < 768 ? "tap" : "click"]();
    }
    await expect(dialog.getByRole("button", { name: "下一页", exact: true })).toBeDisabled();
    await dialog.getByRole("button", { name: "上一页", exact: true })[viewport.width < 768 ? "tap" : "click"]();
    await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(notes[notes.length - 2].title);
    await page.keyboard.press("Escape"); await expect(dialog).toBeHidden(); await expect(notebook).toBeFocused();

    await toys.getByRole("button", { name: "游戏桌，掷一次骰子", exact: true })[viewport.width < 768 ? "tap" : "click"]();
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText("在游戏桌边歇一会儿");
    await dialog.getByRole("button", { name: "掷一次", exact: true })[viewport.width < 768 ? "tap" : "click"]();
    await expect(dialog.getByRole("status")).toHaveText(/^第 1 次：[1-6] 点。/);
    await dialog.getByRole("button", { name: /^骰子是 [1-6] 点，再掷一次$/ })[viewport.width < 768 ? "tap" : "click"]();
    await expect(dialog.getByRole("status")).toHaveText(/^第 2 次：[1-6] 点。/);
    const result = (await dialog.getByRole("status").innerText()).match(/：([1-6]) 点/)![1];
    await expect(dialog.locator(".die-dot")).toHaveCount(Number(result));
    await page.keyboard.press("Escape");

    await toys.getByRole("button", { name: "相机，拍一张插画明信片", exact: true })[viewport.width < 768 ? "tap" : "click"]();
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText("给今天，留一张明信片");
    await expect(dialog.getByRole("button", { name: "按下快门", exact: true })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "保存明信片", exact: true })).toHaveCount(0);
    await page.keyboard.press("Escape");

    await toys.getByRole("button", { name: "打开信箱，联系杨逸凡", exact: true })[viewport.width < 768 ? "tap" : "click"]();
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText("一起聊聊");
    await expect(dialog.getByRole("link", { name: "1693416144@qq.com", exact: true })).toHaveAttribute("href", "mailto:1693416144@qq.com");
    await expect(dialog.getByRole("img", { name: "杨逸凡的微信二维码", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
  });
}

test("notebook article navigation follows its destination and closes the modal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/");
  await page.getByRole("button", { name: "翻开随手笔记", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("link", { name: "读这篇文章", exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/human-future-and-dried-fruit\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(notes[0].title);
  await expect(dialog).toBeHidden();
});

test.describe("touch camera", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("postcard is generated locally as a real PNG and can be downloaded", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "相机，拍一张插画明信片", exact: true }).tap();
    const dialog = page.getByRole("dialog", { name: "给今天，留一张明信片", exact: true });
    await expect(dialog.getByRole("link", { name: "保存明信片", exact: true })).toHaveCount(0);
    const writes: string[] = [];
    page.on("request", request => { if (!["GET", "HEAD"].includes(request.method())) writes.push(`${request.method()} ${request.url()}`); });
    await dialog.getByRole("button", { name: "按下快门", exact: true }).tap();
    await expect(dialog.getByRole("status")).toContainText("已生成插画明信片");
    const postcard = dialog.getByRole("img", { name: "杨逸凡和小牛的插画明信片", exact: true });
    await expect(postcard).toBeVisible();
    const dimensions = await postcard.evaluate(async node => {
      const image = node as HTMLImageElement; await image.decode();
      return { width: image.naturalWidth, height: image.naturalHeight };
    });
    expect(dimensions).toEqual({ width: 1200, height: 900 });
    const save = dialog.getByRole("link", { name: "保存明信片", exact: true });
    await expect(save).toHaveAttribute("href", /^data:image\/png;base64,/);
    await expect(save).toHaveAttribute("download", "杨逸凡的世界-插画明信片.png");
    const downloadEvent = page.waitForEvent("download");
    await save.tap(); const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe("杨逸凡的世界-插画明信片.png");
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    const png = Buffer.concat(chunks);
    expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    expect(png.readUInt32BE(16)).toBe(1200); expect(png.readUInt32BE(20)).toBe(900);
    expect(png.length).toBeGreaterThan(20_000);
    await dialog.getByRole("button", { name: "重新拍一张", exact: true }).tap();
    await expect(dialog.getByRole("status")).toContainText("已生成插画明信片");
    expect(writes).toEqual([]);
  });
});
