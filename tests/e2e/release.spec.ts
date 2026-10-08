import { expect, test } from "@playwright/test";
import { projects as projectData } from "../../lib/site-data";

const projects = ["global-opinion", "sales-copilot", "docs-system", "regulatory-risk", "tender-cleaner", "hot-news-brief", "humanizer"];
const pages = ["/", "/work", "/career", "/notes", "/profile", "/writing", "/thoughts", "/music", "/games", "/films", "/stuff", ...projects.map(slug => `/work/${slug}`), "/thoughts/human-future-and-dried-fruit", "/thoughts/ai-capability-reuse", "/thoughts/agent-reliability", "/notes/human-future-and-dried-fruit", "/notes/ai-capability-reuse", "/notes/agent-reliability"];

for (const width of [320, 375, 414, 768, 960, 1280, 1440, 1920]) {
  test(`release pages fit the ${width}px viewport without clipped titles`, async ({ page }) => {
    test.setTimeout(180_000); await page.setViewportSize({ width, height: width < 768 ? 844 : 941 });
    for (const route of pages) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const audit = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        clippedTitles: [...document.querySelectorAll("h1, h2")].filter(node => {
          const rect = node.getBoundingClientRect();
          if (!rect.width || !rect.height) return false;
          return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1 || node.scrollWidth > node.clientWidth + 1;
        }).map(node => node.textContent?.trim()),
      }));
      expect(audit.overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
      expect(audit.clippedTitles, `${route} titles at ${width}px`).toEqual([]);
    }
  });
}

test("directory identifies nested work and thought pages", async ({ page }) => {
  for (const [route, label] of [["/work/regulatory-risk", "工作室"], ["/thoughts/agent-reliability", "思考山丘"]]) {
    await page.goto(route); await page.getByRole("button", { name: "区域目录", exact: true }).click();
    await expect(page.getByRole("navigation", { name: "区域目录", exact: true }).locator('a[aria-current="page"]')).toContainText(label);
  }
});

test("career navigation reaches both original trajectory entries", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 }); await page.goto("/career");
  await page.locator('#career-2').scrollIntoViewIfNeeded();
  await expect(page.locator('.career-rail a[aria-current="step"]')).toHaveAttribute("href", "#career-2");
  await page.locator('.career-rail a[href="#career-1"]').click();
  await expect(page.locator('.career-rail a[aria-current="step"]')).toHaveAttribute("href", "#career-1");
});

test("existing global evidence controls still change the report gate", async ({ page }) => {
  await page.goto("/work/global-opinion");
  await expect(page.locator(".op-more .project-disclosure-content")).toHaveCount(0);
  await page.locator(".project-disclosure > summary", { hasText: "项目视频与完整技术证据" }).click();
  await expect(page.locator(".op-more .project-disclosure-content")).toBeVisible();
  await page.getByRole("button", { name: "模拟缺口", exact: true }).click();
  await expect(page.locator(".evidence-quality-gate")).toHaveAttribute("data-result", "unmet");
  await expect(page.locator('.quality-branch--unmet')).toContainText(/缺口|补证|继续/);
  await page.getByRole("button", { name: "全部满足", exact: true }).click();
  await expect(page.locator(".evidence-quality-gate")).toHaveAttribute("data-result", "met");
});

test("existing Sales reply rounds update their evidence instead of only button styling", async ({ page }) => {
  await page.goto("/work/sales-copilot");
  await expect(page.locator(".project-mast-facts")).toHaveCount(0);
  await page.locator(".project-disclosure > summary", { hasText: "展开完整方法与证据" }).click();
  await expect(page.locator(".project-mast-facts")).toBeVisible();
  const evidence = page.locator(".sales-conversion-evidence"); const initial = await evidence.innerText();
  const next = page.locator('.sales-turn-list [role="tab"][aria-selected="false"]').first();
  const nextId = await next.getAttribute("id");
  await next.click(); await expect(page.locator(`[id="${nextId}"]`)).toHaveAttribute("aria-selected", "true");
  await expect(evidence).not.toHaveText(initial, { useInnerText: true });
});

test("documentation routes update the workflow explanation", async ({ page }) => {
  await page.goto("/work/docs-system");
  await expect(page.locator(".project-mast-facts")).toHaveCount(0);
  await page.locator(".project-disclosure > summary", { hasText: "展开完整方法与证据" }).click();
  await expect(page.locator(".project-mast-facts")).toBeVisible();
  const heading = page.locator('.docs-console > header h3'); const initial = await heading.innerText();
  await page.getByRole("tablist", { name: "文档站任务路径" }).locator('[aria-selected="false"]').first().click();
  await expect(heading).not.toHaveText(initial);
  await expect(page.locator(".case-deliverable-strip")).toBeVisible();
});

test("regulatory safeguards can block the formal reporting route", async ({ page }) => {
  await page.goto("/work/regulatory-risk");
  await expect(page.locator(".project-mast-facts")).toHaveCount(0);
  await page.locator(".project-disclosure > summary", { hasText: "展开完整方法与证据" }).click();
  await expect(page.locator(".project-mast-facts")).toBeVisible();
  const enabledGuard = page.locator('.regulatory-guards button[aria-pressed="true"]').first();
  await enabledGuard.click();
  await expect(page.locator('.regulatory-guards h3')).toHaveText("报告路径已阻断");
  await expect(page.locator('.regulatory-route')).toContainText("暂停正式报告");
});

test("Tender field explanations retain source and missing-value boundaries", async ({ page }) => {
  await page.goto("/work/tender-cleaner");
  await expect(page.locator(".project-mast-facts")).toHaveCount(0);
  await page.locator(".project-disclosure > summary", { hasText: "展开完整方法与证据" }).click();
  await expect(page.locator(".project-mast-facts")).toBeVisible();
  await page.locator(".tender-schema-grid").getByRole("button", { name: "来源链接", exact: true }).click();
  await expect(page.locator(".tender-field-drawer h3")).toHaveText("来源链接");
  await expect(page.locator(".tender-field-drawer")).toContainText("不根据发布平台或标题推测");
  await page.locator(".tender-schema-grid").getByRole("button", { name: "中标人", exact: true }).click();
  await expect(page.locator(".tender-field-drawer")).toContainText("不推断中标人");
});

test("news source filtering changes visible candidates and their explanation", async ({ page }) => {
  await page.goto("/work/hot-news-brief");
  await expect(page.locator(".project-mast-facts")).toHaveCount(0);
  await page.locator(".project-disclosure > summary", { hasText: "展开完整方法与证据" }).click();
  await expect(page.locator(".project-mast-facts")).toBeVisible();
  await page.getByRole("group", { name: "按来源查看候选" }).getByRole("button", { name: /内容平台/ }).click();
  const candidates = page.locator(".news-candidate-grid button"); expect(await candidates.count()).toBeGreaterThan(0);
  for (const candidate of await candidates.all()) await expect(candidate).toContainText("内容平台");
  await candidates.filter({ hasText: "C-05" }).click();
  await expect(page.locator(".news-candidate-inspector")).toContainText("未同时满足");
});

test("literary protection blocks changes that alter narrative facts", async ({ page }) => {
  await page.goto("/work/humanizer");
  await expect(page.locator(".project-mast-facts")).toHaveCount(0);
  await page.locator(".project-disclosure > summary", { hasText: "展开完整方法与证据" }).click();
  await expect(page.locator(".project-mast-facts")).toBeVisible();
  await page.getByRole("group", { name: "选择编辑提案" }).locator('button[data-status="blocked"]').click();
  await expect(page.locator(".humanizer-verdict")).toContainText("已阻断");
  await expect(page.locator(".humanizer-diff-compare")).toContainText("拟修改稿 · 未采用");
  await page.getByRole("group", { name: "选择编辑提案" }).locator('button[data-status="allowed"]').click();
  await expect(page.locator(".humanizer-verdict")).toContainText("允许进入完整性审计");
});

test("profile resume and all seven project GitHub exits remain available", async ({ page, request }) => {
  await page.goto("/profile");
  const resume = page.locator('main a[href$=".pdf"]').first();
  expect((await request.get((await resume.getAttribute("href"))!)).ok()).toBeTruthy();
  for (const slug of projects) {
    await page.goto(`/work/${slug}`);
    const source = page.locator(slug === "global-opinion" ? '.op-final a[href^="https://github.com/"]' : slug === "tender-cleaner" ? '.tp-final a[href^="https://github.com/"]' : slug === "hot-news-brief" ? '.hn-final a[href^="https://github.com/"]' : '.project-actions a[href^="https://github.com/"]');
    await expect(source).toHaveCount(1); await expect(source).toBeVisible();
    await expect(source).toHaveAttribute("href", projectData.find(project => project.slug === slug)!.github);
    await expect(source).toHaveAttribute("target", "_blank");
  }
});
