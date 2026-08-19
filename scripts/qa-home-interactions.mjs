import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/16934/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const url = process.env.QA_URL ?? "http://127.0.0.1:3010/";
const outputRoot = process.env.QA_OUTPUT_DIR ?? "D:/AI/CVme/yifan-ai-universe/references/qa/v22";
const outputPath = `${outputRoot}/interaction-final.json`;

const center = (box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
const distance = (first, second) => Math.hypot(second.x - first.x, second.y - first.y);

async function ready(page) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".universe--home .project-orb");
  await page.waitForFunction(() => (
    [...document.querySelectorAll(".universe--home .project-orb")]
      .every((node) => node.getAttribute("data-depth") !== null)
  ));
  await page.waitForTimeout(180);
}

async function readCenters(page) {
  return page.locator(".universe--home .project-orb").evaluateAll((nodes) => nodes.map((node) => {
    const box = node.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  }));
}

await mkdir(outputRoot, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

try {
  const responsive = [];
  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 900 },
    { width: 960, height: 800 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    const page = await browser.newPage({ viewport });
    await ready(page);
    responsive.push(await page.evaluate((currentViewport) => ({
      viewport: currentViewport,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      projectCount: document.querySelectorAll(".universe--home .project-orb").length,
      projectPosition: getComputedStyle(document.querySelector(".universe--home .project-orb")).position,
      universeLabel: document.querySelector(".universe--home")?.getAttribute("aria-label"),
    }), viewport));
    await page.close();
  }

  const keyboardPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await ready(keyboardPage);
  const root = keyboardPage.locator(".universe--home");
  const beforeKeyboard = await readCenters(keyboardPage);
  await root.focus();
  await keyboardPage.keyboard.press("ArrowRight");
  const afterKeyboard = await readCenters(keyboardPage);
  const keyboardMovement = Math.max(...beforeKeyboard.map((point, index) => distance(point, afterKeyboard[index])));
  await keyboardPage.close();

  const dragPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await ready(dragPage);
  const firstProject = dragPage.locator(".universe--home .project-orb").first();
  const firstProjectBox = await firstProject.boundingBox();
  if (!firstProjectBox) throw new Error("First project was not measurable.");
  const start = center(firstProjectBox);
  await dragPage.mouse.move(start.x, start.y);
  await dragPage.mouse.down();
  await dragPage.mouse.move(start.x + 90, start.y + 24, { steps: 12 });
  await dragPage.mouse.up();
  await dragPage.waitForTimeout(450);
  const dragStayedOnHome = new URL(dragPage.url()).pathname === "/";
  await dragPage.close();

  const navigationPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await ready(navigationPage);
  await navigationPage.locator(".universe--home .project-orb").first().click({ force: true });
  await navigationPage.waitForURL("**/work/global-opinion", { timeout: 5000 });
  const navigationPath = new URL(navigationPage.url()).pathname;
  await navigationPage.close();

  const reducedContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reducedContext.newPage();
  await ready(reducedPage);
  const reducedBefore = await readCenters(reducedPage);
  await reducedPage.waitForTimeout(700);
  const reducedAfter = await readCenters(reducedPage);
  const reducedMovement = Math.max(...reducedBefore.map((point, index) => distance(point, reducedAfter[index])));
  const reducedVisual = await reducedPage.evaluate(() => ({
    ambientOpacity: getComputedStyle(document.querySelector(".universe-avatar__image--ambient")).opacity,
    revealOpacity: getComputedStyle(document.querySelector(".universe-avatar__image--reveal")).opacity,
  }));
  await reducedContext.close();

  const report = {
    responsive,
    keyboard: { movementPx: Number(keyboardMovement.toFixed(3)), passed: keyboardMovement > 5 },
    dragThreshold: { stayedOnHome: dragStayedOnHome },
    navigation: { path: navigationPath, passed: navigationPath === "/work/global-opinion" },
    reducedMotion: {
      movementPx: Number(reducedMovement.toFixed(3)),
      passed: reducedMovement < 0.1,
      ...reducedVisual,
    },
  };
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
