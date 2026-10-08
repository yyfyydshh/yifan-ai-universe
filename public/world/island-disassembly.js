/* One runtime for the Next homepage. All world motion is rigid translation. */
window.mountIslandWorld = function(root) {
 const ns='http://www.w3.org/2000/svg', $=s=>root.querySelector(s), base=root.dataset.base||'', asset=n=>base+'/world/'+n;
 const scene=$('#scene'),journey=$('#journey'),canvas=$('#terrain'),abort=new AbortController();
 const listen=(node,event,fn,options={})=>node.addEventListener(event,fn,{...options,signal:abort.signal});
 const clamp=n=>Math.max(0,Math.min(1,n)),mix=(a,b,t)=>a+(b-a)*t,smooth=n=>{const t=clamp(n);return t*t*(3-2*t);};
 const el=(name,attrs={})=>{const n=document.createElementNS(ns,name);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
 const S=1536/1309;
 const bodies=[
  {id:'central',name:'中央草地',rect:[420/S,435/S,850/S,850*1024/1536/S],delta:[0,15],float:[13,11400,.6]},
  {id:'writing',name:'写作小屋',rect:[249/S,4/S,530/S,556/S],delta:[-70,-60],float:[22,8400,1.2],hot:[447,210],sign:[447,275],detail:'文字与生活',description:'记录日常、阅读和那些值得留下来的瞬间。',reaction:'我写下今天，小牛负责看住那支笔。',foot:718},
  {id:'music',name:'声音房',rect:[777/S,56/S,498/S,457/S],delta:[65,-60],float:[19,10600,2.8],hot:[882,226],sign:[888,287],detail:'待更新',description:'音乐、声音和一小段属于自己的节奏。',reaction:'戴上耳机。小牛也跟着节拍轻轻摇晃。',foot:752},
  {id:'work',name:'工作室',rect:[-17.18/S,250/S,714/S,714/S],delta:[-175,-15],float:[24,9300,4],hot:[274,388],sign:[278,447],detail:'AI · 产品 · 技术',description:'用 AI 工作流和产品实验，把想法做成能用的东西。',reaction:'我来敲键盘，小牛是今天的测试员。',foot:732},
  {id:'games',name:'游戏桌',rect:[1024/S,182/S,465/S,499/S],delta:[215,-55],float:[21,12100,5.2],hot:[1104,328],sign:[1122,387],detail:'待更新',description:'游戏体验、桌游与好玩的小实验。',reaction:'手柄归我，骰子归小牛。来玩一局？',foot:752},
  {id:'films',name:'放映室',rect:[764/S,416/S,585/S,537/S],delta:[215,-95],float:[18,7900,1.8],hot:[906,480],sign:[913,550],detail:'待更新',description:'电影、影评，以及故事留下的回声。',reaction:'爆米花准备好了，小牛已经盯住了银幕。',foot:739},
  {id:'thoughts',name:'思考山丘',rect:[-9/S,575/S,832/S,832/S],delta:[-85,130],float:[25,13200,3.7],hot:[280,678],sign:[288,726],detail:'想法与复盘',description:'停下来整理技术观点、方法和成长中的问题。',reaction:'我们慢慢想。小牛先在身边打个盹。',foot:757},
  {id:'stuff',name:'杂物间',rect:[840/S,512/S,796/S,796/S],delta:[195,145],float:[23,11100,.2],hot:[1117,586],sign:[1129,657],detail:'待更新',description:'收藏、设备，还有生活里舍不得丢的小东西。',reaction:'我翻出一件旧物，小牛发现了新纸箱。',foot:739}
 ];
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let reduced=preference.matches;
 let terrain=null,ready=false,disposed=false,breeze=true,frame=0,lastTime=performance.now(),motionTime=0,value=0;
 let mouseX=0,mouseY=0,selected=null,focus=0,lastSelected=null,speechUntil=0,waveUntil=0,catUntil=0,gustUntil=0;
 let lastCamera=[],lastPositions=[],lastScale=1,manualMotion=false;
 const transitions=bodies.map(()=>({x:0,y:0}));
 const originalBox=[-25,-25,1360,1270],expandedBox=[-390,-120,2210,1460];
 // Use the open sides of a landscape screen instead of stacking all eight
 // islands vertically. Portrait screens retain their taller arrangement.
 const landscapeDeltas={central:[0,15],writing:[-100,-75],music:[120,-85],work:[-410,-275],games:[475,-110],films:[355,-15],thoughts:[-250,105],stuff:[460,100]};
 const isLandscape=()=>innerWidth/innerHeight>=1.3;
 const hero=$('.hero-copy'),caption=$('.scene-caption'),sky=$('.sky'),panel=$('#island-preview'),speech=$('#character-speech');
 const hoverCard=$('#island-hover');let hovered=null;
 const progressBar=$('.scroll-progress span'),hint=$('#scroll-hint');
 scene.replaceChildren();
 const whole=el('g',{'data-original':''});whole.append(el('image',{href:asset('island-complete-v4.png'),width:1309,height:1201}));scene.append(whole);
 // Both feet and cat share a contact plane well inside the central grass.
 const companions=el('g',{'data-companions':'idle'});scene.append(companions);
 const shadows=el('g',{fill:'#345837',opacity:'.19'});shadows.append(el('ellipse',{cx:650,cy:547,rx:86,ry:12}),el('ellipse',{cx:806,cy:547,rx:61,ry:9}));companions.append(shadows);
 const person=el('g',{role:'button',tabindex:0,'aria-label':'和逸凡打招呼',class:'character-button'});
 const personImage=el('image',{href:asset('yifan-cartoon-v2.webp'),x:480,y:206,width:350,height:350});
 person.append(personImage,el('ellipse',{cx:663,cy:392,rx:103,ry:159,class:'character-target'}));companions.append(person);
 const cat=el('g',{role:'button',tabindex:0,'aria-label':'摸摸小牛',class:'character-button'});
 const catImage=el('image',{href:asset('cat-cartoon.webp'),x:737,y:422,width:160,height:160});
 cat.append(catImage,el('ellipse',{cx:817,cy:511,rx:76,ry:40,class:'character-target'}));companions.append(cat);
 const reaction=el('image',{x:490,y:180,width:390,height:390,'data-reaction':'idle',visibility:'hidden'});companions.append(reaction);
 const hotspots=el('g',{'data-hotspots':''});scene.append(hotspots);
 const links=bodies.filter(b=>b.hot).map(body=>{
  const node=el('a',{href:base+'/'+body.id,role:'button','aria-label':'走近'+body.name,'aria-expanded':'false',class:'zone-link','data-zone':body.id});
  const[cx,cy]=body.hot;
  node.append(el('ellipse',{cx,cy,rx:88,ry:70,fill:'transparent',class:'hotspot'}));
  hotspots.append(node);
  listen(node,'click',event=>{event.preventDefault();event.stopPropagation();const hit=event.detail===0?body:bodyAtPoint(event.clientX,event.clientY);if(hit)select(hit.id);});
  listen(node,'keydown',event=>{if(event.key===' '){event.preventDefault();select(body.id);}});
  listen(node,'focus',()=>{if(node.matches(':focus-visible')){const r=node.getBoundingClientRect();showHover(body,r.left+r.width/2,r.top+r.height/2);}});
  listen(node,'blur',hideHover);
  return{body,node};
 });
 function hideHover(){hovered=null;hoverCard.hidden=true;links.forEach(({node})=>node.removeAttribute('aria-describedby'));}
 function showHover(body,x,y){
  if(selected||focus>.15||document.querySelector('dialog[open]'))return;
  if(!body){hideHover();return;}if(hovered===body.id)return;
  hovered=body.id;$('#hover-title').textContent=body.name;
  $('#hover-detail').textContent=body.detail==='待更新'?'正在布置 · 内容待更新':body.description;
  hoverCard.hidden=false;
  const r=hoverCard.getBoundingClientRect();
  hoverCard.style.left=Math.max(12,Math.min(innerWidth-r.width-12,x+20))+'px';
  hoverCard.style.top=Math.max(76,y+r.height+20>innerHeight-16?y-r.height-18:y+20)+'px';
  links.forEach(({node,body:b})=>{if(b.id===body.id)node.setAttribute('aria-describedby','island-hover');else node.removeAttribute('aria-describedby');});
 }
 function bodyAtPoint(x,y){
  if(!terrain||selected||focus>.15||!lastCamera.length)return null;
  const r=scene.getBoundingClientRect(),c=lastCamera,p=Number(scene.dataset.progress||0);
  const wx=(x-r.left-(r.width-c[2]*lastScale)/2)/lastScale+c[0],wy=(y-r.top-(r.height-c[3]*lastScale)/2)/lastScale+c[1];
  const shared=reduced?0:Math.sin(motionTime/11800*Math.PI*2)*13;
  const id=terrain.hitTest(wx,wy,smooth(p/.23),lastPositions,shared);
  return bodies.find(b=>b.id===id&&b.hot)||null;
 }
 listen(scene,'pointermove',event=>{if(event.pointerType==='mouse')showHover(bodyAtPoint(event.clientX,event.clientY),event.clientX,event.clientY);});
 listen(scene,'pointerleave',hideHover);
 listen(scene,'click',event=>{if(event.target.closest('.character-button'))return;const body=bodyAtPoint(event.clientX,event.clientY);if(body)select(body.id);});
 const wind=$('.breeze-layer');wind.replaceChildren();
 const leaves=Array.from({length:13},(_,i)=>{const node=el('path',{d:'M0 5Q8 -3 17 2Q11 12 0 5Z',class:'wind-leaf'});wind.append(node);return{node,phase:i*1.717,speed:18500+i*1100};});
 const traces=Array.from({length:3},(_,i)=>{const node=el('path',{d:'M0 8Q45 -10 100 5T180 7',class:'wind-trace'});wind.append(node);return{node,index:i};});
 const particles=[];
 const getProgress=()=>clamp(scrollY/Math.max(1,journey.offsetHeight-innerHeight));
 function say(text){speech.textContent=text;speechUntil=performance.now()+2600;run();}
 function greet(){waveUntil=performance.now()+2200;personImage.setAttribute('href',asset('yifan-wave.webp'));say('嗨，我是逸凡。欢迎来我的世界！');}
 function pet(){catUntil=performance.now()+2600;catImage.setAttribute('href',asset('cat-stretch.webp'));say('喵～ 伸个懒腰，陪你逛逛。');}
 for(const[node,action]of[[person,greet],[cat,pet]]){
  listen(node,'click',action);listen(node,'pointerenter',()=>{if(node===person)waveUntil=performance.now()+1500;else catUntil=performance.now()+1400;run();});
  listen(node,'keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();action();}});
 }
 function select(id){
  const body=bodies.find(b=>b.id===id);if(!body?.hot)return;
  hideHover();
  if(!ready){$('#directory').showModal();return;}
  lastSelected=selected=id;
  // Native scroll settles the full group first; focus has its own eased camera.
  window.scrollTo({top:journey.offsetHeight-innerHeight,behavior:'instant'});
  root.dataset.focused='true';panel.hidden=false;
  $('#preview-title').textContent=body.name;$('#preview-description').textContent=body.description;
  $('#preview-status').textContent=body.detail==='待更新'?'正在布置 · 内容待更新':body.detail;
  $('#reaction-caption').textContent=body.reaction;
  $('#enter-island').href=base+'/'+body.id;$('#enter-island').textContent=body.detail==='待更新'?'看看这个角落 ↗':'进入'+body.name+' ↗';
  root.querySelectorAll('[data-select-zone]').forEach(n=>n.setAttribute('aria-current',String(n.dataset.selectZone===id)));
  links.forEach(l=>l.node.setAttribute('aria-expanded',String(l.body.id===id)));
  reaction.setAttribute('href',asset('reaction-'+id+'.webp'));
  reaction.setAttribute('y',String(548-body.foot*390/790));reaction.dataset.reaction=id;
  $('#unfocus').focus({preventScroll:true});
  run();
 }
 function unselect(restoreFocus=true){const id=selected;selected=null;root.dataset.focused='false';panel.hidden=true;links.forEach(l=>l.node.setAttribute('aria-expanded','false'));if(restoreFocus&&id)links.find(l=>l.body.id===id)?.node.focus({preventScroll:true});run();}
 listen($('#unfocus'),'click',()=>unselect());
 root.querySelectorAll('[data-select-zone]').forEach(node=>listen(node,'click',()=>select(node.dataset.selectZone)));
 listen(document,'keydown',event=>{if(event.key==='Escape'){hideHover();if(!document.querySelector('dialog[open]')&&selected)unselect();}});
 function spreadDelta(body){
  const mobile={central:[-150,225],writing:[-157,-70],music:[-92,-46],work:[-134,112],games:[-170,180],films:[65,380],thoughts:[-45,520],stuff:[-300,750]};
  return innerWidth<=600?mobile[body.id]:isLandscape()?landscapeDeltas[body.id]:body.delta;
 }
 function pose(body,separation){
  const[a,period,phase]=body.float;
  const thresholds={writing:190,music:205,games:300,work:320,films:470,central:510,thoughts:650,stuff:620};
  const s=separation*smooth((smooth(value/.23)*1400-90-thresholds[body.id])/300);
  const shared=reduced?0:Math.sin(motionTime/11800*Math.PI*2)*13;
  const delta=spreadDelta(body);
  return[delta[0]*s+(reduced?0:Math.sin(motionTime/(period*1.37)*Math.PI*2+phase)*7*s),delta[1]*s+mix(shared,reduced?0:Math.sin(motionTime/period*Math.PI*2+phase)*a,s)];
 }
 function updateWind(now){
  const enabled=breeze&&!reduced,boost=now<gustUntil?1.7:1;
  wind.style.visibility=enabled?'visible':'hidden';
  leaves.forEach(({node,phase,speed},i)=>{
   const t=(motionTime/speed+phase)%1,x=t*(innerWidth+240)-120,y=innerHeight*(.16+(i%5)*.17)+Math.sin(t*8+phase)*37;
   node.setAttribute('transform',`translate(${x} ${y}) rotate(${Math.sin(t*9+phase)*40+10}) scale(${.55+(i%3)*.25})`);
   node.setAttribute('opacity',String(.45*boost*Math.min(1,t*8,(1-t)*8)));
  });
  traces.forEach(({node,index})=>{const t=(motionTime/(14000+index*2400)+index*.32)%1;node.setAttribute('transform',`translate(${t*(innerWidth+300)-220} ${innerHeight*(.22+index*.27)+Math.sin(t*9)*30})`);node.style.opacity=String(Math.max(0,Math.sin(t*Math.PI))* .23*boost);});
  for(let i=particles.length-1;i>=0;i--){const p=particles[i],t=(now-p.born)/1050;if(t>=1){p.node.remove();particles.splice(i,1);}else{p.node.setAttribute('transform',`translate(${p.x-t*60} ${p.y+t*25-Math.sin(t*3)*12}) rotate(${t*100}) scale(.4)`);p.node.setAttribute('opacity',String((1-t)*.5));}}
 }
 function render(now=performance.now()){
  if(disposed)return;cancelAnimationFrame(frame);frame=0;
  const elapsed=Math.max(0,Math.min(now-lastTime,50));lastTime=now;
  if(breeze&&!reduced&&!document.hidden&&!manualMotion)motionTime+=elapsed;
  value=getProgress();const p=ready?(reduced?(value<.5?0:1):value):0;
  const separation=smooth(p),morph=smooth(p/.23),split=p>0;
  const ease=reduced?1:1-Math.exp(-elapsed/210),target=selected?1:0;focus=mix(focus,target,ease);if(Math.abs(focus-target)<.001)focus=target;
  const shared=reduced?0:Math.sin(motionTime/11800*Math.PI*2)*13;
  const mobile=innerWidth<=600,wideBox=mobile?[-95,-90,1320,2000]:isLandscape()?expandedBox:[-160,-95,1705,1505];
  const normalCamera=originalBox.map((n,i)=>mix(n,wideBox[i],separation));
  const focusCamera=isLandscape()?[120,80,1280,920]:[5,0,1170,1100],camera=normalCamera.map((n,i)=>mix(n,focusCamera[i],smooth(focus)));
  let moving=false;
  const positions=bodies.map((body,i)=>{
   const normal=pose(body,separation);let extra=[0,0];
   if(lastSelected){
    const bounds=terrain?.getBounds().find(b=>b.id===body.id)?.rect||body.rect;
    const delta=spreadDelta(body);
    if(body.id===lastSelected)extra=[760-(bounds[0]+bounds[2]/2)-delta[0],540-(bounds[1]+bounds[3]/2)-delta[1]];
    else if(body.id==='central')extra=[(lastSelected==='thoughts'?-320:-325)-delta[0],85-delta[1]];
    else{const cx=bounds[0]+bounds[2]/2-660,cy=bounds[1]+bounds[3]/2-570,d=Math.max(1,Math.hypot(cx,cy));extra=[cx/d*650,cy/d*570];}
   }
   transitions[i].x=mix(transitions[i].x,extra[0]*(selected?1:0),ease);transitions[i].y=mix(transitions[i].y,extra[1]*(selected?1:0),ease);
   if(Math.abs(transitions[i].x-extra[0]*(selected?1:0))>.03||Math.abs(transitions[i].y-extra[1]*(selected?1:0))>.03)moving=true;
   if(!selected&&focus===0){transitions[i].x=0;transitions[i].y=0;}
   return[normal[0]+transitions[i].x,normal[1]+transitions[i].y];
  });
  whole.style.display=split&&terrain?'none':'';canvas.style.visibility=split&&terrain?'visible':'hidden';whole.setAttribute('transform','translate(0 '+shared+')');
  scene.setAttribute('viewBox',camera.join(' '));const shift=(mobile?0:10)*(1-separation)*(1-focus);
  for(const node of [scene,canvas]){
   node.style.top=mobile?mix(mix(18,14,separation),7,focus)+'vh':isLandscape()?mix(mix(5,2,separation),5,focus)+'vh':mix(5,7,focus)+'vh';
   node.style.height=mobile?mix(mix(70,80,separation),54,focus)+'vh':isLandscape()?mix(mix(91,96,separation),91,focus)+'vh':mix(91,54,focus)+'vh';
  }
  scene.style.transform=`translateX(${shift}vw)`;canvas.style.transform=scene.style.transform;
  if(split&&terrain)terrain.render(camera,morph,positions,shared,focus>0?lastSelected:null,smooth(focus));
  const box=scene.getBoundingClientRect(),scale=Math.min(box.width/camera[2],box.height/camera[3]);lastScale=scale;lastCamera=camera;lastPositions=positions;
  links.forEach(({body,node})=>{
   const index=bodies.indexOf(body),[x,y]=split?positions[index]:[0,shared];node.setAttribute('transform',`translate(${x} ${y})`);
   const target=node.querySelector('.hotspot');target.setAttribute('rx',Math.max(88,22/scale));target.setAttribute('ry',Math.max(70,22/scale));
   node.style.opacity=String(1-focus);node.style.pointerEvents=focus>.15?'none':'';node.setAttribute('tabindex',focus>.15?'-1':'0');
  });
  const cp=split?positions[0]:[0,shared];companions.setAttribute('transform',`translate(${cp[0]} ${cp[1]})`);
  const showReaction=focus>.35;person.style.display=showReaction?'none':'';cat.style.display=showReaction?'none':'';reaction.setAttribute('visibility',showReaction?'visible':'hidden');companions.dataset.companions=showReaction?lastSelected:'idle';
  personImage.setAttribute('href',asset(now<waveUntil?'yifan-wave.webp':'yifan-cartoon-v2.webp'));catImage.setAttribute('href',asset(now<catUntil?'cat-stretch.webp':'cat-cartoon.webp'));
  hero.style.opacity=String((1-smooth(p/.22))*(1-focus));caption.style.opacity=String(smooth((p-.6)/.3)*(1-focus));progressBar.style.transform=`scaleY(${p})`;
  sky.style.transform=`translate(${reduced?0:mouseX*9}px,${reduced?0:mouseY*6}px)`;
  hint.textContent=p>.94?(matchMedia('(hover: hover)').matches?'移到岛上了解，点击走近看看':'轻点一座岛，走近看看'):p>.12?'继续滚动，让小岛各自漂浮':'向下滚动，让小岛慢慢展开';
  const speechPoint=screenPoint(650+cp[0],230+cp[1]);speech.style.left=Math.min(innerWidth-240,Math.max(12,speechPoint[0]-40))+'px';speech.style.top=Math.max(85,speechPoint[1]-55)+'px';speech.style.opacity=now<speechUntil&&!showReaction?'1':'0';
  updateWind(now);scene.dataset.progress=p.toFixed(4);scene.dataset.mode=split?'islands':'original';scene.dataset.focus=selected||'';
  if(!document.hidden&&((breeze&&!reduced)||focus!==target||moving||speechUntil>now||waveUntil>now||catUntil>now||particles.length))frame=requestAnimationFrame(render);
 }
 function screenPoint(x,y){const r=scene.getBoundingClientRect(),c=lastCamera;return[r.left+(r.width-c[2]*lastScale)/2+(x-c[0])*lastScale,r.top+(r.height-c[3]*lastScale)/2+(y-c[1])*lastScale];}
 function run(){if(!frame&&!disposed){lastTime=performance.now();frame=requestAnimationFrame(render);}}
 function onScroll(){hideHover();if(selected&&getProgress()<.94)unselect(false);if(!frame)render();}
 listen(window,'scroll',onScroll,{passive:true});listen(window,'resize',()=>{hideHover();render();},{passive:true});
 listen(preference,'change',event=>{reduced=event.matches;render();});listen(document,'visibilitychange',()=>{if(!document.hidden)run();else{cancelAnimationFrame(frame);frame=0;}});
 let pointerLast=0,pointerX=0,pointerY=0;
 listen(root,'pointermove',event=>{if(event.pointerType!=='mouse'||reduced)return;mouseX=event.clientX/innerWidth-.5;mouseY=event.clientY/innerHeight-.5;const now=performance.now(),distance=Math.hypot(event.clientX-pointerX,event.clientY-pointerY);if(breeze&&now-pointerLast>85&&distance>18&&!event.target.closest('button,a,dialog,.island-preview')){const node=el('path',{d:'M0 5Q8 -3 17 2Q11 12 0 5Z',class:'wind-leaf'});wind.append(node);particles.push({node,x:event.clientX,y:event.clientY,born:now});pointerLast=now;gustUntil=now+900;}pointerX=event.clientX;pointerY=event.clientY;run();},{passive:true});
 listen($('#home'),'click',()=>{unselect(false);window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});});
 listen($('#breeze'),'click',()=>{hideHover();breeze=!breeze;const b=$('#breeze');b.setAttribute('aria-label',breeze?'暂停漂浮':'继续漂浮');b.title=breeze?'暂停漂浮':'继续漂浮';b.setAttribute('aria-pressed',String(!breeze));render();});
 const dialog=$('#directory');listen($('#directory-open'),'click',()=>dialog.showModal());listen($('#directory-close'),'click',()=>dialog.close());
 listen(dialog,'click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 const load=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=asset(src);});
 Promise.all(['island-complete-v4.png',...bodies.map(b=>'v6-native-'+b.id+(['work','thoughts'].includes(b.id)?'-clean':'')+'.webp')].map(load)).then(async loaded=>{
  if(disposed)return;const renderer=await window.createTerrainRenderer(canvas,bodies,loaded[0],loaded.slice(1));if(disposed){renderer.dispose();return;}terrain=renderer;ready=true;$('#loading').hidden=true;render();
  ['yifan-wave.webp','cat-stretch.webp',...bodies.filter(b=>b.hot).map(b=>'reaction-'+b.id+'.webp')].forEach(src=>{load(src).catch(()=>{});});
 }).catch(()=>{if(!disposed){root.dataset.failed='true';$('#loading').textContent='可从区域目录继续探索。';render();}});
 listen(canvas,'terrainlost',()=>{ready=false;terrain?.dispose();terrain=null;root.dataset.failed='true';render();});
 listen(window,'pagehide',()=>{cancelAnimationFrame(frame);frame=0;});listen(window,'pageshow',()=>run());
 root.dataset.mounted='true';render();
 const review={mode:'scroll',pieces:bodies,getProgress:()=>value,getReady:()=>ready,getBounds:()=>terrain?.getBounds(),getFrame:()=>terrain?.getFrame(),getPositions:()=>lastPositions,getCamera:()=>lastCamera,getSelection:()=>selected,
  setProgress:n=>{unselect(false);window.scrollTo({top:clamp(n)*(journey.offsetHeight-innerHeight),behavior:'instant'});render();},
  setMotionTime:n=>{manualMotion=true;motionTime=n;render();manualMotion=false;},getMotionTime:()=>motionTime,select,unselect};window.islandReview=review;
 return()=>{disposed=true;abort.abort();cancelAnimationFrame(frame);terrain?.dispose();scene.replaceChildren();wind.replaceChildren();delete root.dataset.mounted;if(window.islandReview===review)delete window.islandReview;};
};
