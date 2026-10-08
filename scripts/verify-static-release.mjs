import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, expect } from '@playwright/test';
const root=path.resolve('out');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml','.mp4':'video/mp4'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let target=path.resolve(root,'.'+pathname);if(target!==root&&!target.startsWith(root+path.sep))throw Error('path');const stat=await fs.stat(target);if(stat.isDirectory())target=path.join(target,'index.html');res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');res.end(await fs.readFile(target));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch();const page=await browser.newPage({baseURL:origin,reducedMotion:'reduce'});
const errors=[],failures=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push([r.status(),r.url()]);});
const projects=['global-opinion','sales-copilot','docs-system','regulatory-risk','tender-cleaner','hot-news-brief','humanizer'];
const routes=['/','/work/','/career/','/profile/','/notes/','/writing/','/thoughts/','/music/','/games/','/films/','/stuff/','/thoughts/human-future-and-dried-fruit/','/thoughts/agent-reliability/','/thoughts/ai-capability-reuse/',...projects.map(slug=>'/work/'+slug+'/')];
try{
 for(const route of routes){const response=await page.goto(route,{waitUntil:'networkidle'});expect(response.status(),route).toBe(200);await expect(page.getByRole('heading',{level:1})).toBeVisible();expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain('https://yangyifan.me/');const dead=await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(async i=>{i.loading='eager';try{await i.decode();}catch{ /* Decode failures are reported below. */ }}));return images.filter(i=>!i.naturalWidth).map(i=>i.src);});expect(dead,route).toEqual([]);}
 for(const slug of projects){await page.goto('/work/',{waitUntil:'networkidle'});await page.locator('a.studio-room-object[href^="/work/'+slug+'"]').click();await expect(page).toHaveURL(new RegExp('/work/'+slug+'/?$'));await expect(page.getByRole('heading',{level:1})).toBeVisible();}
 await page.goto('/work/regulatory-risk/');await page.getByRole('button',{name:'放上天平：监管通知',exact:true}).click();await page.getByRole('button',{name:'看看下一步',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
 const report={routes:routes.length,clientTransitions:projects.length,errors,failedResponses:failures};await fs.mkdir('qa/release',{recursive:true});await fs.writeFile('qa/release/static-export.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));expect(errors).toEqual([]);expect(failures).toEqual([]);
}finally{await browser.close();server.close();}
