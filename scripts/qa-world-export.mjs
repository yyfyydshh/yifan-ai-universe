import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
const root=path.resolve('out'),prefix='/yifan-world';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.mp4':'video/mp4'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!pathname.startsWith(prefix+'/'))throw Error('prefix');let target=path.resolve(root,'.'+pathname.slice(prefix.length));if(!target.startsWith(root+path.sep)&&target!==root)throw Error('path');const stat=await fs.stat(target);if(stat.isDirectory())target=path.join(target,'index.html');res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');res.end(await fs.readFile(target));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(resolve=>server.listen(3012,'127.0.0.1',resolve));
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1536,height:1024}});const errors=[],failures=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push([r.status(),r.url()]);});
try{
  await page.goto(`http://127.0.0.1:3012${prefix}/`,{waitUntil:'networkidle'});await page.locator('[data-renderer="ready"]').waitFor();
  await page.getByRole('button',{name:'区域目录',exact:true}).click();await page.getByRole('dialog').getByRole('link',{name:/工作室/}).click();await page.getByRole('button',{name:'打开工作室电脑，查看全部项目',exact:true}).click();await page.locator('.studio-tool').first().waitFor();
  if(await page.locator('.studio-tool').count()!==7)throw Error('Expected seven project entrances');
  await page.locator('.studio-tool').first().click();await page.locator('.project-tour').waitFor();await page.getByRole('button',{name:/补齐更多来源/}).click();await page.getByText('可以生成正式报告',{exact:true}).waitFor();
  await page.goto(`http://127.0.0.1:3012${prefix}/notes/agent-reliability/`,{waitUntil:'networkidle'});await page.locator('.article-page').waitFor();
  const report={basePath:prefix,pages:['/','/work/','/work/global-opinion/','/notes/agent-reliability/'],errors,failedResponses:failures};await fs.writeFile('qa/world/static-export.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(errors.length||failures.length)process.exitCode=1;
}finally{await browser.close();server.close();}
