"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Application, Sprite, Texture } from "pixi.js";
import { zones } from "@/lib/world-data";
import { islandBodies, actorLayout, sceneSigns, sceneObjects, type BodyId } from "@/lib/world-layout";
import { useWorldStore } from "@/lib/world-store";
import { publicPath } from "@/lib/site-config";
import { WorldToys } from "./world-toys";
import { createWorldMotion } from "@/lib/world-motion";
import { worldReactions } from "@/lib/world-reactions";

const sceneZones = zones;
// Reuse an in-flight load across React remounts; release only after its last owner leaves.
let texturePool: {users:number;promise:Promise<Record<string,Texture>>;timer:ReturnType<typeof setTimeout>|null}|null=null;
const clamp = (value:number,min:number,max:number) => Math.max(min,Math.min(max,value));
type Camera = {x:number;y:number;zoom:number;vx:number;vy:number};

export default function WorldCanvas({onFailure}:{onFailure:()=>void}) {
  const host=useRef<HTMLDivElement>(null), overlay=useRef<HTMLDivElement>(null), folder=useRef<HTMLButtonElement>(null);
  const runtime=useRef<{pointerDown:(e:React.PointerEvent)=>void;pointerMove:(e:React.PointerEvent)=>void;pointerUp:(e:React.PointerEvent,cancel?:boolean)=>void;key:(e:React.KeyboardEvent)=>void;suppress:boolean} | null>(null);
  const [ready,setReady]=useState(false),[speech,setSpeech]=useState("");
  const actors=useRef<{greet:()=>void;rest:()=>void;pet:()=>void}|null>(null);
  const router=useRouter();
  const failRef=useRef(onFailure);
  useEffect(()=> { failRef.current=onFailure; },[onFailure]);
  useEffect(()=>{if(!speech)return;const timer=setTimeout(()=>setSpeech(""),8000);return()=>clearTimeout(timer);},[speech]);
  useEffect(()=> {
    const element=host.current, labels=overlay.current;
    if(!element||!labels) return;
    const sky=element.parentElement?.querySelector<HTMLElement>(".world-sky");
    let disposed=false, app:Application|null=null, initialized=false;
    let width=element.clientWidth,height=element.clientHeight,scale=1,tx=0,ty=0,drag: {id:number;mode:"world"|"object";x:number;y:number;lastX:number;lastY:number;moved:boolean}|null=null;
    let timer:ReturnType<typeof setTimeout>|null=null, resize:ResizeObserver|null=null, unsubscribe=()=>{}, releaseTextures=()=>{}, removeFeedback=()=>{},releaseMotion=()=>{};
    const reduce=matchMedia("(prefers-reduced-motion: reduce)");
    const camera:Camera={x:800,y:570,zoom:1,vx:0,vy:0};
    try { const saved=JSON.parse(sessionStorage.getItem("yifan-world-camera")||"null"); if(saved&&[saved.x,saved.y,saved.zoom].every(Number.isFinite)) Object.assign(camera,{x:clamp(saved.x,540,1060),y:clamp(saved.y,420,720),zoom:clamp(saved.zoom,.85,1.25)}); } catch { /* Optional session state. */ }
    let target:{x:number;y:number;zoom:number}|null=null;
    let spread=useWorldStore.getState().expanded?1:0, spreadFrom=spread, spreadTo=spread, spreadAt=0;
    let focusReturn:{x:number;y:number;zoom:number}|null=null;
    const assetNames=[...islandBodies.map(body=>body.asset),...zones.map(zone=>`reaction-${zone.id}`),"rigid-stair","rigid-person-idle","rigid-person-look","rigid-person-wave","rigid-cat-idle","rigid-cat-awake","rigid-cat-stretch"];
    const assets = assetNames.map(name=>publicPath(`/world/${name}.webp`));
    let person:Sprite|null=null;
    const remember=()=> { try {sessionStorage.setItem("yifan-world-camera",JSON.stringify({x:camera.x,y:camera.y,zoom:camera.zoom}));} catch {} };
    const cancel=()=> {const id=drag?.id;if(drag&&runtime.current)runtime.current.suppress=true;drag=null;if(id!==undefined&&element.hasPointerCapture(id))element.releasePointerCapture(id);camera.vx=0;camera.vy=0;element.dataset.dragging="false";if(folder.current)folder.current.style.transform="";remember();};
    const command=()=> {
      const c=useWorldStore.getState().cameraCommand;
      if(c.kind==="center") target={x:800,y:570,zoom:useWorldStore.getState().expanded?.88:1};
      if(c.kind==="zoom") target={x:camera.x,y:camera.y,zoom:clamp(camera.zoom+(c.value||0),.85,1.25)};
      if(c.kind==="focus"&&c.zone){const z=islandBodies.find(body=>body.id===c.zone)!;const expanded=useWorldStore.getState().expanded;target={x:expanded?z.x+z.width/2+z.spreadX:clamp(z.x+z.width*.5+z.clusterX,560,1040),y:expanded?z.y+z.height*.5+z.spreadY:clamp(z.y+z.height*.62+z.clusterY,430,690),zoom:clamp(c.value??1.18,.85,1.25)};}
      camera.vx=0;camera.vy=0;
    };
    const move=(e:React.PointerEvent)=> {
      if(!drag||e.pointerId!==drag.id)return;
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(Math.hypot(dx,dy)>6)drag.moved=true;
      if(drag.moved){
        if(!e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.setPointerCapture(e.pointerId);
        if(runtime.current)runtime.current.suppress=true;
        element.dataset.dragging="true";
        if(drag.mode==="object") {if(folder.current)folder.current.style.transform=`translate(${dx/scale}px,${dy/scale}px)`;}
        else {camera.vx=-(e.clientX-drag.lastX)/scale;camera.vy=-(e.clientY-drag.lastY)/scale;camera.x+=camera.vx;camera.y+=camera.vy;target=null;}
      }
      drag.lastX=e.clientX;drag.lastY=e.clientY;
    };
    runtime.current={suppress:false,pointerDown(e){
      if(e.button!==0||drag)return;
      this.suppress=false;
      const t=e.target as HTMLElement;
      if(t.closest("[data-no-pan]"))return;
      drag={id:e.pointerId,mode:t.closest("[data-world-object]")?"object":"world",x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};
      this.suppress=false;target=null;camera.vx=0;camera.vy=0;
    },pointerMove:move,pointerUp(e,canceled=false){
      if(!drag||drag.id!==e.pointerId)return;
      const d=drag;
      if(d.mode==="object"&&d.moved&&!canceled){const hit=labels.querySelector<HTMLElement>(".computer-hotspot")?.getBoundingClientRect();if(hit&&e.clientX>=hit.left&&e.clientX<=hit.right&&e.clientY>=hit.top&&e.clientY<=hit.bottom)router.push("/work/sales-copilot");}
      drag=null;element.dataset.dragging="false";if(folder.current)folder.current.style.transform="";
      if(canceled||d.mode==="object"||reduce.matches){camera.vx=0;camera.vy=0;}
      if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
      if(canceled)this.suppress=true;
      remember(); if(timer)clearTimeout(timer);if(!canceled)timer=setTimeout(()=>{if(runtime.current)runtime.current.suppress=false;},0);
    },key(e){if(e.target!==e.currentTarget)return;const deltas:Record<string,[number,number]>={ArrowLeft:[-45,0],ArrowRight:[45,0],ArrowUp:[0,-45],ArrowDown:[0,45]};if(deltas[e.key]){e.preventDefault();target=null;camera.x+=deltas[e.key][0];camera.y+=deltas[e.key][1];}if(e.key==="Home"){e.preventDefault();useWorldStore.getState().camera("center");}}};
    const blur=()=>cancel();const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"&&drag){e.preventDefault();cancel();}};window.addEventListener("blur",blur);window.addEventListener("keydown",escape);window.addEventListener("pagehide",remember);
    const visibility=()=>{if(document.hidden){cancel();app?.stop();}else app?.start();};document.addEventListener("visibilitychange",visibility);
    (async()=>{
      const {Application,Assets,Container,Sprite,Graphics}=await import("pixi.js");
      if(disposed)return;
      app=new Application();
      // Software WebGL can be much slower than native 2D for this flat sprite scene.
      const probe=document.createElement("canvas");
      const gl=probe.getContext("webgl",{failIfMajorPerformanceCaveat:true});
      const debug=gl?.getExtension("WEBGL_debug_renderer_info");
      const software=!gl||(debug&&/swiftshader|llvmpipe|software/i.test(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)));
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      await app.init({width,height,backgroundAlpha:0,resolution:Math.min(devicePixelRatio,1.5),autoDensity:true,antialias:true,preference:software?"canvas":"webgl"});initialized=true;
      element.dataset.rendererKind=software?"canvas":"webgl";
      if(disposed){app.destroy(true,{children:true});return;}
      element.prepend(app.canvas);app.canvas.setAttribute("aria-hidden","true");
      if(!texturePool)texturePool={users:0,promise:Assets.load<Texture>(assets),timer:null};
      const pool=texturePool;pool.users++;if(pool.timer)clearTimeout(pool.timer);
      releaseTextures=()=>{pool.users--;pool.timer=setTimeout(()=>{void pool.promise.then(async()=>{if(pool.users===0){if(texturePool===pool)texturePool=null;await Assets.unload(assets);}}).catch(()=>{if(texturePool===pool)texturePool=null;});},100);};
      const loaded=await pool.promise;
      const textures=Object.fromEntries(assetNames.map(name=>[name,loaded[publicPath(`/world/${name}.webp`)]]));
      if(disposed)return;
      const world=new Container();app.stage.addChild(world);
      const motion=createWorldMotion(textures);
      world.addChild(motion.view);releaseMotion=motion.destroy;motion.setSpread(spread);
      const painted:{tint:number}[]=[...motion.painted];
      const central=motion.body('central');
      const add=(name:string,x:number,y:number,w:number,h=w)=>{const s=new Sprite(textures[name]);s.position.set(x,y);s.width=w;s.height=h;central.addChild(s);painted.push(s);return s;};
      // Ground contact stays on the same plane as the shoes and the cat's body.
      const contact=new Graphics();
      contact.ellipse(713,670,83,9).fill({color:0x324b2c,alpha:.09});
      contact.ellipse(668,670,34,5).fill({color:0x324b2c,alpha:.13});
      contact.ellipse(745,675,33,5).fill({color:0x324b2c,alpha:.13});
      const catContact=new Graphics();catContact.ellipse(878,675,62,6).fill({color:0x324b2c,alpha:.15});
      central.addChild(contact,catContact);
      const pa=actorLayout.person,ca=actorLayout.cat;
      person=add("rigid-person-idle",pa.x+pa.width/2,pa.y+pa.width,pa.width);person.anchor.set(.5,1);
      const wave=add("rigid-person-wave",person.x,person.y,pa.width);wave.anchor.set(.5,1);wave.alpha=0;
      const cat=add("rigid-cat-idle",ca.x+ca.width/2,ca.y+ca.width,ca.width);cat.anchor.set(.5,1);
      const stretch=add("rigid-cat-stretch",cat.x,cat.y,ca.width);stretch.anchor.set(.5,1);stretch.alpha=0;
      const reactionPair=add('reaction-work',575,675-worldReactions.work.foot*395,395);reactionPair.alpha=0;
      const personScale=person.scale.y,catScale=cat.scale.y;
      let greetAt=-Infinity,catAt=-Infinity,looking=false,waveBlend=0,stretchBlend=0;
      actors.current={greet:()=>{greetAt=performance.now();looking=true;},rest:()=>{looking=false;},pet:()=>{catAt=performance.now();}};
      const floatingLabels=[...labels.querySelectorAll<HTMLElement>("[data-island-owner]")].map(node=>({node,owner:node.dataset.islandOwner as BodyId}));
      const lamps:InstanceType<typeof Graphics>[]=[];
      for(const body of islandBodies.filter(body=>!['central','thoughts'].includes(body.id))){const node=new Graphics();node.circle(0,0,13).fill({color:0xffce75,alpha:.13});node.circle(0,0,4).fill({color:0xffdc88,alpha:.35});node.position.set(body.x+body.width*.60,body.y+body.height*.24);motion.body(body.id).addChild(node);lamps.push(node);}
      let lastCommand=useWorldStore.getState().cameraCommand.sequence;
      let previousExpanded=useWorldStore.getState().expanded,previousPreview=useWorldStore.getState().preview;
      const updateState=()=>{const state=useWorldStore.getState();painted.forEach(s=>s.tint=state.theme==="night"?0x9dabcd:0xffffff);lamps.forEach(lamp=>lamp.visible=state.theme==="night");
        if(state.expanded!==previousExpanded){spreadFrom=spread;spreadTo=state.expanded?1:0;spreadAt=performance.now();previousExpanded=state.expanded;focusReturn=null;target={x:800,y:570,zoom:state.expanded?.88:1};camera.vx=camera.vy=0;}
        if(state.preview!==previousPreview){if(state.preview&&state.expanded){if(!previousPreview)focusReturn={x:camera.x,y:camera.y,zoom:camera.zoom};const body=islandBodies.find(body=>body.id===state.preview)!;target={x:body.x+body.width/2+body.spreadX,y:body.y+body.height/2+body.spreadY,zoom:1.18};greetAt=catAt=performance.now();looking=true;setSpeech(`一起去${zones.find(zone=>zone.id===state.preview)!.title}看看。`);}else if(!state.preview&&focusReturn){target=focusReturn;focusReturn=null;}previousPreview=state.preview;}
        if(state.cameraCommand.sequence!==lastCommand){lastCommand=state.cameraCommand.sequence;command();}};
      updateState();unsubscribe=useWorldStore.subscribe(updateState);
      resize=new ResizeObserver(()=>{width=element.clientWidth;height=element.clientHeight;app?.renderer.resize(width,height);});resize.observe(element);
      app.ticker.maxFPS=60;
      let lastSnapshot=0;
      app.ticker.add(ticker=>{
        const dt=Math.min(ticker.deltaTime,2);
        const now=performance.now(),moving=useWorldStore.getState().breeze&&!reduce.matches;
        const progress=reduce.matches?1:clamp((now-spreadAt)/1500,0,1);
        const eased=progress*progress*progress*(progress*(progress*6-15)+10);
        spread=spreadFrom+(spreadTo-spreadFrom)*eased;
        motion.setSpread(spread);motion.update(now,moving);
        const waving=now-greetAt<2100,stretching=now-catAt<2400,awake=now-catAt<6500;
        const selected=useWorldStore.getState().preview;
        const reaction=selected?worldReactions[selected]:null;
        if(selected&&reaction){reactionPair.texture=textures[`reaction-${selected}`];reactionPair.y=675-reaction.foot*395;}
        reactionPair.alpha+=(Number(Boolean(selected))-reactionPair.alpha)*(reduce.matches?1:Math.min(dt*.2,1));
        const blend=reduce.matches?1:Math.min(dt*.24,1);
        waveBlend+=((waving?1:0)-waveBlend)*blend;wave.alpha=waveBlend;person!.alpha=1-waveBlend;
        stretchBlend+=((stretching?1:0)-stretchBlend)*blend;stretch.alpha=stretchBlend;cat.alpha=1-stretchBlend;
        person!.texture=textures[looking?"rigid-person-look":"rigid-person-idle"];
        cat.texture=textures[awake?"rigid-cat-awake":"rigid-cat-idle"];
        person!.alpha*=1-reactionPair.alpha;wave.alpha*=1-reactionPair.alpha;cat.alpha*=1-reactionPair.alpha;stretch.alpha*=1-reactionPair.alpha;
        contact.alpha=catContact.alpha=1-reactionPair.alpha;
        person!.scale.y=personScale*(1+(moving?Math.sin(now/850)*.0025:0));
        wave.rotation=waving&&!reduce.matches?Math.sin((now-greetAt)/110)*.003:0;
        cat.scale.y=catScale*(1+(moving&&!awake?Math.sin(now/750)*.006:0));
        floatingLabels.forEach(({node,owner})=>{const offset=motion.offset(owner);node.style.translate=`${offset.x.toFixed(2)}px ${offset.y.toFixed(2)}px`;});
        element.dataset.personAction=waving?"wave":"idle";element.dataset.catAction=stretching?"stretch":awake?"awake":"sleep";
        element.dataset.regionReaction=selected||"idle";element.dataset.personReaction=reaction?.person||"idle";element.dataset.catReaction=reaction?.cat||"sleep";
        element.dataset.islandOffsets=sceneZones.map(z=>{const b=islandBodies.find(b=>b.id===z.id)!;return (motion.offset(z.id).y-b.clusterY*(1-spread)-b.spreadY*spread).toFixed(2);}).join(",");
        element.dataset.spread=spread.toFixed(3);element.dataset.selectedIsland=useWorldStore.getState().preview||"";
        if(now-lastSnapshot>100){element.dataset.rigidFrame=JSON.stringify(motion.snapshot());lastSnapshot=now;}
        const focused=useWorldStore.getState().expanded&&Boolean(selected);
        if(focused&&selected){const body=islandBodies.find(body=>body.id===selected)!;const offset=motion.offset(selected);target={x:body.x+body.width/2+offset.x,y:body.y+body.height/2+offset.y,zoom:1.18};}
        if(target){const amount=reduce.matches?1:Math.min(.15*dt,1);camera.x+=(target.x-camera.x)*amount;camera.y+=(target.y-camera.y)*amount;camera.zoom+=(target.zoom-camera.zoom)*amount;if(Math.abs(camera.x-target.x)+Math.abs(camera.y-target.y)+Math.abs(camera.zoom-target.zoom)<.04){Object.assign(camera,target);target=null;if(!focused)remember();}}
        else if(!drag&&!reduce.matches){camera.x+=camera.vx*dt;camera.y+=camera.vy*dt;camera.vx*=Math.pow(.88,dt);camera.vy*=Math.pow(.88,dt);}
        const wideBounds=focused||Boolean(target);
        camera.x=clamp(camera.x,wideBounds?0:540,wideBounds?1650:1060);camera.y=clamp(camera.y,wideBounds?-50:420,wideBounds?1250:720);
        scale=Math.min(width/1600,height/1050)*camera.zoom;tx=width/2-camera.x*scale;ty=height/2-camera.y*scale;
        world.position.set(tx,ty);world.scale.set(scale);labels.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`;labels.style.setProperty("--label-scale",String(Math.max(1,.78/scale)));
        if(sky)sky.style.transform=reduce.matches?"":`translate(${(800-camera.x)*.045}px,${(570-camera.y)*.03}px)`;
        element.dataset.camera=`${camera.x.toFixed(1)},${camera.y.toFixed(1)},${camera.zoom.toFixed(2)}`;
      });
      element.dataset.renderer="ready";setReady(true);
      removeFeedback=()=>{actors.current=null;};
    })().catch(()=>{if(!disposed)failRef.current();});
    return()=>{disposed=true;runtime.current=null;cancel();if(timer)clearTimeout(timer);resize?.disconnect();unsubscribe();removeFeedback();window.removeEventListener("blur",blur);window.removeEventListener("keydown",escape);window.removeEventListener("pagehide",remember);document.removeEventListener("visibilitychange",visibility);releaseMotion();if(app&&initialized){app.destroy(true,{children:true});}releaseTextures();};
  },[router]);
  return <div className="world-viewport" ref={host} aria-label="可探索的创作岛，方向键移动，Home 回到中心" tabIndex={0} onPointerDown={e=>runtime.current?.pointerDown(e)} onPointerMove={e=>runtime.current?.pointerMove(e)} onPointerUp={e=>runtime.current?.pointerUp(e)} onPointerCancel={e=>runtime.current?.pointerUp(e,true)} onLostPointerCapture={e=>runtime.current?.pointerUp(e,true)} onKeyDown={e=>runtime.current?.key(e)}>
    {!ready&&<p className="world-loading" role="status">正在铺好通往小岛的路…</p>}
    <div ref={overlay} className="world-overlay" style={{visibility:ready?"visible":"hidden"}} onClickCapture={e=>{if(e.detail>0&&runtime.current?.suppress){e.preventDefault();e.stopPropagation();}}}>
      {sceneZones.map(zone=>{const body=islandBodies.find(body=>body.id===zone.id)!;return <button key={`body-${zone.id}`} className="world-island-hit world-hotspot" data-island-owner={zone.id} aria-label={`探索${zone.title}岛`} style={{left:body.x+body.width*.13,top:body.y+body.height*.12,width:body.width*.74,height:body.height*.58}} onClick={()=>{useWorldStore.getState().setPreview(zone.id);useWorldStore.getState().camera("focus",undefined,zone.id);}}/>;})}
      {sceneZones.map(zone=><button className="world-sign" data-island-owner={zone.id} style={{left:sceneSigns[zone.id][0],top:sceneSigns[zone.id][1]}} key={zone.id} aria-label={`${zone.title}${zone.status==="coming"?"，待更新":""}，打开预览`} onClick={()=>{useWorldStore.getState().setPreview(zone.id);useWorldStore.getState().camera("focus",undefined,zone.id);}}><b>{zone.title}</b><small>{zone.status==="coming"?"待更新":zone.english}</small></button>)}
      <button className="person-hotspot world-hotspot" data-island-owner="central" data-no-pan aria-label="和杨逸凡打个招呼" style={{left:626,top:338,width:230,height:332}} onPointerEnter={()=>actors.current?.greet()} onPointerLeave={()=>actors.current?.rest()} onFocus={()=>actors.current?.greet()} onBlur={()=>actors.current?.rest()} onClick={()=>{actors.current?.greet();setSpeech("你好，欢迎来到我的世界。");}}/>
      <button className="cat-hotspot world-hotspot" data-island-owner="central" data-no-pan aria-label="摸摸小牛" style={{left:813,top:590,width:145,height:91}} onClick={()=>{actors.current?.pet();setSpeech("喵～ 小牛伸了个懒腰，陪你逛一会儿。");}}/>
      <button className="world-folder" data-island-owner="work" ref={folder} data-world-object aria-label="客户文件夹，拖到电脑或点击体验 Sales Copilot" style={{left:sceneObjects.folder.x,top:sceneObjects.folder.y}} onClick={()=>router.push("/work/sales-copilot")}><Image src={publicPath("/world/folder-v2.webp")} alt="" width={78} height={78} unoptimized/><span>客户文件</span></button>
      <a className="computer-hotspot world-hotspot" data-island-owner="work" data-no-pan href={publicPath("/work/sales-copilot")} aria-label="电脑，体验 Sales Copilot" style={{left:sceneObjects.computer.x,top:sceneObjects.computer.y,width:sceneObjects.computer.width,height:sceneObjects.computer.height}}/>
      <WorldToys/>
    </div>
    {speech&&<div className="world-speech" data-no-pan role="status"><span>{speech}</span><button onClick={()=>useWorldStore.getState().setPanel("profile")}>认识一下</button><button className="speech-dismiss" aria-label="收起对话" onClick={()=>setSpeech("")}>×</button></div>}
  </div>;
}
