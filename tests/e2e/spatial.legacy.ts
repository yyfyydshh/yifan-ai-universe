import { expect, test, type Locator, type Page } from "@playwright/test";

async function openWorld(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/");
  const world = page.locator(".world-viewport");
  await expect(world).toHaveAttribute("data-renderer", "ready", { timeout: 30_000 });
  await expect(world.getByRole("button", { name: /打开预览/ })).toHaveCount(7);
  return world;
}
async function position(locator: Locator) { const box = await locator.boundingBox(); expect(box).not.toBeNull(); return box!; }
async function pointAtMovingTarget(page: Page, target: Locator) {
  await expect(target).toBeVisible();
  const box = await position(target);
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  // These objects intentionally never become geometrically stable. Verify a
  // real browser hit, then move the pointer without disabling any animation.
  expect(await target.evaluate((node, at) => node.contains(document.elementFromPoint(at.x, at.y)), point)).toBe(true);
  await page.mouse.move(point.x, point.y);
  await expect.poll(() => target.evaluate(node => node.matches(":hover"))).toBe(true);
  return point;
}

test("seven scene labels open previews with honest availability and restore focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const world = await openWorld(page);
  for (const title of ["工作室", "写作小屋", "声音房", "游戏桌", "放映室", "思考山丘", "杂物间"]) {
    await page.getByRole("button", { name: "回到中心", exact: true }).click();
    const sign = world.getByRole("button", { name: new RegExp(`^${title}.*打开预览$`) });
    await sign.focus(); await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: title, exact: true })).toBeVisible();
    if (["声音房", "游戏桌", "放映室", "杂物间"].includes(title)) {
      await expect(dialog).toContainText("作品尚未上架");
      await expect(dialog.getByRole("link", { name: /先去工作室/ })).toHaveAttribute("href", "/work");
    } else await expect(dialog.getByRole("link", { name: `进入${title}` })).toBeVisible();
    await page.keyboard.press("Escape"); await expect(dialog).toBeHidden(); await expect(sign).toBeFocused();
  }
});

test("pan and reset keep navigation distinct from dragging", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); const world = await openWorld(page);
  const sign = world.getByRole("button", { name: "工作室，打开预览" }); const start = await position(sign);
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2); await page.mouse.down();
  await page.mouse.move(start.x + start.width / 2 + 90, start.y + start.height / 2 + 25, { steps: 10 }); await page.mouse.up();
  await expect(page.getByRole("dialog")).toBeHidden(); await expect(page).toHaveURL(/\/$/);
  await expect.poll(async () => Math.abs((await position(sign)).x - start.x)).toBeGreaterThan(20);
  await page.getByRole("button", { name: "回到中心", exact: true }).click();
  await expect.poll(async () => Math.abs((await position(sign)).x - start.x)).toBeLessThan(2);
  await sign.click(); await expect(page.getByRole("dialog").getByRole("heading", { name: "工作室", exact: true })).toBeVisible();
});

test("zoom has upper and lower bounds and reset restores its original scale", async ({ page }) => {
  // This intentionally walks both limits using real button presses. Allow for
  // software WebGL in CI without relaxing any scale or navigation assertion.
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" }); const world = await openWorld(page);
  const sign = world.getByRole("button", { name: "工作室，打开预览" }); const start = await position(sign);
  const beforeZoom = await position(sign); await page.getByRole("button", { name: "放大世界", exact: true }).click();
  await expect.poll(async () => (await position(sign)).width).toBeGreaterThan(beforeZoom.width * 1.04);
  for (let index = 0; index < 6; index++) await page.getByRole("button", { name: "放大世界", exact: true }).click();
  const maximum = await position(sign); await page.getByRole("button", { name: "放大世界", exact: true }).click();
  await expect.poll(async () => Math.abs((await position(sign)).width - maximum.width)).toBeLessThan(1);
  for (let index = 0; index < 10; index++) await page.getByRole("button", { name: "缩小世界", exact: true }).click();
  const minimum = await position(sign); expect(minimum.width).toBeGreaterThan(start.width * .6); expect(minimum.width).toBeLessThan(maximum.width);
  await page.getByRole("button", { name: "回到中心", exact: true }).click();
  await expect.poll(async () => Math.abs((await position(sign)).x - start.x)).toBeLessThan(2);
  await expect.poll(async () => Math.abs((await position(sign)).width - start.width)).toBeLessThan(1);
});

test("folder drag locks the island, cancels safely and remains keyboard accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); const world = await openWorld(page);
  const folder = world.getByRole("button", { name: /客户文件夹/ }); const sign = world.getByRole("button", { name: "工作室，打开预览" });
  const originalSign = await position(sign); const originalFolder = await position(folder);
  const origin = { x: originalFolder.x + originalFolder.width / 2, y: originalFolder.y + originalFolder.height / 2 };
  for (const cancel of ["escape", "blur", "pointercancel"] as const) {
    await page.mouse.move(origin.x, origin.y); await page.mouse.down();
    await page.mouse.move(origin.x + 65, origin.y - 35, { steps: 8 });
    expect(Math.abs((await position(sign)).x - originalSign.x)).toBeLessThan(1);
    if (cancel === "escape") await page.keyboard.press("Escape");
    else if (cancel === "blur") await page.evaluate(() => window.dispatchEvent(new Event("blur")));
    else await world.dispatchEvent("pointercancel", { pointerId: 1, bubbles: true });
    await page.mouse.up(); await expect(page).toHaveURL(/\/$/);
    await expect.poll(async () => Math.abs((await position(folder)).x - originalFolder.x)).toBeLessThan(1);
    await expect(page.getByRole("dialog")).toBeHidden();
  }
  await folder.focus(); await page.keyboard.press("Enter"); await expect(page).toHaveURL(/\/work\/sales-copilot\/?$/);
  await expect(page.locator(".sales-simulator")).toBeVisible();
});

test("dropping a file on the computer opens the sample and back restores the camera", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); const world = await openWorld(page);
  const sign = world.getByRole("button", { name: "工作室，打开预览" }); const initial = await position(sign);
  await world.focus(); await page.keyboard.press("ArrowRight");
  await expect.poll(async () => (await position(sign)).x).toBeLessThan(initial.x - 5);
  const saved = await position(sign); const fileBox = await position(world.getByRole("button", { name: /客户文件夹/ }));
  const computerBox = await position(world.getByRole("link", { name: /电脑，体验 Sales Copilot/ }));
  await page.mouse.move(fileBox.x + fileBox.width / 2, fileBox.y + fileBox.height / 2); await page.mouse.down();
  await page.mouse.move(computerBox.x + computerBox.width / 2, computerBox.y + computerBox.height / 2, { steps: 12 }); await page.mouse.up();
  await expect(page).toHaveURL(/\/work\/sales-copilot\/?$/); await page.goBack();
  await expect(world).toHaveAttribute("data-renderer", "ready", { timeout: 30_000 });
  await expect.poll(async () => Math.abs((await position(sign)).x - saved.x)).toBeLessThan(3);
  await world.focus(); await page.keyboard.press("Home");
  await expect.poll(async () => Math.abs((await position(sign)).x - initial.x)).toBeLessThan(2);
});

test("character and cat provide feedback without requiring dragging", async ({ page }) => {
  const world = await openWorld(page);
  const cat = world.getByRole("button", { name: "摸摸小牛" });
  const person = world.getByRole("button", { name: "和杨逸凡打个招呼" });
  await expect(world).toHaveAttribute("data-cat-action", "sleep");
  await cat.focus(); await page.keyboard.press("Enter");
  await expect(world).toHaveAttribute("data-cat-action", "stretch");
  await expect(world.getByRole("status")).toContainText("喵");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(world).toHaveAttribute("data-cat-action", "awake", { timeout: 4_000 });
  await expect(world).toHaveAttribute("data-cat-action", "sleep", { timeout: 6_000 });
  const personPoint = await pointAtMovingTarget(page, person);
  await expect(world).toHaveAttribute("data-person-action", "wave");
  await page.mouse.click(personPoint.x, personPoint.y);
  await expect(world).toHaveAttribute("data-person-action", "wave");
  await expect(world.getByRole("status")).toContainText("你好，欢迎来到我的世界。");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(world).toHaveAttribute("data-person-action", "idle", { timeout: 4_000 });
  await world.getByRole("button", { name: "认识一下", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "你好，我是杨逸凡" })).toBeVisible();
});

test("actor hover stays borderless while keyboard focus remains visible", async ({ page }) => {
  const world = await openWorld(page);
  for (const label of ["和杨逸凡打个招呼", "摸摸小牛"]) {
    const actor = world.getByRole("button", { name: label, exact: true });
    await pointAtMovingTarget(page, actor);
    await expect(actor).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
    await page.getByRole("button", { name: "回到中心", exact: true }).focus();
    await page.keyboard.press("Tab");
    await actor.focus();
    await expect(actor).toBeFocused();
    expect(await actor.evaluate(node => node.matches(":focus-visible"))).toBe(true);
    const outline = await actor.evaluate(node => ({ width: parseFloat(getComputedStyle(node).outlineWidth), style: getComputedStyle(node).outlineStyle }));
    expect(outline.width).toBeGreaterThanOrEqual(2);
    expect(outline.style).not.toBe("none");
    await actor.blur();
  }
});

test("seven regions float at different offsets, keep labels aligned and freeze when breeze is paused", async ({ page }) => {
  const world = await openWorld(page);
  const snapshot = () => world.evaluate(node => ({
    offsets: (node.getAttribute("data-island-offsets") ?? "").split(",").map(Number),
    labels: [...node.querySelectorAll<HTMLElement>(".world-sign")].map(sign => ({ owner: sign.dataset.islandOwner, offset: Number.parseFloat(sign.style.translate.split(" ")[1]), y: sign.getBoundingClientRect().y })),
    islands: (JSON.parse(node.getAttribute("data-rigid-frame") || '{"islands":[]}') as { islands: { id: string; offsetY: number }[] }).islands,
    camera: node.getAttribute("data-camera"),
  }));
  await expect.poll(async () => {
    const { offsets } = await snapshot();
    return Math.max(...offsets) - Math.min(...offsets);
  }).toBeGreaterThan(1);
  const first = await snapshot();
  expect(first.offsets).toHaveLength(7);
  expect(first.offsets.every(value => Number.isFinite(value) && Math.abs(value) <= 10)).toBe(true);
  await expect.poll(async () => Math.max(...(await snapshot()).labels.map((label, index) => Math.abs(label.y - first.labels[index].y)))).toBeGreaterThan(.5);
  expect((await snapshot()).camera).toBe(first.camera);
  await page.getByRole("button", { name: "暂停清风动效", exact: true }).click();
  await expect(page.locator(".world-home")).toHaveAttribute("data-breeze", "false");
  // The diagnostic Sprite snapshot refreshes every 100ms. Read it after the
  // frozen frame has published, then compare the complete clustered offset.
  await page.waitForTimeout(200);
  const frozen = await snapshot();
  frozen.labels.forEach(label => {
    const island = frozen.islands.find(body => body.id === label.owner);
    expect(island, `label owner ${label.owner}`).toBeDefined();
    expect(Math.abs(label.offset - island!.offsetY)).toBeLessThan(.02);
  });
  // Observe multiple real frames: a pause must stop geometry as well as CSS leaves.
  await page.waitForTimeout(600);
  const after = await snapshot();
  expect(after.offsets).toEqual(frozen.offsets);
  after.labels.forEach((label, index) => expect(Math.abs(label.y - frozen.labels[index].y)).toBeLessThan(.05));
  await page.getByRole("button", { name: "开启清风动效", exact: true }).click();
  await expect.poll(async () => (await snapshot()).offsets).not.toEqual(frozen.offsets);
});

test("reduced motion starts every island at zero offset and preserves actor feedback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const world = await openWorld(page);
  await expect(world).toHaveAttribute("data-island-offsets", "0.00,0.00,0.00,0.00,0.00,0.00,0.00");
  await world.getByRole("button", { name: "摸摸小牛", exact: true }).click();
  await expect(world).toHaveAttribute("data-cat-action", "stretch");
  await expect(world.getByRole("status")).toContainText("喵");
  await page.waitForTimeout(500);
  await expect(world).toHaveAttribute("data-island-offsets", "0.00,0.00,0.00,0.00,0.00,0.00,0.00");
});
