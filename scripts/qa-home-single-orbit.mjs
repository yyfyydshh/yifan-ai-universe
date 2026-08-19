import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/16934/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const url = process.env.QA_URL ?? "http://127.0.0.1:3010/";
const outputDirectory = process.env.QA_OUTPUT_DIR ?? "D:/AI/CVme/yifan-ai-universe/references/qa/v22";
const outputPath = `${outputDirectory}/single-orbit-geometry.json`;
const viewport = { width: 1672, height: 941 };
const round = (value, digits = 3) => Number(value.toFixed(digits));

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

try {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const orbs = [...document.querySelectorAll(".universe--home .project-orb")];
    return orbs.length === 5 && orbs.every((orb) => orb.hasAttribute("data-depth"));
  });

  const root = page.locator(".universe--home");
  await root.focus();
  const states = [];
  for (let step = 0; step < 30; step += 1) {
    if (step) await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(20);
    states.push(await page.evaluate(() => {
      const avatar = document.querySelector(".universe-avatar")?.getBoundingClientRect();
      const orbs = [...document.querySelectorAll(".universe--home .project-orb")].map((orb) => {
        const box = orb.getBoundingClientRect();
        const content = [".project-orb__icon", "small", "strong", "b"].map((selector) => {
          const node = orb.querySelector(selector);
          const contentBox = node?.getBoundingClientRect();
          return {
            selector,
            text: node?.textContent?.trim() ?? "",
            visible: Boolean(contentBox && contentBox.width > 0 && contentBox.height > 0),
            inside: Boolean(contentBox
              && contentBox.left >= box.left - 1
              && contentBox.right <= box.right + 1
              && contentBox.top >= box.top - 1
              && contentBox.bottom <= box.bottom + 1),
          };
        });
        return {
          title: orb.querySelector("strong")?.textContent?.trim() ?? "",
          label: orb.querySelector("small")?.textContent?.trim() ?? "",
          href: orb.getAttribute("href") ?? "",
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          depth: Number(orb.getAttribute("data-depth")),
          plane: orb.getAttribute("data-plane"),
          zIndex: Number(getComputedStyle(orb).zIndex),
          content,
        };
      });
      return {
        avatar: avatar ? { x: avatar.x, y: avatar.y, width: avatar.width, height: avatar.height } : null,
        homeHintCount: document.querySelectorAll(".universe--home .universe-hint").length,
        pathCount: document.querySelectorAll(".universe--home .universe-orbit-path").length,
        decorativeOrbitDisplay: [...document.querySelectorAll(".home-hero > .space-field .orbit-line")]
          .map((node) => getComputedStyle(node).display),
        orbs,
      };
    }));
  }

  const widths = states.flatMap((state) => state.orbs.map((orb) => orb.width));
  const centerDistances = states.flatMap((state) => state.orbs.flatMap((orb, index) =>
    state.orbs.slice(index + 1).map((other) => Math.hypot(
      orb.x + orb.width / 2 - (other.x + other.width / 2),
      orb.y + orb.height / 2 - (other.y + other.height / 2),
    )),
  ));
  const overlappingPairs = states.map((state) => state.orbs.flatMap((orb, index) =>
    state.orbs.slice(index + 1).filter((other) => {
      const distance = Math.hypot(
        orb.x + orb.width / 2 - (other.x + other.width / 2),
        orb.y + orb.height / 2 - (other.y + other.height / 2),
      );
      return distance < (orb.width + other.width) / 2;
    }),
  ).length);
  const avatar = states[0].avatar;
  const avatarStable = states.every((state) => state.avatar
    && avatar
    && Math.abs(state.avatar.x - avatar.x) < 0.01
    && Math.abs(state.avatar.y - avatar.y) < 0.01
    && Math.abs(state.avatar.width - avatar.width) < 0.01
    && Math.abs(state.avatar.height - avatar.height) < 0.01);
  const contentComplete = states.every((state) => state.orbs.every((orb) =>
    orb.content.every((item) => item.visible && item.inside && (item.selector === ".project-orb__icon" || item.text.length > 0)),
  ));
  const depthLayerOrdering = states.every((state) => state.orbs.every((orb) =>
    orb.plane === "foreground" ? orb.zIndex > 106 : orb.zIndex < 78,
  ));
  const report = {
    viewport,
    sampledAngleSteps: states.length,
    singleOrbitBand: states.every((state) => state.pathCount === 6),
    orbitBandLaneCount: 3,
    decorativeOrbitsHidden: states.every((state) => state.decorativeOrbitDisplay.every((display) => display === "none")),
    homeHintAbsent: states.every((state) => state.homeHintCount === 0),
    avatarStable,
    contentComplete,
    depthLayerOrdering,
    projectCount: states[0].orbs.length,
    uniqueProjectRoutes: new Set(states[0].orbs.map((orb) => orb.href)).size,
    humanizerRoutePresent: states[0].orbs.some((orb) => orb.href === "/work/humanizer"),
    homepageSequence: states[0].orbs.map((orb) => orb.label.split("/")[0].trim()),
    foregroundMaximum: Math.max(...states.map((state) => state.orbs.filter((orb) => orb.plane === "foreground").length)),
    overlappingPlanetPairsMaximum: Math.max(...overlappingPairs),
    minimumPlanetCenterDistancePx: round(Math.min(...centerDistances)),
    minimumPlanetWidthPx: round(Math.min(...widths)),
    maximumPlanetWidthPx: round(Math.max(...widths)),
    perspectiveRatio: round(Math.max(...widths) / Math.min(...widths)),
    depthRange: {
      min: round(Math.min(...states.flatMap((state) => state.orbs.map((orb) => orb.depth)))),
      max: round(Math.max(...states.flatMap((state) => state.orbs.map((orb) => orb.depth)))),
    },
    errors,
  };
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
