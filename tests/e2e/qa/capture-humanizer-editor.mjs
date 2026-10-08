import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
const out = 'qa/humanizer-editor';
await mkdir(out, { recursive: true });
const results = [];
for (const width of [320, 375, 414, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:3010/work/humanizer');
  await page.locator('.humanizer-editor-page img').evaluateAll(async images => {
    await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
  });
  await page.screenshot({ path: `${out}/${width}-original.png`, fullPage: true });
  await page.getByRole('button', { name: '试改受保护的句子', exact: true }).click();
  await page.screenshot({ path: `${out}/${width}-locked.png`, fullPage: true });
  await page.getByRole('button', { name: '删去多余解释', exact: true }).click();
  await page.locator('.he-workbench[data-phase="edited"]').waitFor();
  await page.locator('.he-person img').evaluate(async image => image.decode());
  await page.screenshot({ path: `${out}/${width}-edited.png`, fullPage: true });
  await page.getByRole('button', { name: '看看改了哪里', exact: true }).click();
  await page.screenshot({ path: `${out}/${width}-compare.png`, fullPage: true });
  results.push({ width, errors, ...await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    badImages: [...document.querySelectorAll('.humanizer-editor-page img')].filter(image => !image.naturalWidth).map(image => image.src),
    dialogWidth: document.querySelector('.he-compare-dialog').getBoundingClientRect().width,
  })) });
  await page.close();
}
await writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
