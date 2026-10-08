import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch();
  const folder = path.resolve('qa/docs-book'); fs.mkdirSync(folder, { recursive: true });
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
    await page.goto('http://127.0.0.1:3010/work/docs-system?v=book-v3');
    await page.locator('.db-book').scrollIntoViewIfNeeded();
    for (const [label, direction] of [['下一页','forward'],['上一页','backward']]) {
      const box = await page.getByRole('button', { name: label, exact: true }).boundingBox();
      const extent = await page.locator('.db-chapter-wrap').boundingBox();
      await page.mouse.move(box.x+27,box.y+27); await page.mouse.down();
      await page.mouse.move(box.x+27+extent.width*.85*(direction==='forward'?-1:1),box.y-45,{steps:12});
      await page.screenshot({path:path.join(folder,`curl-${direction}-${width}.png`)});
      console.log(JSON.stringify({width,direction,progress:await page.locator('.db-flip-leaf').getAttribute('data-progress'),overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)}));
      await page.mouse.up();
      await page.waitForFunction(() => document.querySelector('#db-chapter')?.getAttribute('aria-busy') === 'false');
    }
    await page.screenshot({path:path.join(folder,`curl-landed-${width}.png`),fullPage:true});
    await page.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exitCode=1; });
