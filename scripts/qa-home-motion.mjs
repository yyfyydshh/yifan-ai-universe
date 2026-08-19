import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/16934/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const label = process.argv.find((argument) => argument.startsWith("--label="))?.split("=")[1] ?? "current";
const outputRoot = process.env.QA_OUTPUT_DIR ?? "D:/AI/CVme/yifan-ai-universe/references/qa/v22";
const outputPath = `${outputRoot}/motion-${label}.json`;
const url = process.env.QA_URL ?? "http://127.0.0.1:3010/";
const viewport = {
  width: Number(process.env.QA_WIDTH ?? 1440),
  height: Number(process.env.QA_HEIGHT ?? 900),
};

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const distance = (first, second) => Math.hypot(second.x - first.x, second.y - first.y);
const percentile = (values, fraction) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * fraction))];
};
const round = (value, digits = 3) => Number(value.toFixed(digits));

function summarize(samples) {
  const perOrb = samples[0]?.orbs.map((_, index) => {
    const points = samples.map((sample) => sample.orbs[index]);
    const steps = points.slice(1).map((point, pointIndex) => distance(points[pointIndex], point));
    const usefulSteps = steps.filter((step) => step > 0.05);
    const medianStep = percentile(usefulSteps, 0.5);
    const headingChanges = [];
    const speedChanges = [];

    for (let pointIndex = 2; pointIndex < points.length; pointIndex += 1) {
      const firstVelocity = {
        x: points[pointIndex - 1].x - points[pointIndex - 2].x,
        y: points[pointIndex - 1].y - points[pointIndex - 2].y,
      };
      const secondVelocity = {
        x: points[pointIndex].x - points[pointIndex - 1].x,
        y: points[pointIndex].y - points[pointIndex - 1].y,
      };
      const firstSpeed = Math.hypot(firstVelocity.x, firstVelocity.y);
      const secondSpeed = Math.hypot(secondVelocity.x, secondVelocity.y);
      speedChanges.push(Math.abs(secondSpeed - firstSpeed));
      if (firstSpeed < 0.2 || secondSpeed < 0.2) continue;
      const cosine = Math.max(-1, Math.min(1,
        (firstVelocity.x * secondVelocity.x + firstVelocity.y * secondVelocity.y) / (firstSpeed * secondSpeed),
      ));
      headingChanges.push(Math.acos(cosine) * 180 / Math.PI);
    }

    return {
      index,
      medianStepPx: round(medianStep),
      p95StepPx: round(percentile(steps, 0.95)),
      maxStepPx: round(Math.max(0, ...steps)),
      maxToMedianStep: round(medianStep ? Math.max(...steps) / medianStep : 0),
      p95HeadingChangeDeg: round(percentile(headingChanges, 0.95)),
      maxHeadingChangeDeg: round(Math.max(0, ...headingChanges)),
      p95SpeedChangePx: round(percentile(speedChanges, 0.95)),
      stallRatio: round(medianStep
        ? steps.filter((step) => step < medianStep * 0.18).length / Math.max(1, steps.length)
        : 0),
    };
  }) ?? [];

  const pairDistances = [];
  for (const sample of samples) {
    for (let first = 0; first < sample.orbs.length; first += 1) {
      for (let second = first + 1; second < sample.orbs.length; second += 1) {
        pairDistances.push(distance(sample.orbs[first], sample.orbs[second]));
      }
    }
  }

  return {
    sampleCount: samples.length,
    durationMs: round((samples.at(-1)?.time ?? 0) - (samples[0]?.time ?? 0), 1),
    minimumCenterDistancePx: round(Math.min(...pairDistances)),
    maximumFrameGapMs: round(Math.max(0, ...samples.slice(1).map((sample, index) => sample.time - samples[index].time)), 1),
    perOrb,
  };
}

async function readFrame(page, phase) {
  return page.evaluate((currentPhase) => ({
    time: performance.now(),
    phase: currentPhase,
    interaction: document.querySelector(".universe--home")?.getAttribute("data-interaction"),
    orbs: [...document.querySelectorAll(".universe--home .project-orb")].map((node) => {
      const box = node.getBoundingClientRect();
      return {
        title: node.querySelector("strong")?.textContent?.trim(),
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,
        width: box.width,
        depth: Number(node.getAttribute("data-depth") ?? 0),
        plane: node.getAttribute("data-plane"),
      };
    }),
  }), phase);
}

async function openHome(browser) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".universe--home .project-orb");
  await page.waitForFunction(() => {
    const orbs = [...document.querySelectorAll(".universe--home .project-orb")];
    if (orbs.length !== 5) return false;
    return orbs.every((node) => {
      const box = node.getBoundingClientRect();
      return node.getAttribute("data-depth") !== null
        && box.width > 60
        && Number.isFinite(box.left)
        && Number.isFinite(box.top);
    });
  });
  await page.locator(".universe--home").scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  return { page, errors };
}

async function runFramePacing(browser) {
  const { page, errors } = await openHome(browser);
  await page.mouse.move(20, 20);
  const pacing = await page.evaluate(() => new Promise((resolve) => {
    const intervals = [];
    const longTasks = [];
    let previous = 0;
    let frame = 0;
    const observer = "PerformanceObserver" in window
      ? new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) longTasks.push(entry.duration);
        })
      : null;
    try { observer?.observe({ type: "longtask", buffered: true }); } catch {}
    const tick = (time) => {
      if (previous) intervals.push(time - previous);
      previous = time;
      frame += 1;
      if (frame < 180) {
        requestAnimationFrame(tick);
        return;
      }
      observer?.disconnect();
      resolve({ intervals, longTasks });
    };
    requestAnimationFrame(tick);
  }));
  const intervals = pacing.intervals;
  const result = {
    name: "frame-pacing",
    metrics: {
      sampleCount: intervals.length,
      medianFrameMs: round(percentile(intervals, 0.5), 2),
      p95FrameMs: round(percentile(intervals, 0.95), 2),
      maxFrameMs: round(Math.max(0, ...intervals), 2),
      framesOver25ms: intervals.filter((value) => value > 25).length,
      longTaskCount: pacing.longTasks.length,
      maxLongTaskMs: round(Math.max(0, ...pacing.longTasks), 2),
    },
    errors,
  };
  await page.close();
  return result;
}

async function runCruise(browser) {
  const { page, errors } = await openHome(browser);
  const samples = [];
  await page.mouse.move(20, 20);
  for (let frame = 0; frame < 120; frame += 1) {
    await page.waitForTimeout(16);
    samples.push(await readFrame(page, "cruise"));
  }
  const result = { name: "cruise", metrics: summarize(samples), errors };
  await page.close();
  return result;
}

async function runDrag(browser, scenario) {
  const { page, errors } = await openHome(browser);
  const root = await page.locator(".universe--home").boundingBox();
  if (!root) throw new Error("Home universe was not measurable.");
  const toPagePoint = ([x, y]) => ({ x: root.x + root.width * x, y: root.y + root.height * y });
  const points = scenario.points.map(toPagePoint);
  const samples = [];

  await page.mouse.move(points[0].x, points[0].y);
  await page.mouse.down();
  samples.push(await readFrame(page, "press"));

  for (let segmentIndex = 1; segmentIndex < points.length; segmentIndex += 1) {
    const from = points[segmentIndex - 1];
    const to = points[segmentIndex];
    const steps = scenario.steps[segmentIndex - 1];
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      await page.mouse.move(
        from.x + (to.x - from.x) * progress,
        from.y + (to.y - from.y) * progress,
      );
      await page.waitForTimeout(16);
      samples.push(await readFrame(page, "drag"));
    }
  }

  await page.mouse.up();
  samples.push(await readFrame(page, "release"));
  for (let frame = 0; frame < 72; frame += 1) {
    await page.waitForTimeout(16);
    samples.push(await readFrame(page, "inertia"));
  }

  const dragSamples = samples.filter((sample) => sample.phase === "drag");
  const inertiaSamples = samples.filter((sample) => sample.phase === "release" || sample.phase === "inertia");
  const result = {
    name: scenario.name,
    drag: summarize(dragSamples),
    inertia: summarize(inertiaSamples),
    interactionAfterRelease: samples.at(-1)?.interaction,
    errors,
  };
  await page.close();
  return result;
}

async function captureDragPose(browser, scenario) {
  const { page } = await openHome(browser);
  const root = await page.locator(".universe--home").boundingBox();
  if (!root) throw new Error("Home universe was not measurable for visual capture.");
  const [start, end] = scenario.points.slice(0, 2).map(([x, y]) => ({
    x: root.x + root.width * x,
    y: root.y + root.height * y,
  }));
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(
    start.x + (end.x - start.x) * 0.55,
    start.y + (end.y - start.y) * 0.55,
    { steps: 18 },
  );
  await page.waitForTimeout(80);
  await page.screenshot({ path: `${outputRoot}/motion-${label}-${scenario.name}-pose.png` });
  await page.mouse.up();
  await page.close();
}

await mkdir(outputRoot, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

try {
  const scenarios = [
    { name: "horizontal", points: [[0.22, 0.52], [0.78, 0.52]], steps: [40] },
    { name: "vertical", points: [[0.52, 0.77], [0.52, 0.23]], steps: [40] },
    { name: "diagonal", points: [[0.23, 0.72], [0.77, 0.28]], steps: [44] },
    { name: "reverse-flick", points: [[0.28, 0.52], [0.76, 0.38], [0.42, 0.62]], steps: [30, 14] },
  ];
  const results = [await runFramePacing(browser), await runCruise(browser)];
  for (const scenario of scenarios) {
    results.push(await runDrag(browser, scenario));
    await captureDragPose(browser, scenario);
  }
  const report = { label, viewport, results };
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
  await delay(100);
}
