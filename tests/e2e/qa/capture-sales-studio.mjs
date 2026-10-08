import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch();
const out = 'qa/sales-studio';
await mkdir(out, { recursive: true });
const findings = [];
for (const width of [320, 375, 414, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:3010/work/sales-copilot');
  await page.locator('.sales-page img').evaluateAll(async images => {
    await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
  });
  await page.screenshot({ path: `${out}/sales-${width}.png`, fullPage: true });
  await page.getByRole('button',{name:'接起客户来电',exact:true}).click();
  await page.screenshot({ path: `${out}/sales-${width}-connected.png`, fullPage: true });
  await page.locator('.sales-choices button').first().click();
  await page.locator('.sales-choices button').first().click();
  await page.getByRole('button',{name:'整理沟通小结',exact:true}).click();
  await page.locator('.sales-reader img').evaluate(async image => image.decode());
  await page.screenshot({ path: `${out}/sales-${width}-third.png`, fullPage: true });
  await page.getByRole('button', {name:'查看沟通小结',exact:true}).click();
  await page.locator('.sales-note-dialog').waitFor({state:'visible'});
  const noteBounds = await page.locator('.sales-note-dialog').boundingBox();
  await page.screenshot({ path: `${out}/sales-${width}-note.png`, fullPage: true });
  await page.getByRole('button', {name:'收起笔记',exact:true}).click();
  findings.push({ width, errors, noteFits: noteBounds.x >= 0 && noteBounds.x + noteBounds.width <= width, ...await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    buttons: [...document.querySelectorAll('.sales-scene button')].filter(el => el.getBoundingClientRect().width > 0).map(el => el.getBoundingClientRect().height),
    badImages: [...document.querySelectorAll('.sales-page img')].filter(el => !el.naturalWidth).map(el => el.src),
  })) });
  await page.close();
}
const page = await browser.newPage({ viewport: { width: 1920, height: 925 }, reducedMotion: 'reduce' });
await page.goto('http://127.0.0.1:3010/work');
await page.locator('.studio-room-background').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); });
await page.screenshot({ path: `${out}/studio-day.png`, fullPage: true });
await page.evaluate(() => document.documentElement.dataset.theme = 'night');
await page.screenshot({ path: `${out}/studio-night.png`, fullPage: true });
findings.push({ studio: await page.evaluate(() => ({ footer: !!document.querySelector('.world-footer'), continuation: !!document.querySelector('.zone-continue'), height: document.documentElement.scrollHeight, viewport: innerHeight })) });
console.log(JSON.stringify(findings, null, 2));
await browser.close();
