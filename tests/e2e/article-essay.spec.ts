import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const articles = [
  { slug: "human-future-and-dried-fruit", section: "thoughts" },
  { slug: "ai-capability-reuse", section: "thoughts" },
  { slug: "agent-reliability", section: "thoughts" },
];

for (const article of articles) {
  test(`${article.slug} retains the source prose and its reading destination`, async ({ page }) => {
    await page.goto(`/${article.section}/${article.slug}`);
    const source = fs.readFileSync(path.join(process.cwd(), "content", "notes", `${article.slug}.md`), "utf8");
    const prose = source.split(/\r?\n\s*\r?\n/).filter(block => block.trim() && !block.trim().startsWith("#") && !block.trim().startsWith("|"));
    expect(prose.length).toBeGreaterThan(5);
    const rendered = (await page.locator(".article-body").innerText()).replace(/↗|\s/g, "");
    for (const block of prose) {
      const text = block.replace(/^[>-]\s+/gm, "").replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      expect(rendered).toContain(text.replace(/\s/g, ""));
    }
    for (const line of source.split(/\r?\n/).filter(line => line.startsWith("## "))) await expect(page.locator(".article-body").getByRole("heading", { name: line.slice(3), exact: true })).toBeVisible();
    for (const line of source.split(/\r?\n/).filter(line => line.startsWith("|"))) {
      for (const cell of line.split("|").slice(1, -1).map(cell => cell.trim()).filter(cell => !/^:?-+:?$/.test(cell))) expect(rendered).toContain(cell.replace(/\s/g, ""));
    }
    const back = page.locator(".article-page > .back-link");
    await expect(back).toHaveAttribute("href", `/${article.section}`);
    await back.click(); await expect(page).toHaveURL(new RegExp(`/${article.section}/?$`));
    await expect(page.locator(`.zone-note a[href="/${article.section}/${article.slug}"]`)).toBeVisible();
  });
}

test("reading measure, font size and paragraph rhythm remain usable from phone to desktop", async ({ page }) => {
  for (const width of [320, 375, 414, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto("/thoughts/human-future-and-dried-fruit");
    const audit = await page.evaluate(() => {
      const heading = document.querySelector<HTMLElement>(".article-page h1")!;
      const paragraph = document.querySelector<HTMLElement>(".article-body > p:nth-of-type(2)")!;
      const style = getComputedStyle(paragraph);
      return { overflow: document.documentElement.scrollWidth - innerWidth, clipped: heading.scrollWidth > heading.clientWidth + 1,
        measure: paragraph.getBoundingClientRect().width, size: parseFloat(style.fontSize), lineHeight: parseFloat(style.lineHeight), gap: parseFloat(style.marginBottom) };
    });
    expect(audit.overflow).toBeLessThanOrEqual(1); expect(audit.clipped).toBe(false);
    expect(audit.measure).toBeLessThanOrEqual(Math.min(780, width - 24));
    expect(audit.size).toBeGreaterThanOrEqual(17); expect(audit.lineHeight / audit.size).toBeGreaterThanOrEqual(1.75);
    expect(audit.gap).toBeGreaterThanOrEqual(20);
    await expect(page.locator("main canvas, main .world-viewport")).toHaveCount(0);
  }
});

test("reading progress follows the article and both themes keep text contrast", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto("/thoughts/agent-reliability");
  const progress = page.locator(".reading-progress i"); const start = await progress.evaluate(node => node.getBoundingClientRect().width);
  await page.locator(".article-body > p").last().scrollIntoViewIfNeeded();
  await expect.poll(() => progress.evaluate(node => node.getBoundingClientRect().width)).toBeGreaterThan(start + 50);
  for (const theme of ["day", "night"] as const) {
    if (theme === "night") await page.getByRole("button", { name: "切换到夜晚", exact: true }).click();
    const contrast = await page.locator(".article-body > p").first().evaluate(node => {
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      const luminance = (color: string) => {
        context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1);
        const rgba = [...context.getImageData(0, 0, 1, 1).data];
        const rgb = rgba.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
        return { value: rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722, alpha: rgba[3] };
      };
      let ancestor: Element | null = node; let background = luminance("white");
      while (ancestor) { const candidate = luminance(getComputedStyle(ancestor).backgroundColor); if (candidate.alpha === 255) { background = candidate; break; } ancestor = ancestor.parentElement; }
      const foreground = luminance(getComputedStyle(node).color);
      return (Math.max(foreground.value, background.value) + .05) / (Math.min(foreground.value, background.value) + .05);
    });
    expect(contrast, `${theme} article text contrast`).toBeGreaterThanOrEqual(4.5);
  }
});
