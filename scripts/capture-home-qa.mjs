import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const qaDirectory = resolve(process.env.QA_OUTPUT_DIR ?? "references/qa/v22");
const previewUrl = process.env.QA_URL ?? "http://127.0.0.1:3010/";
const profileDirectory = await mkdtemp(join(tmpdir(), "yifan-home-qa-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  "--remote-debugging-port=9333",
  `--user-data-dir=${profileDirectory}`,
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
], { stdio: "ignore" });

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
let socket;
let commandId = 0;
const pending = new Map();

async function connect() {
  let endpoint;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const pages = await fetch("http://127.0.0.1:9333/json/list").then((response) => response.json());
      endpoint = pages.find((page) => page.type === "page")?.webSocketDebuggerUrl;
      if (endpoint) break;
    } catch {}
    await delay(100);
  }
  if (!endpoint) throw new Error("Chrome DevTools endpoint did not become ready.");
  socket = new WebSocket(endpoint);
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolveCommand, rejectCommand } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) rejectCommand(new Error(message.error.message));
    else resolveCommand(message.result);
  });
}

function send(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolveCommand, rejectCommand) => {
    pending.set(id, { resolveCommand, rejectCommand });
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

async function capture({ name, width, height, mobile = false, reveal = false }) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
  await send("Page.navigate", { url: previewUrl });
  await delay(500);
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const positioned = await evaluate(`(() => {
      const projects = [...document.querySelectorAll('.universe--home .project-orb')];
      return projects.length === 5 && projects.every((node) => node.hasAttribute('data-depth'));
    })()`);
    if (positioned) break;
    await delay(100);
  }
  if (reveal) {
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: width * 0.73, y: height * 0.43 });
    await delay(450);
    // The manual assignment is only a deterministic capture aid for the documented full-reveal state.
    await evaluate(`document.querySelector('.universe-avatar__image--reveal')?.style.setProperty('opacity', '.999')`);
    await delay(150);
  }
  const metrics = await evaluate(`({
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    projects: document.querySelectorAll('.universe--home .project-orb').length,
    revealOpacity: getComputedStyle(document.querySelector('.universe-avatar__image--reveal')).opacity,
    universeBox: (() => { const box = document.querySelector('.universe--home').getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height }; })(),
    avatarBox: (() => { const box = document.querySelector('.universe-avatar').getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height }; })(),
    projectBoxes: [...document.querySelectorAll('.universe--home .project-orb')].map((node) => {
      const box = node.getBoundingClientRect();
      return {
        title: node.querySelector('strong')?.textContent,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        depth: node.getAttribute('data-depth'),
        plane: node.getAttribute('data-plane')
      };
    })
  })`);
  const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile(join(qaDirectory, name), Buffer.from(screenshot.data, "base64"));
  return { name, width, height, ...metrics, overflow: metrics.scrollWidth > metrics.innerWidth };
}

try {
  await mkdir(qaDirectory, { recursive: true });
  await connect();
  await send("Page.enable");
  await send("Runtime.enable");
  const results = [];
  results.push(await capture({ name: "home-desktop-idle.png", width: 1672, height: 941 }));
  results.push(await capture({ name: "home-desktop-reveal.png", width: 1672, height: 941, reveal: true }));
  results.push(await capture({ name: "home-ultrawide-reveal.png", width: 2200, height: 1200, reveal: true }));
  results.push(await capture({ name: "home-mobile.png", width: 390, height: 844, mobile: true }));
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: previewUrl });
  await delay(800);
  const targetHref = await evaluate(`document.querySelector('.universe--home .project-orb')?.getAttribute('href')`);
  await evaluate(`document.querySelector('.universe--home .project-orb')?.click()`);
  await delay(700);
  results.push({ navigationTarget: targetHref, navigationPath: await evaluate(`location.pathname`) });
  console.log(JSON.stringify(results, null, 2));
} finally {
  socket?.close();
  chrome.kill();
  await delay(250);
  await rm(profileDirectory, { recursive: true, force: true }).catch(() => {});
}
