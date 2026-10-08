import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch();
  const destination = path.resolve('qa/docs-book'); fs.mkdirSync(destination, { recursive: true });
  for (const width of [320, 375, 414, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width < 768 ? 844 : 1000 }, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:3010/work/docs-system?v=book-v3');
    await page.locator('.db-book img').waitFor();
    await page.evaluate(async () => { const images = [...document.querySelectorAll('.db-page img')]; images.forEach(image => { image.loading = 'eager'; }); await Promise.all(images.map(image => image.decode().catch(() => {}))); });
    await page.screenshot({ path: path.join(destination, `book-${width}.png`), fullPage: true });
    await page.getByRole('tab', { name: '连接应用' }).click();
    await page.screenshot({ path: path.join(destination, `integration-${width}.png`), fullPage: true });
    const audit = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, tabs: [...document.querySelectorAll('.db-bookmarks button')].map(x=>({width:x.clientWidth,height:x.clientHeight})), exits: [...document.querySelectorAll('.db-exits a')].map(x=>x.href) }));
    console.log(JSON.stringify({width,...audit,errors})); await page.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
