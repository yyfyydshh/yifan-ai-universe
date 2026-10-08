import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:3011';
const viewports={desktop:{width:1536,height:1024},ultrawide:{width:2200,height:1200},mobile:{width:390,height:844}};
const homeRef='world-scene-open-design.png', paperRef='project-interactive-design.png', articleRef='article-paper-design.png';
const projectSlugs=['global-opinion','sales-copilot','docs-system','regulatory-risk','tender-cleaner','hot-news-brief','humanizer'];
const sections=[
  {id:'home',route:'/',reference:homeRef},
  {id:'home-night',route:'/',reference:homeRef,action:'night'},
  {id:'home-greeting',route:'/',reference:homeRef,action:'greeting'},
  {id:'home-cat',route:'/',reference:homeRef,action:'cat'},
  {id:'voyage-work',route:'/',reference:homeRef,action:'voyage'},
  {id:'voyage-writing',route:'/',reference:homeRef,action:'voyage-next'},
  {id:'directory',route:'/',reference:homeRef,action:'directory'},
  {id:'zone-preview',route:'/',reference:homeRef,action:'preview'},
  {id:'quick-profile',route:'/',reference:homeRef,action:'profile'},
  {id:'contact',route:'/',reference:articleRef,action:'contact'},
  {id:'notebook',route:'/',reference:articleRef,action:'notebook'},
  {id:'dice',route:'/',reference:homeRef,action:'dice'},
  {id:'postcard',route:'/',reference:homeRef,action:'postcard'},
  {id:'studio-hover',route:'/work',reference:'studio-room-integrated-design.png',action:'studio-hover'},
  {id:'studio-computer',route:'/work',reference:paperRef,action:'studio-computer'},
  ...['work','writing','thoughts'].map(id=>({id:`${id}-index`,route:`/${id}`,reference:id==='work'?'studio-room-integrated-design.png':paperRef})),
  ...['music','games','films','stuff'].map(id=>({id:`waiting-${id}`,route:`/${id}`,reference:paperRef})),
  {id:'career',route:'/career',reference:articleRef},
  {id:'profile',route:'/profile',reference:paperRef},
  ...['human-future-and-dried-fruit','ai-capability-reuse','agent-reliability'].map((id,i)=>({id:`article-${id}`,route:`/${i?'thoughts':'writing'}/${id}`,reference:articleRef})),
  {id:'project-mast',route:'/work/sales-copilot',reference:paperRef},
  ...projectSlugs.map(id=>({id:`tour-${id}`,route:`/work/${id}`,reference:paperRef,selector:'.project-tour'})),
  ...projectSlugs.map(id=>({id:`case-${id}`,route:`/work/${id}`,reference:paperRef,selector:id==='global-opinion'?'.project-evidence':'#case-study'})),
  ...['sales-copilot','tender-cleaner'].map(id=>({id:`sample-${id}`,route:`/work/${id}`,reference:paperRef,selector:id==='sales-copilot'?'.sales-simulator':'.sample-workbench',action:'sample'})),
];
const browser=await chromium.launch({headless:true});const metrics=[];
const only=process.env.QA_SECTIONS?.split(',');
const onlyViewports=process.env.QA_VIEWPORTS?.split(',');
for(const [viewportName,viewport] of Object.entries(viewports)){
  if(onlyViewports&&!onlyViewports.includes(viewportName))continue;
  await fs.mkdir(`qa/world/final/${viewportName}`,{recursive:true});
  for(const section of sections){
    if(only&&!only.includes(section.id))continue;
    // Preview is opened on desktop then resized to check the dialog's narrow layout.
    // The actual touch journey links directly to regions and is covered separately.
    const page=await browser.newPage({viewport,reducedMotion:'reduce',hasTouch:viewportName==='mobile'&&section.action!=='preview'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    if(section.action==='preview'&&viewportName==='mobile')await page.setViewportSize(viewports.desktop);
    await page.goto(origin+section.route,{waitUntil:'networkidle'});
    await page.evaluate(async()=>{await document.fonts.ready;for(const img of document.images){img.loading='eager';}await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
    if(section.route==='/'&&page.viewportSize().width>1023)await page.locator('[data-renderer="ready"]').waitFor({timeout:90000});
    if(section.action==='night')await page.getByRole('button',{name:'切换到夜晚'}).click();
    if(section.action==='greeting')await page.getByRole('button',{name:'和杨逸凡打个招呼'}).click();
    if(section.action==='cat')await page.getByRole('button',{name:'摸摸小牛'}).click();
    if(section.action?.startsWith('voyage')){await page.getByRole('button',{name:'带我逛一圈'}).click();if(section.action==='voyage-next')await page.getByRole('button',{name:'下一站',exact:true}).click();if(viewportName==='mobile')await page.locator('.world-voyage').scrollIntoViewIfNeeded();}
    if(section.action==='directory')await page.getByRole('button',{name:'区域目录',exact:true}).click();
    if(section.action==='preview'){
      await page.getByRole('button',{name:'工作室，打开预览',exact:true}).click();
      if(viewportName==='mobile')await page.setViewportSize(viewport);
    }
    if(['profile','contact'].includes(section.action)){
      await page.getByRole('button',{name:'快速了解我',exact:true}).filter({visible:true}).first().click();
      if(section.action==='contact')await page.getByRole('dialog').getByRole('button',{name:'联系我',exact:true}).click();
    }
    if(section.action==='notebook'){await page.getByRole('button',{name:'翻开随手笔记'}).click();await page.getByRole('button',{name:/下一页/}).click();}
    if(section.action==='dice'){await page.getByRole('button',{name:'游戏桌，掷一次骰子'}).click();await page.getByRole('button',{name:'掷骰子',exact:true}).click();}
    if(section.action==='postcard'){
      await page.getByRole('button',{name:'相机，拍一张插画明信片'}).click();
      await page.locator('.postcard-viewfinder').screenshot({path:`qa/world/final/${viewportName}/postcard-viewfinder.png`});
      await page.getByRole('button',{name:'按下快门'}).click();await page.getByRole('link',{name:'保存明信片'}).waitFor();
      const png=await page.getByRole('link',{name:'保存明信片'}).getAttribute('href');
      if(!png?.startsWith('data:image/png;base64,'))throw Error('Postcard export is not PNG');
      await fs.writeFile(`qa/world/final/${viewportName}/postcard-export.png`,Buffer.from(png.split(',')[1],'base64'));
    }
    if(section.action==='studio-hover'){const object=page.locator('.studio-room-object[href="/work/sales-copilot"]');if(viewportName==='mobile'){await object.tap();await page.locator('.studio-room-selection').scrollIntoViewIfNeeded();}else await object.hover();}
    if(section.action==='studio-computer')await page.getByRole('button',{name:'打开工作室电脑，查看全部项目',exact:true}).click();
    if(section.action==='sample'){if(section.id==='sample-sales-copilot')await page.locator('.sim-replies button').last().click();else await page.locator('.sample-run').click();}
    if(section.id.startsWith('case-'))await page.locator('.project-disclosure summary').filter({hasText:'展开完整方法与证据'}).click();
    if(section.selector)await page.locator(section.selector).evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-82));
    await page.waitForTimeout(150);
    const path=`qa/world/final/${viewportName}/${section.id}.png`;
    await page.screenshot({path});
    if(viewportName==='mobile'&&section.action==='studio-computer'){await page.locator('.studio-os-scroll').evaluate(el=>{el.scrollTop=el.scrollHeight;});await page.screenshot({path:'qa/world/final/mobile/studio-computer-bottom.png'});}
    if(viewportName==='mobile'&&section.id==='work-index'){await page.locator('.studio-room-scroll').evaluate(el=>{el.scrollLeft=el.scrollWidth;});await page.screenshot({path:'qa/world/final/mobile/studio-right.png'});await page.locator('.studio-room-scroll').evaluate(el=>{el.scrollLeft=0;});}
    if(viewportName==='mobile'&&section.id==='article-agent-reliability'){const table=page.locator('.article-table-wrap');await table.scrollIntoViewIfNeeded();await table.evaluate(el=>{el.scrollLeft=el.scrollWidth;});await page.screenshot({path:'qa/world/final/mobile/article-table-right.png'});}
    if(viewportName==='mobile'&&section.id==='sample-tender-cleaner'){const table=page.locator('.sample-table-scroll');await table.scrollIntoViewIfNeeded();await table.evaluate(el=>{el.scrollTop=el.scrollHeight;});await page.screenshot({path:'qa/world/final/mobile/tender-fields-bottom.png'});await table.evaluate(el=>{el.scrollTop=0;});}
    if(viewportName==='mobile'&&['home','home-night'].includes(section.id))await page.screenshot({path:`qa/world/final/${viewportName}/${section.id==='home'?'journey-full':'journey-night-full'}.png`,fullPage:true});
    const fullSection=section.id.startsWith('article-')||section.id.startsWith('sample-')||section.id.startsWith('tour-')||['career','profile','work-index',...projectSlugs.map(s=>`case-${s}`)].includes(section.id);
    if(fullSection){await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo(0,0);});await page.waitForTimeout(100);await page.screenshot({path:`qa/world/final/${viewportName}/${section.id}-full.png`,fullPage:true});}
    metrics.push({section:section.id,viewport:viewportName,errors,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)}))});
    await page.close();
  }
  console.log(`Captured ${viewportName}: ${sections.filter(s=>!only||only.includes(s.id)).length} sections`);
}
await browser.close();
if(only||onlyViewports){await fs.writeFile('qa/world/final/metrics-patch.json',JSON.stringify(metrics,null,2));console.log(JSON.stringify({captures:metrics.length,issues:metrics.filter(m=>m.errors.length||m.overflow>1||m.brokenImages.length)}));process.exit(0);}
await fs.writeFile('qa/world/final/metrics.json',JSON.stringify(metrics,null,2));
const gates=['visual_meaning','hierarchy','personal_evidence','composition','typography','asset_crop','overlap','responsive','reference_fidelity'];
const manifest={schema_version:1,reference_lock_version:'world-v2',source_strategy_locked:true,review_scope:'all_sections',viewports,fidelity_ledger:'docs/fidelity-ledger.md',fresh_review:'docs/fresh-review.md',fresh_review_mode:'independent',final_status:'not verified',sections:[]};
for(const s of sections){
  const ref=`references/locked/world-v2/${s.reference}`;
  const topology={kind:'section-specific',shared_with:[],reason:'独立页面或状态；按复刻契约检查自己的构图与交互。'};
  const groups=[['writing-index','thoughts-index'],['waiting-music','waiting-games','waiting-films','waiting-stuff'],['article-human-future-and-dried-fruit','article-ai-capability-reuse','article-agent-reliability']];
  const group=groups.find(g=>g.includes(s.id));
  if(group)Object.assign(topology,{kind:'shared',shared_with:group.filter(id=>id!==s.id),reason:'同类型内容遵循同一已规划阅读/目录结构，保留不同插画与真实内容。',shared_geometry:'纸面阅读区域、同类标题层级与开放内容行。',responsive_behavior:'桌面限定宽度；手机单列原生滚动。'});
  manifest.sections.push({id:s.id,route:s.route,reference:{path:ref,sha256:crypto.createHash('sha256').update(await fs.readFile(ref)).digest('hex')},render_contract:'docs/world-restoration-plan-v2.md',topology,captures:Object.fromEntries(Object.keys(viewports).map(v=>[v,`qa/world/final/${v}/${s.id}.png`])),gates:Object.fromEntries(gates.map(g=>[g,'not verified'])),status:'not verified'});
}
await fs.writeFile('docs/identity-evidence.json',JSON.stringify(manifest,null,2));
console.log(JSON.stringify({captures:metrics.length,issues:metrics.filter(m=>m.errors.length||m.overflow>1||m.brokenImages.length)}));

