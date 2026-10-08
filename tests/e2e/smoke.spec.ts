import { expect, test } from "@playwright/test";

const projects = ["global-opinion", "sales-copilot", "docs-system", "regulatory-risk", "tender-cleaner", "hot-news-brief", "humanizer"];
const articles = [
  { slug: "human-future-and-dried-fruit", section: "thoughts" },
  { slug: "ai-capability-reuse", section: "thoughts" },
  { slug: "agent-reliability", section: "thoughts" },
];
const zones = [
  { route: "/work", name: "工作室", pending: false }, { route: "/writing", name: "写作小屋", pending: false },
  { route: "/music", name: "声音房", pending: true }, { route: "/games", name: "游戏桌", pending: true },
  { route: "/films", name: "放映室", pending: true }, { route: "/thoughts", name: "思考山丘", pending: false },
  { route: "/stuff", name: "杂物间", pending: true },
];
const publicPages = ["/", "/career", "/notes", "/profile", ...zones.map(zone => zone.route), ...projects.map(slug => `/work/${slug}`), ...articles.flatMap(article => [`/${article.section}/${article.slug}`, `/notes/${article.slug}`])];

test("all public routes and metadata respond; lab compatibility still works", async ({ request, page }) => {
  test.setTimeout(120_000);
  for (const route of [...publicPages, "/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) expect((await request.get(route)).ok(), route).toBeTruthy();
  await page.goto("/lab");
  await expect(page).toHaveURL(/\/work\/?$/);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const article of articles) expect(sitemap).toContain(`/${article.section}/${article.slug}`);
});

test("seven direct zone links disclose all four pending states", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "区域目录", exact: true }).click();
  const directory = page.getByRole("navigation", { name: "区域目录", exact: true });
  await expect(directory.getByRole("link")).toHaveCount(7);
  for (const zone of zones) {
    const link = directory.getByRole("link", { name: new RegExp(zone.name) });
    await expect(link).toHaveAttribute("href", zone.route);
    if (zone.pending) await expect(link).toContainText("待更新");
    else await expect(link).not.toContainText("待更新");
  }
  await directory.getByRole("link", { name: /工作室/ }).click();
  await expect(page).toHaveURL(/\/work\/?$/);
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator(".studio-room-objects a.studio-room-object")).toHaveCount(7);
  for (const slug of projects) await expect(page.locator(`a.studio-room-object[href="/work/${slug}"]`)).toBeVisible();
});

test("mobile navigation and contact dialog keep focus and real contact details", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work/global-opinion");
  const trigger = page.getByRole("button", { name: "区域目录", exact: true });
  await trigger.focus(); await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "关闭面板" })).toBeFocused();
  await expect(dialog.locator('a[aria-current="page"]')).toContainText("工作室");
  for (let index = 0; index < 14; index++) {
    await page.keyboard.press("Tab");
    // Chromium permits one browser-chrome stop after a native modal's last
    // control. It must then return to the modal, never the underlying page.
    if (await page.evaluate(() => document.activeElement === document.body)) await page.keyboard.press("Tab");
    expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden(); await expect(trigger).toBeFocused();
  await trigger.click(); await dialog.getByRole("button", { name: "联系我", exact: true }).click();
  await expect(dialog.getByRole("img", { name: "杨逸凡的微信二维码" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "1693416144@qq.com" })).toHaveAttribute("href", "mailto:1693416144@qq.com");
  await expect(dialog.getByRole("link", { name: "130 2849 5851" })).toHaveAttribute("href", "tel:+8613028495851");
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
});

test("desktop profile and contact remain centered and expose a downloadable resume", async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto("/");
  const trigger = page.getByRole("navigation", { name: "主导航", exact: true }).getByRole("button", { name: "快速了解我", exact: true });
  await trigger.click(); const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("深圳");
  const resume = dialog.getByRole("link", { name: "下载简历" });
  expect((await request.get((await resume.getAttribute("href"))!)).ok()).toBeTruthy();
  await dialog.getByRole("button", { name: "联系我", exact: true }).click();
  const box = (await dialog.boundingBox())!;
  expect(Math.abs(box.x + box.width / 2 - 720)).toBeLessThanOrEqual(2);
  expect(Math.abs(box.y + box.height / 2 - 450)).toBeLessThanOrEqual(2);
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
});

test("three old article URLs preserve full content and point to the new canonical routes", async ({ page }) => {
  for (const article of articles) {
    const canonical = `/${article.section}/${article.slug}`;
    await page.goto(canonical);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${canonical}/?$`));
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    const text = await page.locator(".article-body").innerText(); expect(text.length).toBeGreaterThan(400);
    const heading = await page.getByRole("heading", { level: 1 }).innerText();
    await page.goto(`/notes/${article.slug}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${canonical}/?$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.locator(".article-body")).toHaveText(text, { useInnerText: true });
  }
  await page.goto("/work/global-opinion");
  await expect(page).toHaveTitle(/全球舆情与品牌口碑分析 Skill｜杨逸凡/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/work\/global-opinion\/?$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /global-opinion-agent-demo-poster\.jpg$/);
});

test("pending zones have clear status and routes back to published content", async ({ page }) => {
  for (const zone of zones.filter(zone => zone.pending)) {
    await page.goto(zone.route);
    await expect(page.getByRole("heading", { level: 1, name: zone.name, exact: true })).toBeVisible();
    await expect(page.locator(".zone-pending-status")).toHaveText("待更新");
    await expect(page.locator(".zone-pending")).toContainText("暂时没有公开内容");
    await expect(page.locator("main audio, main video")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "去写作小屋", exact: true })).toHaveAttribute("href", "/writing");
    await page.getByRole("link", { name: "去工作室", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "我的工作室", exact: true })).toBeVisible();
  }
});

test("all original project videos and posters resolve without caption tracks", async ({ page, request }) => {
  test.setTimeout(120_000);
  for (const slug of projects) {
    await page.goto(`/work/${slug}`);
    const video = page.locator("#project-demo video");
    await expect(video).toHaveCount(0);
    const disclosure = page.locator(".project-disclosure").filter({ has: page.locator("summary", { hasText: slug === "global-opinion" ? "项目视频与完整技术证据" : "观看项目演示" }) });
    await disclosure.locator("summary").click();
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(video).toBeVisible();
    const src = await video.locator("source").getAttribute("src"); const poster = await video.getAttribute("poster");
    expect(src).toBeTruthy(); expect(poster).toBeTruthy();
    expect((await request.get(src!, { headers: { Range: "bytes=0-1023" } })).ok()).toBeTruthy();
    expect((await request.get(poster!)).ok()).toBeTruthy();
    await expect(video.locator('track[kind="captions"]')).toHaveCount(0);
    expect(await video.evaluate(node => (node as HTMLVideoElement).muted)).toBe(true);
    await disclosure.locator("summary").click();
    await expect(video).toHaveCount(0);
  }
});

test("all core pages fit mobile and contain no failed image or duplicate ID", async ({ page }) => {
  test.setTimeout(180_000); await page.setViewportSize({ width: 390, height: 844 });
  for (const route of publicPages) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const audit = await page.evaluate(async () => {
      const ids = [...document.querySelectorAll("[id]")].map(node => node.id);
      const failedImages = (await Promise.all([...document.images].map(async image => {
        image.loading = "eager";
        try { await image.decode(); return null; } catch { return image.currentSrc || image.src; }
      }))).filter(Boolean);
      return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index), failedImages };
    });
    expect(audit.overflow, `${route} overflow`).toBeLessThanOrEqual(1);
    expect(audit.duplicateIds, `${route} duplicate IDs`).toEqual([]);
    expect(audit.failedImages, `${route} failed images`).toEqual([]);
  }
});
