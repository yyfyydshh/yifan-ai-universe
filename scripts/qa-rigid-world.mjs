import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:3010';
const out='qa/world/rigid';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1536,height:1024}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(origin,{waitUntil:'networkidle'});
const world=page.locator('.world-viewport');await world.waitFor();
await world.locator('canvas').waitFor({timeout:90000});
await page.screenshot({path:`${out}/compact.png`});
await page.getByRole('button',{name:'展开群岛',exact:true}).click();
await page.waitForTimeout(1800);await page.screenshot({path:`${out}/expanded.png`});
const rows=[];
for(const title of ['工作室','写作小屋','声音房','游戏桌','放映室','思考山丘','杂物间']){
  const button=world.getByRole('button',{name:new RegExp(`^${title}.*打开预览$`)});
  await button.focus();await page.keyboard.press('Enter');
  await page.waitForTimeout(1400);
  await page.screenshot({path:`${out}/selected-${rows.length}.png`});
  rows.push({title,camera:await world.getAttribute('data-camera'),frame:JSON.parse(await world.getAttribute('data-rigid-frame'))});
  await page.keyboard.press('Escape');await page.waitForTimeout(1300);
}
await page.getByRole('button',{name:'聚拢小岛',exact:true}).click();await page.waitForTimeout(1800);
await page.screenshot({path:`${out}/returned.png`});
await page.getByRole('button',{name:'切换到夜晚'}).click();await page.screenshot({path:`${out}/night.png`});
await page.setViewportSize({width:1024,height:768});await page.waitForTimeout(400);await page.screenshot({path:`${out}/narrow.png`});
await fs.writeFile(`${out}/inspection.json`,JSON.stringify({errors,rows},null,2));
await browser.close();console.log(JSON.stringify({errors,states:rows.length}));
