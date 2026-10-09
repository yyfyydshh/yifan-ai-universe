import { chromium } from '@playwright/test';

const url = process.env.WORLD_URL || 'http://127.0.0.1:3010/';
const browser = await chromium.launch();

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  for (let trial = 1; trial <= 2; trial++) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__worldLongTasks = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.__worldLongTasks.push({ start: Math.round(entry.startTime), duration: Math.round(entry.duration) });
      }).observe({ entryTypes: ['longtask'] });
    });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.islandReview?.getReady() || document.querySelector('.island-home')?.dataset.failed === 'true', undefined, { timeout: 45000 });
    const result = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('/world/'))
        .map(entry => ({ name: entry.name.split('/').at(-1), start: Math.round(entry.startTime), duration: Math.round(entry.duration), transfer: entry.transferSize }));
      const longTasks = window.__worldLongTasks || [];
      const terrainPhases = performance.getEntriesByType('measure').filter(entry => entry.name.startsWith('island-terrain-')).map(entry => ({ name: entry.name, duration: Math.round(entry.duration) }));
      return {
        ready: Boolean(window.islandReview?.getReady()),
        readyMs: Math.round(performance.now()),
        longTaskMs: longTasks.reduce((sum, entry) => sum + entry.duration, 0),
        longestTasks: longTasks.sort((a, b) => b.duration - a.duration).slice(0, 4),
        terrainPhases,
        worldTransferBytes: resources.reduce((sum, entry) => sum + entry.transfer, 0),
        resources: resources.sort((a, b) => b.duration - a.duration),
      };
    });
    console.log(JSON.stringify({ viewport: viewport.width, trial, ...result }));
    await context.close();
  }
}

await browser.close();
