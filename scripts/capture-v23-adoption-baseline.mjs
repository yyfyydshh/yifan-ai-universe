import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3010";
const outputDir = resolve("references/locked/v23");
const viewport = { width: 1672, height: 941 };

const routes = [
  ["home-hero", "/"],
  ["work-universe", "/work"],
  ["career-trajectory", "/career"],
  ["notes-signal", "/notes"],
  ["article-reliability", "/notes/agent-reliability"],
  ["profile-capability-system", "/profile"],
  ["project-global-opinion", "/work/global-opinion"],
  ["project-sales-copilot", "/work/sales-copilot"],
  ["project-docs-site", "/work/docs-system"],
  ["project-regulatory-risk", "/work/regulatory-risk"],
  ["project-tender-cleaner", "/work/tender-cleaner"],
  ["project-hot-news-brief", "/work/hot-news-brief"],
  ["project-humanizer", "/work/humanizer"],
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewportSize: viewport, deviceScaleFactor: 1 });
const records = [];

for (const [id, route] of routes) {
  await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(180);
  const filename = `baseline-${id}.png`;
  await page.screenshot({ path: resolve(outputDir, filename), animations: "disabled" });
  records.push({ id, route, file: filename, viewport });
}

await browser.close();
await writeFile(
  resolve(outputDir, "adoption-baseline.json"),
  `${JSON.stringify({ capturedAt: new Date().toISOString(), baseURL, records }, null, 2)}\n`,
  "utf8",
);

console.log(`Captured ${records.length} v23 adoption references in ${outputDir}`);
