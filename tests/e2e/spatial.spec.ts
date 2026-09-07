import { expect, test } from "@playwright/test";

test("abstract spatial presentation remains readable across desktop and mobile", async ({ page }) => {
  test.setTimeout(120_000);
  for (const width of [320, 375, 414, 768, 960, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 769 ? 844 : 900 });
    for (const route of ["/", "/work"]) {
      await page.goto(route);
      await expect(page.locator(".project-aura__surface")).toHaveCount(route === "/" ? 5 : 7);
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        clipped: [...document.querySelectorAll(".project-caption strong")].filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.left < -1 || rect.right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 1;
        }).map(node => node.textContent),
      }));
      expect(result.overflow, `${route} at ${width}`).toBeLessThanOrEqual(1);
      expect(result.clipped, `${route} labels at ${width}`).toEqual([]);
      if ([375, 1280, 1440].includes(width)) await page.screenshot({ path: `qa/spatial/${route === "/" ? "home" : "work"}-${width}.png`, fullPage: true });
    }
  }
});

test("a visitor can pause and resume spatial motion without losing project navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const pause = page.getByRole("button", { name: "暂停空间巡航" });
  await pause.click();
  await expect(page.getByRole("button", { name: "继续空间巡航" })).toHaveAttribute("aria-pressed", "true");
  const planet = page.locator(".project-orb").first();
  await page.waitForTimeout(300);
  const x = await planet.evaluate(node => node.getBoundingClientRect().x);
  await page.waitForTimeout(200);
  expect(Math.abs(await planet.evaluate(node => node.getBoundingClientRect().x) - x)).toBeLessThan(0.1);
  await page.getByRole("button", { name: "继续空间巡航" }).click();
  await page.waitForTimeout(350);
  expect(Math.abs(await planet.evaluate(node => node.getBoundingClientRect().x) - x)).toBeGreaterThan(0.2);
  await planet.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/global-opinion/);
});

test("home projects circle in front of and behind the opaque portrait, including on hover and drag", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const universe = page.locator(".universe--home");
  await page.getByRole("button", { name: "暂停空间巡航" }).click();
  await universe.focus();
  const box = (await universe.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.45);
  await page.waitForTimeout(400);
  const visits = new Map<string, Set<string>>();
  let multipleForeground = false;
  for (let step = 0; step < 30; step++) {
    const state = await page.evaluate(() => {
      const avatar = document.querySelector(".universe-avatar")!;
      const ambient = document.querySelector(".universe-avatar__image--ambient")!;
      return {
        avatarZ: Number(getComputedStyle(avatar).zIndex),
        avatarOpacity: getComputedStyle(avatar).opacity,
        ambientOpacity: getComputedStyle(ambient).opacity,
        nodes: [...document.querySelectorAll<HTMLElement>(".universe--home .project-orb")].map(node => ({
          id: node.dataset.project!, plane: node.dataset.plane!, z: Number(getComputedStyle(node).zIndex),
          depth: Number(node.dataset.depth),
          scale: Number.parseFloat(getComputedStyle(node).getPropertyValue("--orbit-scale")),
        })),
      };
    });
    expect(state.avatarOpacity).toBe("1");
    expect(state.ambientOpacity).toBe("1");
    const depthOrdered = [...state.nodes].sort((a, b) => a.depth - b.depth);
    expect(depthOrdered.at(-1)!.scale).toBeGreaterThan(depthOrdered[0].scale * 1.8);
    multipleForeground ||= state.nodes.filter(node => node.plane === "foreground").length > 1;
    for (const node of state.nodes) {
      if (!visits.has(node.id)) visits.set(node.id, new Set());
      visits.get(node.id)!.add(node.plane);
      if (node.plane === "background") expect(node.z).toBeLessThan(state.avatarZ);
      else expect(node.z).toBeGreaterThan(state.avatarZ);
    }
    if ([0, 8, 15, 23].includes(step)) await page.screenshot({ path: `qa/spatial/orbit-phase-${step * 12}.png` });
    await page.keyboard.press("ArrowRight");
  }
  expect(multipleForeground).toBe(true);
  for (const planes of visits.values()) expect([...planes].sort()).toEqual(["background", "foreground"]);

  const back = universe.locator('.project-orb[data-plane="background"]').first();
  await back.hover({ force: true });
  await expect.poll(() => back.evaluate(node => Number(getComputedStyle(node).zIndex))).toBeLessThan(78);
  await back.focus();
  await expect.poll(() => back.evaluate(node => Number(getComputedStyle(node).zIndex))).toBeGreaterThan(78);
  await universe.focus();
  const before = await universe.locator(".project-orb").first().getAttribute("style");
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.75);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.65, { steps: 12 });
  await page.mouse.up();
  await expect(page).toHaveURL(/\/$/);
  expect(await universe.locator(".project-orb").first().getAttribute("style")).not.toBe(before);
});

test("portrait reveals clearly on entry and stays visible over a project, then returns to its dark idle state", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "暂停空间巡航" }).click();
  const portrait = page.locator(".universe-avatar__image--reveal");
  await page.mouse.move(100, 400);
  await expect.poll(() => portrait.evaluate(node => Number(getComputedStyle(node).opacity))).toBe(0);
  await expect(page.locator(".universe-avatar__image--ambient")).toHaveCSS("filter", "saturate(0.45) brightness(0.1)");
  await page.screenshot({ path: "qa/spatial/portrait-idle.png" });
  const box = (await page.locator(".universe--home").boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.45);
  await expect.poll(() => portrait.evaluate(node => Number(getComputedStyle(node).opacity))).toBeGreaterThanOrEqual(0.99);
  await page.screenshot({ path: "qa/spatial/portrait-revealed.png" });
  await page.locator('.universe--home .project-orb[data-plane="foreground"]').first().hover();
  await expect.poll(() => portrait.evaluate(node => Number(getComputedStyle(node).opacity))).toBe(0.85);
  const opacities = await page.locator(".universe--home .project-orb").evaluateAll(nodes => nodes.map(node => getComputedStyle(node).opacity));
  expect(opacities).toEqual(["1", "1", "1", "1", "1"]);
  await page.mouse.move(100, 400);
  await expect.poll(() => portrait.evaluate(node => Number(getComputedStyle(node).opacity))).toBe(0);
});
