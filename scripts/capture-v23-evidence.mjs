import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3010";
const mode = process.argv.includes("--references") ? "references" : "captures";
const referenceDir = resolve("references/locked/v23");
const captureRoot = resolve("references/qa/v23");
const projectRoutes = [
  ["global-opinion", "/work/global-opinion", ".project-evidence"],
  ["sales-copilot", "/work/sales-copilot", "#case-study"],
  ["docs-site", "/work/docs-system", "#case-study"],
  ["regulatory-risk", "/work/regulatory-risk", "#case-study"],
  ["tender-cleaner", "/work/tender-cleaner", "#case-study"],
  ["hot-news-brief", "/work/hot-news-brief", "#case-study"],
  ["humanizer", "/work/humanizer", "#case-study"],
];
const coreRoutes = [
  ["home-idle", "/", null],
  ["home-reveal", "/", null],
  ["work-universe", "/work", null],
  ["career-trajectory", "/career", null],
  ["notes-signal", "/notes", null],
  ["article-reliability", "/notes/agent-reliability", null],
  ["profile-capability-system", "/profile", null],
  ["responsive-navigation", "/", null],
];
const viewports = {
  desktop: { width: 1672, height: 941 },
  ultrawide: { width: 2200, height: 1200 },
  mobile: { width: 390, height: 844 },
};

await mkdir(referenceDir, { recursive: true });
await mkdir(captureRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });
const records = [];

async function settle(page, delay = 220) {
  await page.waitForLoadState("domcontentloaded");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(delay);
}

async function openInactiveControl(page, regionSelector) {
  const buttons = await page.locator(`${regionSelector} button:not(:disabled)`).all();
  for (const button of buttons) {
    const inactive = await button.evaluate(element =>
      element.getAttribute("aria-pressed") === "false"
      || element.getAttribute("aria-selected") === "false"
      || (element.hasAttribute("data-stage") && element.getAttribute("aria-pressed") !== "true")
    );
    if (inactive) {
      await button.click();
      return true;
    }
  }
  if (buttons.length > 1) {
    await buttons[1].click();
    return true;
  }
  return false;
}

if (mode === "references") {
  await copyFile(resolve("references/locked/v19/02-home-reveal.png"), resolve(referenceDir, "reference-home-reveal.png"));
  const page = await browser.newPage({ viewport: viewports.desktop, deviceScaleFactor: 1 });
  for (const [slug, route, selector] of projectRoutes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
    await settle(page);
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    const file = resolve(referenceDir, `reference-project-${slug}-workbench.png`);
    await page.screenshot({ path: file, animations: "disabled" });
    records.push({ id: `project-${slug}-workbench`, route, selector, file });
  }
  await page.setViewportSize(viewports.mobile);
  await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.locator(".mobile-nav-trigger").click();
  await page.waitForTimeout(120);
  const navFile = resolve(referenceDir, "reference-responsive-navigation.png");
  await page.screenshot({ path: navFile, animations: "disabled" });
  records.push({ id: "responsive-navigation", route: "/", file: navFile });
  await page.close();
} else {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const outputDir = resolve(captureRoot, viewportName);
    await mkdir(outputDir, { recursive: true });
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });

    for (const [id, route] of coreRoutes) {
      await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
      await settle(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      if (id === "home-reveal" && viewport.width >= 768) {
        await page.mouse.move(viewport.width * 0.76, viewport.height * 0.48);
        await page.waitForTimeout(520);
      }
      if (id === "responsive-navigation" && viewport.width < 1120) {
        await page.locator(".mobile-nav-trigger").click();
        await page.locator('.mobile-nav-panel a[href="/profile"]').focus();
        await page.waitForTimeout(160);
      }
      const file = resolve(outputDir, `${id}.png`);
      await page.screenshot({ path: file, animations: "disabled" });
      records.push({ id, route, viewport: viewportName, file });
    }

    for (const [slug, route, selector] of projectRoutes) {
      await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
      await settle(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      const mastFile = resolve(outputDir, `project-${slug}-mast.png`);
      await page.screenshot({ path: mastFile, animations: "disabled" });
      records.push({ id: `project-${slug}-mast`, route, viewport: viewportName, file: mastFile });

      await page.locator(selector).scrollIntoViewIfNeeded();
      await openInactiveControl(page, selector);
      await page.waitForTimeout(180);
      const workbenchFile = resolve(outputDir, `project-${slug}-workbench.png`);
      await page.screenshot({ path: workbenchFile, animations: "disabled" });
      records.push({ id: `project-${slug}-workbench`, route, viewport: viewportName, file: workbenchFile });
    }
    await page.close();
  }
}

await browser.close();
const manifestPath = mode === "references" ? resolve(referenceDir, "reference-manifest.json") : resolve(captureRoot, "capture-manifest.json");
await writeFile(manifestPath, `${JSON.stringify({ capturedAt: new Date().toISOString(), baseURL, mode, records }, null, 2)}\n`, "utf8");
console.log(`Captured ${records.length} v23 ${mode}.`);
