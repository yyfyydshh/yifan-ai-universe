import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/16934/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const outputRoot = "D:/AI/CVme/yifan-ai-universe/references/qa/v16";
await mkdir(outputRoot, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const targets = [
  { name: "home-user-viewport", width: 1839, height: 854 },
  { name: "home-desktop", width: 1440, height: 900 },
  { name: "home-laptop", width: 1280, height: 800 },
  { name: "home-mobile", width: 414, height: 896 },
];
const results = [];

for (const target of targets) {
  const page = await browser.newPage({ viewport: { width: target.width, height: target.height } });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:3010/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outputRoot}/${target.name}.png` });
  results.push({
    target,
    metrics: await page.evaluate(() => {
      const hero = document.querySelector(".home-hero").getBoundingClientRect();
      const copy = document.querySelector(".hero-copy").getBoundingClientRect();
      const universe = document.querySelector(".hero-universe").getBoundingClientRect();
      const orbs = [...document.querySelectorAll(".universe--condensed .project-orb")].map((node) => {
        const rect = node.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      });
      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        heroBottom: Number(hero.bottom.toFixed(1)),
        copyBottom: Number(copy.bottom.toFixed(1)),
        universeBottom: Number(universe.bottom.toFixed(1)),
        railItems: document.querySelectorAll(".hero-capability-rail > div").length,
        fourOrbsInsideViewport: orbs.length === 4 && orbs.every((orb) => orb.left >= 0 && orb.right <= innerWidth && orb.top >= 0 && orb.bottom <= innerHeight),
      };
    }),
    errors,
  });
  await page.close();
}

for (const width of [320, 375, 768, 960, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://127.0.0.1:3010/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  results.push({ width, overflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth) });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
