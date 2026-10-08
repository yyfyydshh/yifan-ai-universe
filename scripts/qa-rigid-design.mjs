// An independent, static composition study made before the animated scene.
// It uses the approved/generated image sources, not a screenshot of the app.
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import {islandBodies, floatingSteps, actorLayout, sceneSigns} from '../lib/world-layout.ts';
const root=process.cwd().replaceAll('\\','/');
const islands=islandBodies.map(i=>[i.id,i.x+i.clusterX,i.y+i.clusterY,i.width]);
const titles={work:'工作室',writing:'写作小屋',music:'声音房',games:'游戏桌',films:'放映室',thoughts:'思考山丘',stuff:'杂物间'};
const signs=Object.entries(sceneSigns).map(([id,[x,y]])=>[titles[id],x+islandBodies.find(i=>i.id===id).clusterX,y+islandBodies.find(i=>i.id===id).clusterY]);
const image=(file,x,y,w)=>`<img src="file:///${root}/${file}" style="left:${x}px;top:${y}px;width:${w}px">`;
const html=`<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;width:1600px;height:1120px;background:#ade0f6 url(file:///${root}/public/world/sky-v3.webp) center/cover;position:relative;overflow:hidden}img{position:absolute;height:auto}label{position:absolute;transform:translate(-50%,-50%) rotate(-2deg);padding:10px 22px;background:#fff2d6;border:2px solid #8c7047;border-radius:7px;color:#253c3b;font:bold 25px serif}h1,p{position:absolute;left:34px;color:#253c3b;font-family:serif}h1{top:90px;font-size:48px}p{top:166px;font-size:22px;line-height:1.7}</style></head><body><h1>杨逸凡的世界</h1><p>我做过的，写过的，想过的，<br>以及还没做完的，都在这里。</p>${floatingSteps.map(s=>image("references/drafts/world-v3/rigid-step.png",s.x+islandBodies.find(i=>i.id===s.from).clusterX*(1-s.t)+islandBodies.find(i=>i.id===s.to).clusterX*s.t,s.y+islandBodies.find(i=>i.id===s.from).clusterY*(1-s.t)+islandBodies.find(i=>i.id===s.to).clusterY*s.t,s.width)).join("")}${islands.map(([id,x,y,w])=>image(`references/drafts/world-v3/rigid-${id}.png`,x,y,w)).join('')}${image('references/drafts/world-v1/yifan-cartoon-v2.png',actorLayout.person.x+75,actorLayout.person.y-15,actorLayout.person.width)}${image('references/drafts/world-v2/cat-cartoon.png',actorLayout.cat.x+75,actorLayout.cat.y-15,actorLayout.cat.width)}${signs.map(([title,x,y])=>`<label style="left:${x}px;top:${y}px">${title}</label>`).join('')}</body></html>`;
await fs.writeFile('references/drafts/world-v3/composition.html',html);
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1600,height:1120}});
await page.goto(`file:///${root}/references/drafts/world-v3/composition.html`);
await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
await page.screenshot({path:'references/drafts/world-v3/rigid-world-composition.png'});
await browser.close();
