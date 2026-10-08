import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const out=process.env.QA_OUT||'qa/world/home-v6';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
await page.goto('http://127.0.0.1:3010/');await page.waitForFunction(()=>window.islandReview?.getReady());
await page.evaluate(()=>islandReview.setProgress(1));
const result=await page.evaluate(async()=>{
 const values=[];let last=performance.now();
 for(let i=0;i<180;i++)await new Promise(resolve=>requestAnimationFrame(now=>{if(i>10)values.push(now-last);last=now;resolve();}));
 values.sort((a,b)=>a-b);const gl=document.querySelector('#terrain').getContext('webgl'),ext=gl.getExtension('WEBGL_debug_renderer_info');
 const assets=performance.getEntriesByType('resource').filter(e=>e.name.includes('/world/')&&e.initiatorType!=='script');
 return {environment:{userAgent:navigator.userAgent,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable'},frames:values.length,meanFps:1000/(values.reduce((a,b)=>a+b,0)/values.length),p95FrameMs:values[Math.floor(values.length*.95)],imageTransferredBytes:assets.reduce((n,r)=>n+r.transferSize,0),imageResources:assets.length};
});
// Capture additional night sizes after the background has had time to decode.
await page.getByRole('button',{name:'暂停漂浮',exact:true}).click();await page.evaluate(()=>islandReview.setProgress(0));
await page.getByRole('button',{name:'切换到夜晚',exact:true}).click();await page.waitForTimeout(1600);
for(const viewport of [{width:1440,height:1000},{width:2200,height:1200},{width:390,height:844}]){
 await page.setViewportSize(viewport);await page.waitForTimeout(150);await page.screenshot({path:out+'/'+viewport.width+'-night.png'});
}
await fs.writeFile(out+'/performance.json',JSON.stringify({date:new Date().toISOString(),scope:'Local headless Chromium dev server; this is not a guarantee for other devices.',...result},null,2));
console.log(JSON.stringify(result));await browser.close();
