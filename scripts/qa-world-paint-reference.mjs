import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1600,height:1067},reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:3011/');await page.locator('[data-renderer="ready"]').waitFor();
const data=await page.locator('.world-viewport canvas').evaluate(el=>el.toDataURL('image/png'));
await fs.writeFile('references/drafts/world-v2/world-canvas-source.png',Buffer.from(data.split(',')[1],'base64'));
await browser.close();
