import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const output = process.env.QA_OUT || 'qa/world/opening';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto(process.env.WORLD_URL || 'http://127.0.0.1:3010/');
await page.waitForFunction(() => window.islandReview?.getReady());
await page.getByRole('button', { name: '暂停漂浮', exact: true }).click();
for (const [name, progress] of [['assembled', 0], ['handoff', .12], ['spreading', .45], ['spread', 1]]) {
  await page.evaluate(value => window.islandReview.setProgress(value), progress);
  await page.screenshot({ path: `${output}/${name}.png` });
}
await browser.close();
