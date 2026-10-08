import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:3010';
const output=process.env.QA_OUTPUT||'qa/world/mobile-contact-dev';
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch();const results=[];
for(const width of [320,390,440,768]){
 const page=await browser.newPage({viewport:{width,height:900},hasTouch:true,reducedMotion:'reduce'});
 await page.goto(origin,{waitUntil:'networkidle'});
 const portrait=page.locator('.journey-portrait');
 await page.screenshot({path:`${output}/${width}-home.png`});
 await portrait.screenshot({path:`${output}/${width}-idle.png`});
 await page.getByRole('button',{name:'和杨逸凡打个招呼',exact:true}).tap();
 await portrait.screenshot({path:`${output}/${width}-wave.png`});
 await page.waitForTimeout(2150);
 await page.getByRole('button',{name:'摸摸小牛',exact:true}).tap();
 await portrait.screenshot({path:`${output}/${width}-stretch.png`});
 await page.waitForTimeout(2450);
 await portrait.screenshot({path:`${output}/${width}-awake.png`});
 results.push({width,...await portrait.evaluate(el=>{const b=el.getBoundingClientRect();return {artboard:{width:b.width,height:b.height},children:[...el.querySelectorAll('.journey-ground,.journey-person,.journey-cat')].map(n=>{const r=n.getBoundingClientRect();return {class:n.className,x:(r.x-b.x)/b.width,y:(r.y-b.y)/b.height,width:r.width/b.width,height:r.height/b.height};}),overflow:document.documentElement.scrollWidth-innerWidth};})});
 await page.close();
}
await fs.writeFile(`${output}/metrics.json`,JSON.stringify(results,null,2));
await browser.close();console.log(JSON.stringify(results));
