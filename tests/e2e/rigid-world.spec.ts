import {expect,test,type Page} from '@playwright/test';

const titles={work:'工作室',writing:'写作小屋',music:'声音房',games:'游戏桌',films:'放映室',thoughts:'思考山丘',stuff:'杂物间'};
async function open(page:Page){await page.goto('/');await expect(page.locator('#loading')).toBeHidden({timeout:30000});}
async function expand(page:Page){await page.keyboard.press('End');await expect(page.locator('#scene')).toHaveAttribute('data-progress','1.0000');}

test('original illustration floats, native scrolling spreads islands, and no footer clips the ending',async({page})=>{
 await open(page);
 const whole=page.locator('[data-original]'),initial=await whole.getAttribute('transform');
 await expect.poll(()=>whole.getAttribute('transform')).not.toBe(initial);
 await page.getByRole('button',{name:'暂停漂浮',exact:true}).click();
 const paused=await whole.getAttribute('transform');await page.waitForTimeout(300);expect(await whole.getAttribute('transform')).toBe(paused);
 await expand(page);await expect(page.locator('#scene')).toHaveAttribute('data-mode','islands');
 await expect(page.locator('.world-footer')).toBeHidden();
 await page.mouse.wheel(0,1200);expect((await page.locator('.stage').boundingBox())!.y).toBe(0);
 await expect(page.locator('.zone-label')).toHaveCount(0);await expect(page.locator('#island-hover')).toBeHidden();
 for(const id of Object.keys(titles))await expect(page.locator(`[data-zone=${id}]`)).toHaveAttribute('aria-label','走近'+titles[id as keyof typeof titles]);
 await page.getByRole('button',{name:'继续漂浮',exact:true}).click();
 const islands=page.locator('[data-zone]'),before=await islands.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('transform')));
 await expect.poll(()=>islands.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('transform')))).not.toEqual(before);
 await page.getByRole('button',{name:'回到起点',exact:true}).click();await expect(page.locator('#scene')).toHaveAttribute('data-mode','original');
});

test('first island click centers an introduction, Escape restores focus, and the CTA enters the studio',async({page})=>{
 await open(page);await expand(page);
 const sign=page.locator('[data-zone=work]');await sign.focus();await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/\/$/);await expect(page.locator('#preview-title')).toHaveText('工作室');
 await expect(page.locator('#unfocus')).toBeFocused();await expect(page.locator('#scene')).toHaveAttribute('data-focus','work');
 await page.getByRole('button',{name:'快速了解我',exact:true}).click();await page.keyboard.press('Escape');
 await expect(page.locator('.world-dialog')).toBeHidden();await expect(page.locator('#island-preview')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('#island-preview')).toBeHidden();await expect(sign).toBeFocused();
 await page.keyboard.press('Enter');await page.locator('#enter-island').click();await expect(page).toHaveURL(/\/work\/?$/);
 await expect(page.locator('.studio-room-objects a.studio-room-object')).toHaveCount(7);
 await page.goBack();await expect(page.locator('#scene')).toHaveCount(1);await expect(page.locator('#loading')).toBeHidden();
});

test('seven zones use seven distinct companion actions and disclose pending content',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await open(page);await expand(page);
 for(const[id,title]of Object.entries(titles)){
  await page.locator(`[data-zone=${id}]`).focus();await page.keyboard.press('Enter');
  await expect(page.locator('#preview-title')).toHaveText(title);
  await expect(page.locator('[data-companions]')).toHaveAttribute('data-companions',id);
  await expect(page.locator('[data-reaction]')).toHaveAttribute('href',new RegExp(`reaction-${id}\\.webp$`));
  const depth=await page.evaluate(id=>{
   type Frame={id:string;rect:number[];opacity:number};
   const api=(window as unknown as {islandReview:{getFrame:()=>Frame[];getBounds:()=>Frame[]}}).islandReview;
   const frame=api.getFrame().filter(b=>b.opacity>.99),island=frame.find(b=>b.id===id)!,original=api.getBounds().find(b=>b.id===id)!;
   return{foreground:frame.at(-1)!.id,zoom:island.rect[2]/original.rect[2]};
  },id);
  expect(depth.foreground).toBe('central');expect(depth.zoom).toBeGreaterThan(1.1);
  await expect(page.locator('#enter-island')).toHaveAttribute('href','/'+id);
  if(['music','games','films','stuff'].includes(id))await expect(page.locator('#preview-status')).toContainText('待更新');
  await page.keyboard.press('Escape');await expect(page.locator('[data-companions]')).toHaveAttribute('data-companions','idle');
 }
});

test('greeting and petting switch poses without mouse hover outlines',async({page})=>{
 await open(page);
 await page.getByRole('button',{name:'暂停漂浮',exact:true}).click();
 await page.getByRole('button',{name:'和逸凡打招呼',exact:true}).click();
 await expect(page.locator('[data-companions] image').first()).toHaveAttribute('href',/yifan-wave\.webp$/);
 await expect(page.locator('#character-speech')).toContainText('逸凡');
 await page.getByRole('button',{name:'摸摸小牛',exact:true}).click();
 await expect(page.locator('[data-companions] image').nth(1)).toHaveAttribute('href',/cat-stretch\.webp$/);
 const stroke=await page.locator('.character-target').first().evaluate(n=>getComputedStyle(n).stroke);expect(stroke).toBe('rgba(0, 0, 0, 0)');
});

test('mobile and reduced motion keep the same simple navigation',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await open(page);
 const still=await page.locator('[data-original]').getAttribute('transform');await page.waitForTimeout(150);expect(await page.locator('[data-original]').getAttribute('transform')).toBe(still);
 await expand(page);await page.locator('[data-zone=writing] .hotspot').click();
 await expect(page.locator('#enter-island')).toBeVisible();await expect(page.locator('#enter-island')).toHaveAttribute('href','/writing');
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'区域目录',exact:true}).click();
 await expect(page.locator('#directory a')).toHaveCount(7);await page.keyboard.press('Escape');await expect(page.locator('#directory-open')).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('island hover text stays still, handles cliff pixels, and has keyboard and touch alternatives',async({page,browser,baseURL})=>{
 await open(page);await expand(page);
 await page.getByRole('button',{name:'暂停漂浮',exact:true}).click();
 const tooltip=page.locator('#island-hover');await expect(tooltip).toBeHidden();
 for(const[id,title]of Object.entries(titles)){
  await page.locator(`[data-zone=${id}] .hotspot`).hover();
  await expect(tooltip).toBeVisible();await expect(page.locator('#hover-title')).toHaveText(title);
 }
 const cliff=await page.evaluate(()=>{
  const api=(window as unknown as {islandReview:{getBounds:()=>{id:string;rect:number[]}[];pieces:{id:string}[];getPositions:()=>number[][]}}).islandReview;
  const r=api.getBounds().find(b=>b.id==='work')!.rect,i=api.pieces.findIndex(b=>b.id==='work'),p=api.getPositions()[i];
  const scene=document.querySelector<SVGSVGElement>('#scene')!,point=scene.createSVGPoint();point.x=r[0]+r[2]*.55+p[0];point.y=r[1]+r[3]*.68+p[1];
  const q=point.matrixTransform(scene.getScreenCTM()!);return{x:q.x,y:q.y};
 });
 await page.mouse.move(cliff.x,cliff.y);await expect(page.locator('#hover-title')).toHaveText('工作室');await expect(tooltip).toBeVisible();
 const before=await tooltip.boundingBox();
 await page.evaluate(()=>{const api=(window as unknown as {islandReview:{setMotionTime:(n:number)=>void}}).islandReview;api.setMotionTime(4800);});
 expect(await tooltip.boundingBox()).toEqual(before);
 await page.mouse.move(1,100);await expect(tooltip).toBeHidden();
 await page.keyboard.press('Tab');await page.locator('[data-zone=thoughts]').focus();await expect(page.locator('#hover-title')).toHaveText('思考山丘');await expect(tooltip).toBeVisible();
 await page.keyboard.press('Escape');await expect(tooltip).toBeHidden();
 await page.keyboard.press('Enter');await expect(page.locator('#preview-title')).toHaveText('思考山丘');await expect(tooltip).toBeHidden();
 const touch=await browser.newPage({baseURL,viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
 await open(touch);await expand(touch);await touch.locator('[data-zone=writing] .hotspot').tap();
 await expect(touch.locator('#preview-title')).toHaveText('写作小屋');await expect(touch.locator('#island-hover')).toBeHidden();await touch.close();
});
