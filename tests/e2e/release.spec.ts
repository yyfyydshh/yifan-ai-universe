import { expect, test } from "@playwright/test";

const projects = ["global-opinion", "sales-copilot", "docs-system", "regulatory-risk", "tender-cleaner", "hot-news-brief", "humanizer"];
const pages = ["/", "/work", "/career", "/notes", "/profile", ...projects.map(slug => `/work/${slug}`), "/notes/ai-capability-reuse", "/notes/agent-reliability"];
const widths = [320, 375, 414, 768, 960, 1280, 1440, 1920];

test("responsive matrix keeps titles and the document inside the viewport", async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 941 });
    for (const route of pages) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        clippedTitles: [...document.querySelectorAll("h1, h2")].filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1 || node.scrollWidth > node.clientWidth + 1;
        }).map(node => node.textContent?.trim()),
      }));
      expect(result.overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
      expect(result.clippedTitles, `${route} title clipping at ${width}px`).toEqual([]);
    }
  }
});

test("desktop current navigation follows nested pages", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/work/regulatory-risk");
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toContainText("作品");
  await page.goto("/notes/agent-reliability");
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toContainText("思考");
});

test("universe click, drag threshold, keyboard and reduced motion remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/work");
  const universe = page.locator(".universe--work");
  const firstOrb = universe.locator(".project-orb").first();
  const before = await firstOrb.getAttribute("style");
  await universe.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(80);
  expect(await firstOrb.getAttribute("style")).not.toBe(before);
  const box = await universe.boundingBox();
  expect(box).toBeTruthy();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 + 18, box!.y + box!.height / 2 + 8, { steps: 4 });
  await page.mouse.up();
  await expect(page).toHaveURL(/\/work$/);
  await firstOrb.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\//);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const homeUniverse = page.locator(".universe--home");
  const reducedBefore = await homeUniverse.locator(".project-orb").first().getAttribute("style");
  await page.waitForTimeout(250);
  expect(await homeUniverse.locator(".project-orb").first().getAttribute("style")).toBe(reducedBefore);
});

test("career activates both trajectory entries", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/career");
  await page.locator("#career-2").scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  await expect(page.locator('.career-rail a[aria-current="step"]')).toHaveAttribute("href", "#career-2");
});

test("all seven project workbenches change state at least once", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 941 });
  for (const slug of projects) {
    await page.goto(`/work/${slug}`, { waitUntil: "domcontentloaded" });
    const buttons = await page.locator("main.project-page button:not(:disabled)").all();
    const candidates = [];
    for (const button of buttons) {
      if (await button.evaluate(element => !element.closest(".demo-slot"))) candidates.push(button);
    }
    expect(candidates.length, `${slug} should expose workbench controls`).toBeGreaterThan(0);
    const snapshot = () => page.locator("main.project-page button").evaluateAll(buttons => buttons.map(button => [button.getAttribute("aria-pressed"), button.getAttribute("aria-selected"), button.getAttribute("aria-current"), button.textContent?.trim()].join("|")));
    const before = await snapshot();
    let changed = false;
    for (let index = 0; index < Math.min(candidates.length, 12); index += 1) {
      await candidates[index].click();
      await page.waitForTimeout(80);
      if (JSON.stringify(await snapshot()) !== JSON.stringify(before)) {
        changed = true;
        break;
      }
    }
    expect(changed, `${slug} workbench state should change`).toBe(true);
  }
});

test("resume, mail, phone and GitHub exits are present", async ({ page, request }) => {
  await page.goto("/profile");
  const resume = page.locator('a[href$=".pdf"]');
  expect((await request.get((await resume.getAttribute("href"))!)).ok()).toBeTruthy();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: /联系我/ }).click();
  const contactDialog = page.locator(".contact-dialog");
  await expect(contactDialog.locator('a[href="mailto:1693416144@qq.com"]')).toBeVisible();
  await expect(contactDialog.locator('a[href="tel:+8613028495851"]')).toBeVisible();
  await page.goto("/work/global-opinion");
  await expect(page.locator('.project-meta a[href^="https://github.com/"]')).toHaveCount(1);
});
