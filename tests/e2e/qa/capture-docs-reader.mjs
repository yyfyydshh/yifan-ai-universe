import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const browser = await chromium.launch();
try {
  const folder = path.resolve('qa/docs-book');
  fs.mkdirSync(folder, { recursive: true });
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
    await page.goto('http://127.0.0.1:3010/work/docs-system?v=book-v5');
    const reader = page.getByRole('button', { name: '和读书的杨逸凡打个招呼' });
    await reader.scrollIntoViewIfNeeded();
    await reader.locator('img').first().evaluate(image => image.decode());
    const feet = await page.locator('.db-reader-feet').boundingBox();
    await reader.focus(); await page.keyboard.press('Enter');
    const motion = await reader.evaluate(node => {
      const animations = node.getAnimations({ subtree: true });
      animations.forEach(animation => { animation.pause(); animation.currentTime = animation.animationName === 'db-reader-greet' ? 250 : 2800; });
      return animations.map(animation => animation.animationName);
    });
    await reader.screenshot({ path: path.join(folder, `reader-greeting-${width}.png`) });
    if (JSON.stringify(feet) !== JSON.stringify(await page.locator('.db-reader-feet').boundingBox())) throw new Error('Reader feet shifted during greeting');
    await page.getByRole('tab', { name: '动手采集' }).click();
    await page.waitForFunction(() => document.querySelector('#db-chapter').getAttribute('aria-busy') === 'false');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const remaining = await reader.evaluate(node => node.getAnimations({ subtree: true }).length);
    if (remaining) throw new Error('Reader motion ignores reduced motion');
    console.log(JSON.stringify({ width, motion, feetFixed: true, reducedMotionStopped: true, overflow: await page.evaluate(() => document.documentElement.scrollWidth-innerWidth) }));
    await page.close();
  }
} finally { await browser.close(); }
