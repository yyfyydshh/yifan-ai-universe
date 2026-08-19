import { expect, test } from "@playwright/test";

const projects = [
  "global-opinion",
  "sales-copilot",
  "docs-system",
  "regulatory-risk",
  "tender-cleaner",
  "hot-news-brief",
  "humanizer",
];

const publicPages = [
  "/",
  "/work",
  "/career",
  "/notes",
  "/profile",
  ...projects.map(slug => `/work/${slug}`),
  "/notes/ai-capability-reuse",
  "/notes/agent-reliability",
];

test("18 release endpoints respond and lab redirects", async ({ request, page }) => {
  for (const route of [...publicPages, "/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) {
    const response = await request.get(route);
    expect(response.ok(), `${route} should respond`).toBeTruthy();
  }
  const lab = await request.get("/lab", { maxRedirects: 0 });
  // Playwright may expose either the redirect response or the followed /work response.
  expect([200, 307, 308]).toContain(lab.status());
  await page.goto("/lab");
  await expect(page).toHaveURL(/\/work$/);
});

test("project universes retain five and seven navigable projects", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".universe--home .project-orb")).toHaveCount(5);
  await page.goto("/work");
  await expect(page.locator(".universe--work .project-orb")).toHaveCount(7);
});

test("mobile navigation, current page and contact panel are accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work/global-opinion");
  const trigger = page.locator(".mobile-nav-trigger");
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const firstLink = page.locator("#mobile-site-nav a").first();
  await expect(firstLink).toBeFocused();
  await expect(page.locator('#mobile-site-nav a[aria-current="page"]')).toContainText("作品");
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page.locator("#mobile-site-nav").getByRole("button", { name: /联系我/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img", { name: "杨逸凡的微信二维码" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /1693416144@qq.com/ })).toHaveAttribute("href", "mailto:1693416144@qq.com");
  await expect(dialog.getByRole("link", { name: /130 2849 5851/ })).toHaveAttribute("href", "tel:+8613028495851");
});

test("desktop contact panel is centered in the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: /联系我/ }).click();
  const box = await page.getByRole("dialog").boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs((box!.x + box!.width / 2) - 720)).toBeLessThanOrEqual(2);
  expect(Math.abs((box!.y + box!.height / 2) - 450)).toBeLessThanOrEqual(2);
});

test("projects and articles expose canonical and sharing metadata", async ({ page }) => {
  await page.goto("/work/global-opinion");
  await expect(page).toHaveTitle(/全球舆情与品牌口碑分析 Skill｜杨逸凡/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/work\/global-opinion$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /global-opinion-agent-demo-poster\.jpg$/);
  await page.goto("/notes/agent-reliability");
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
});

test("all project videos and posters resolve without subtitle tracks", async ({ page, request }) => {
  for (const slug of projects) {
    await page.goto(`/work/${slug}`);
    const video = page.locator("#project-demo video");
    await expect(video).toBeVisible();
    const src = await video.locator("source").getAttribute("src");
    const poster = await video.getAttribute("poster");
    expect(src).toBeTruthy();
    expect(poster).toBeTruthy();
    expect((await request.get(src!)).ok()).toBeTruthy();
    expect((await request.get(poster!)).ok()).toBeTruthy();
    await expect(video.locator('track[kind="captions"]')).toHaveCount(0);
  }
});

test("core pages have no horizontal overflow, broken image or duplicate id", async ({ page }) => {
  test.setTimeout(120_000);
  for (const route of publicPages) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(80);
    const audit = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map(node => node.id);
      const brokenImages = [...document.images].filter(image => image.complete && image.naturalWidth === 0).map(image => image.currentSrc || image.src);
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
        brokenImages,
      };
    });
    expect(audit.overflow, `${route} overflow`).toBeLessThanOrEqual(1);
    expect(audit.duplicateIds, `${route} duplicate ids`).toEqual([]);
    expect(audit.brokenImages, `${route} broken images`).toEqual([]);
  }
});
