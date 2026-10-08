import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('qa/world/boundaries',{recursive:true});
const browser=await chromium.launch({headless:true});
for(const [width,height] of [[320,740],[768,900],[1024,768],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:3011/',{waitUntil:'networkidle'});
 if(width>1023)await page.locator('[data-renderer="ready"]').waitFor();
 await page.screenshot({path:`qa/world/boundaries/home-${width}.png`});
 console.log(JSON.stringify({width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)}));
 await page.close();
}
await browser.close();
