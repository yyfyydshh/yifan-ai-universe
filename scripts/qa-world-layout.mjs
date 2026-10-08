import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('qa/world/layout',{recursive:true});
const browser=await chromium.launch({headless:true});
for(const [name,width,height] of [['mobile',390,844],['small',320,740],['ultrawide',2200,1200],['desktop',1536,1024]]) {
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3010/',{waitUntil:'networkidle'});
  if(width>767)await page.locator('[data-renderer="ready"]').waitFor({timeout:90000});
  await page.screenshot({path:`qa/world/layout/${name}.png`});
  if(width<768)await page.screenshot({path:`qa/world/layout/${name}-full.png`,fullPage:true});
  await page.getByRole('button',{name:'切换到夜晚'}).click();
  await page.waitForTimeout(500);
  await page.screenshot({path:`qa/world/layout/${name}-night.png`});
  console.log(JSON.stringify({name,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}));
  await page.close();
}
await browser.close();
