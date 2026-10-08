import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:3010', output=process.env.QA_OUTPUT||'qa/world/gameplay-dev';
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch();const metrics=[];
for(const [name,width,height] of [['desktop',1536,1024],['ultrawide',2200,1200],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce',hasTouch:width<1024});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 if(width>=1024)await page.locator('[data-renderer="ready"]').waitFor({timeout:90000});
 await page.screenshot({path:`${output}/${name}-home.png`});
 if(width>=1024){
  await page.getByRole('button',{name:'和杨逸凡打个招呼'}).hover();await page.waitForTimeout(100);
  await page.screenshot({path:`${output}/${name}-wave.png`});
  await page.mouse.move(1,1);await page.getByRole('button',{name:'摸摸小牛'}).click();await page.waitForTimeout(100);
  await page.screenshot({path:`${output}/${name}-stretch.png`});
  await page.getByRole('button',{name:'收起对话'}).click();
 }
 await page.getByRole('button',{name:'切换到夜晚'}).click();await page.waitForTimeout(200);await page.screenshot({path:`${output}/${name}-night.png`});
 await page.goto(origin+'/work',{waitUntil:'networkidle'});await page.screenshot({path:`${output}/${name}-room.png`});
 if(width<1024){await page.locator('.studio-room-scroll').evaluate(el=>el.scrollLeft=el.scrollWidth);await page.screenshot({path:`${output}/${name}-room-right.png`});}
 metrics.push({name,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)});await page.close();
}
await fs.writeFile(`${output}/metrics.json`,JSON.stringify(metrics,null,2));console.log(JSON.stringify(metrics));await browser.close();
