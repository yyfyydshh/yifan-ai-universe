import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch(); const out='qa/regulatory-scale'; await mkdir(out,{recursive:true}); const results=[];
for(const width of [320,375,414,768,1440]) {
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3010/work/regulatory-risk');await page.evaluate(()=>document.fonts.ready);
 const capture=async(name,modal=false)=>{await page.locator('.regulatory-balance-page img').evaluateAll(async imgs=>Promise.all(imgs.map(async img=>{img.loading='eager';await img.decode();})));await page.screenshot({path:`${out}/${width}-${name}.png`,fullPage:!modal});return{name,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,badImages:[...document.querySelectorAll('.regulatory-balance-page img')].filter(i=>!i.naturalWidth).length}))};};
 const states=[];states.push(await capture('empty'));
 await page.getByRole('button',{name:'放上天平：监管通知',exact:true}).click();states.push(await capture('matched'));
 await page.getByRole('button',{name:'切换企业样本：仅线下',exact:true}).click();states.push(await capture('excluded'));
 await page.getByRole('button',{name:'切换企业样本：资料不全',exact:true}).click();states.push(await capture('pending'));
 await page.getByRole('button',{name:'切换企业样本：线上业务',exact:true}).click();
 await page.getByRole('button',{name:'放上天平：处罚案例',exact:true}).click();states.push(await capture('signal'));
 await page.getByRole('button',{name:'看看下一步',exact:true}).click();states.push(await capture('action',true));
 await page.getByRole('button',{name:'清单依据：REG-DEMO-002',exact:true}).click();states.push(await capture('source',true));
 await page.keyboard.press('Escape');
 results.push({width,errors,states});await page.close();
}
await writeFile(`${out}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();
