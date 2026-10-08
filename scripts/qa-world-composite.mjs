import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('qa/world/composite',{recursive:true});
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1536,height:1024},reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:3010/');await page.locator('[data-renderer="ready"]').waitFor();
await page.screenshot({path:'qa/world/composite/center-before.png',clip:{x:580,y:360,width:600,height:450}});
console.log(await page.locator('.world-viewport').getAttribute('data-camera'));
await browser.close();
