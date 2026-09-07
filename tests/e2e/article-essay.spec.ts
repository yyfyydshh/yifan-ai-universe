import { expect, test } from "@playwright/test";

const route = "/notes/human-future-and-dried-fruit";

test("personal essay has a readable measure and durable paragraph rhythm", async ({ page }) => {
  for (const width of [320, 375, 414, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto(route);
    const audit = await page.evaluate(() => {
      const heading = document.querySelector<HTMLElement>(".article-page--essay h1")!;
      const paragraphs = [...document.querySelectorAll<HTMLElement>(".article-page--essay .article-body > p")];
      const first = paragraphs[0];
      const final = paragraphs.at(-1)!;
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        headingClipped: heading.scrollWidth > heading.clientWidth + 1,
        measure: paragraphs[1].getBoundingClientRect().width,
        firstBorder: getComputedStyle(first).borderLeftWidth,
        finalBorder: getComputedStyle(final).borderTopWidth,
        paragraphGap: Number.parseFloat(getComputedStyle(paragraphs[1]).marginBottom),
      };
    });
    expect(audit.overflow).toBeLessThanOrEqual(1);
    expect(audit.headingClipped).toBe(false);
    expect(audit.measure).toBeLessThanOrEqual(Math.min(640, width - 32));
    expect(audit.firstBorder).toBe("2px");
    expect(audit.finalBorder).toBe("1px");
    expect(audit.paragraphGap).toBeGreaterThanOrEqual(width < 769 ? 20 : 24);
    if ([375, 1440].includes(width)) await page.screenshot({ path: `qa/spatial/essay-reading-${width}.png`, fullPage: true });
  }
});
