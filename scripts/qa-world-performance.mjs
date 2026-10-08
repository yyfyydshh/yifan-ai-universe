import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import os from 'node:os';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:3011';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1536,height:1024},deviceScaleFactor:1});
const network=[],pending=[];
context.on('requestfinished',request=>{
  if(!/^https?:/.test(request.url()))return;
  const capture=(async()=>{const response=await request.response();const sizes=await request.sizes();network.push({path:new URL(request.url()).pathname,status:response?.status(),contentEncoding:response?.headers()['content-encoding']||'none',...sizes});})();
  pending.push(capture);
});
const page=await context.newPage();
const client=await page.context().newCDPSession(page);
await client.send('HeapProfiler.enable');
await page.addInitScript(()=>{window.__worldLCP=0;new PerformanceObserver(l=>{for(const e of l.getEntries())window.__worldLCP=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(origin,{waitUntil:'networkidle'});
await page.locator('[data-renderer="ready"]').waitFor({timeout:60000});
await Promise.all(pending);
const initialNetwork=[...network];
if(!initialNetwork.some(r=>r.path.endsWith('/world-scene-open.webp')&&r.status===200&&r.responseBodySize>0))throw Error('Missing Worker texture network measurement');
const load=await page.evaluate(()=>({readyMs:performance.now(),lcpMs:window.__worldLCP,resources:performance.getEntriesByType('resource').map(e=>({path:new URL(e.name).pathname,transferBytes:e.transferSize,encodedBytes:e.encodedBodySize,decodedBytes:e.decodedBodySize})),gpu:(()=>{const c=document.createElement('canvas');const gl=c.getContext('webgl');const ext=gl?.getExtension('WEBGL_debug_renderer_info');const r=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable';gl?.getExtension('WEBGL_lose_context')?.loseContext();return r;})()}));
const sample=page.evaluate(()=>new Promise(resolve=>{const times=[];let start=0,last=0;function tick(t){if(!start)start=t;if(last)times.push(t-last);last=t;if(t-start<10000)requestAnimationFrame(tick);else{const sorted=[...times].sort((a,b)=>a-b);resolve({durationMs:t-start,frames:times.length,meanFps:times.length*1000/(t-start),p50FrameMs:sorted[Math.floor(sorted.length*.5)],p95FrameMs:sorted[Math.floor(sorted.length*.95)]});}}requestAnimationFrame(tick);}));
for(let i=0;i<6;i++){
  await page.mouse.move(i%2?1100:1300,880);await page.mouse.down();await page.mouse.move(i%2?1300:1100,850,{steps:25});await page.mouse.up();
  await page.waitForTimeout(180);
}
const frames=await sample;
const rendererKind=await page.locator('.world-viewport').getAttribute('data-renderer-kind');
await page.getByRole('button',{name:'回到中心',exact:true}).click();
await client.send('HeapProfiler.collectGarbage');const before=(await client.send('Runtime.getHeapUsage')).usedSize;
const cycles=[];
for(let i=0;i<3;i++){
  await page.getByRole('button',{name:'区域目录',exact:true}).click();await page.getByRole('dialog').getByRole('link',{name:/工作室/}).click();
  await page.waitForURL('**/work');
  await page.locator('.studio-room-page').waitFor();
  await page.locator('.world-viewport').waitFor({state:'detached'});
  const count=await page.locator('.world-viewport canvas').count();
  await client.send('HeapProfiler.collectGarbage');const afterRelease=(await client.send('Runtime.getHeapUsage')).usedSize;
  await page.getByRole('link',{name:'杨逸凡的世界首页',exact:true}).click();await page.locator('[data-renderer="ready"]').waitFor({timeout:60000});
  await client.send('HeapProfiler.collectGarbage');const afterReturn=(await client.send('Runtime.getHeapUsage')).usedSize;
  cycles.push({canvasesOnContentPage:count,heapOnContentPage:afterRelease,heapAfterReturn:afterReturn});
}
const result={date:new Date().toISOString(),environment:{os:`${os.type()} ${os.release()}`,cpu:os.cpus()[0].model,ramGiB:os.totalmem()/2**30,browser:browser.version(),headless:true,viewport:{width:1536,height:1024},dpr:1,gpu:load.gpu,rendererKind,network:'localhost, cold browser context; no artificial throttling'},load:{readyMs:load.readyMs,lcpMs:load.lcpMs,encodedResponseBodyBytes:initialNetwork.reduce((s,r)=>s+r.responseBodySize,0),httpResponseBytes:initialNetwork.reduce((s,r)=>s+r.responseBodySize+r.responseHeadersSize,0),worldEncodedBytes:initialNetwork.filter(r=>r.path.startsWith('/world/')).reduce((s,r)=>s+r.responseBodySize,0),resources:initialNetwork},interactionFrames:frames,resourceRelease:{heapBefore:before,cycles},errors,limits:'Network sizes include document and Dedicated Worker requests, measured compressed response bodies and HTTP headers, not physical wire traffic. FPS uses browser requestAnimationFrame intervals during live pointer panning; it is not a direct GPU presentation or allocation measurement. A software/headless result does not certify every user device. Heap measurements are GC-assisted JS estimates, not GPU memory.'};
await fs.writeFile('qa/world/performance.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,load:{...result.load,resources:undefined}},null,2));await browser.close();
