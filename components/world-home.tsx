"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LocateFixed, Minus, Plus, Wind, Expand, Shrink } from "lucide-react";
import { useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { publicPath } from "@/lib/site-config";
import { zones } from "@/lib/world-data";
import { useWorldStore } from "@/lib/world-store";
import { WorldToys } from "./world-toys";
import { WorldAtmosphere } from "./world-atmosphere";
import { WorldVoyage } from "./world-voyage";
import { JourneyPortrait } from "./world-journey-portrait";

const WorldCanvas = dynamic(() => import("./world-canvas"), { ssr: false });
const subscribe = (callback: () => void) => { const media = matchMedia("(max-width: 1023px), (pointer: coarse)"); media.addEventListener("change",callback); return () => media.removeEventListener("change",callback); };
const mobileSnapshot = () => matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
const serverSnapshot = () => true;

export function WorldHome() {
  const mobile = useSyncExternalStore(subscribe,mobileSnapshot,serverSnapshot);
  const [failed,setFailed] = useState(false);
  const theme = useWorldStore(s => s.theme);
  const camera = useWorldStore(s => s.camera);
  const breeze=useWorldStore(s=>s.breeze);
  const expanded=useWorldStore(s=>s.expanded);
  const pointerStart=useRef({x:0,y:0});
  const movePointer=(event:PointerEvent<HTMLElement>)=>{if(event.pointerType!=="mouse")return;const rect=event.currentTarget.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;event.currentTarget.style.setProperty("--pointer-x",String(x/rect.width-.5));event.currentTarget.style.setProperty("--pointer-y",String(y/rect.height-.5));event.currentTarget.style.setProperty("--mouse-x",`${x}px`);event.currentTarget.style.setProperty("--mouse-y",`${y}px`);event.currentTarget.style.setProperty("--pointer-visible","1");};
  const releasePointer=(event:PointerEvent<HTMLElement>)=>{if(Math.hypot(event.clientX-pointerStart.current.x,event.clientY-pointerStart.current.y)>6||(event.target as Element).closest("button,a"))return;const ripple=event.currentTarget.querySelector<HTMLElement>(".world-click-ripple"),rect=event.currentTarget.getBoundingClientRect();if(ripple&&!matchMedia("(prefers-reduced-motion: reduce)").matches){ripple.style.left=`${event.clientX-rect.left-12}px`;ripple.style.top=`${event.clientY-rect.top-12}px`;ripple.animate([{opacity:.8,transform:"scale(.4)"},{opacity:0,transform:"scale(3.5)"}],{duration:700});}};
  const breezeButton=<button className="paper-button world-breeze-toggle" aria-pressed={breeze} aria-label={breeze?"暂停清风动效":"开启清风动效"} onClick={()=>useWorldStore.getState().setBreeze(!breeze)}><Wind size={19}/><span>{breeze?"清风徐来":"风歇一会儿"}</span></button>;
  const directory = mobile || failed;
  return <main id="main-content" data-breeze={breeze} className={`world-home ${directory ? "world-home--journey" : ""}`}>
    <section className="world-hero" aria-label="杨逸凡的创作世界" onPointerMove={movePointer} onPointerDown={event=>{pointerStart.current={x:event.clientX,y:event.clientY};}} onPointerUp={releasePointer} onPointerLeave={event=>event.currentTarget.style.setProperty("--pointer-visible","0")}>
      <div className="world-sky" aria-hidden="true" style={{backgroundImage:`url('${publicPath(`/world/sky${theme === "night" ? "-night-v3" : "-v3"}.webp`)}')`}} />
      <WorldAtmosphere/>
      {!directory&&<><WorldVoyage/><button className="paper-button world-spread-toggle" aria-pressed={expanded} onClick={()=>useWorldStore.getState().setExpanded(!expanded)}>{expanded?<Shrink size={19}/>:<Expand size={19}/>}<span>{expanded?"聚拢小岛":"展开群岛"}</span></button></>}
      <div className="world-intro"><h1>杨逸凡的世界</h1><p>我做过的，写过的，想过的，<br/>以及还没做完的，都在这里。</p></div>
      {directory ? <JourneyPortrait/> : <WorldCanvas onFailure={() => setFailed(true)} />}
      {directory ? <><button className="paper-button journey-profile" onClick={() => useWorldStore.getState().setPanel("profile")}>快速了解我<ArrowRight size={18}/></button><div className="journey-breeze">{breezeButton}</div></> : <div className="world-controls"><div className="zoom-controls"><button className="icon-button" aria-label="放大世界" onClick={() => camera("zoom",0.1)}><Plus size={23}/></button><button className="icon-button" aria-label="缩小世界" onClick={() => camera("zoom",-0.1)}><Minus size={23}/></button>{breezeButton}</div><p>拖动空白处，随便逛逛。点击标牌，打开一个角落。</p><button className="paper-button" onClick={() => camera("center")}><LocateFixed size={19}/>回到中心</button></div>}
    </section>
    {directory && <><section className="journey-play" aria-label="随手玩一玩"><h2>岛上还有些小惊喜</h2><WorldToys compact/></section><section className="world-journey" aria-label="七区插画目录"><WorldVoyage compact/>{failed && <p className="world-fallback-note" role="status">已切换到插画目录，所有内容仍可直接访问。</p>}{zones.map((zone,index)=><article key={zone.id} className={`journey-zone ${index % 2 ? "journey-zone--reverse" : ""}`}><Image src={publicPath(`/world/${zone.asset}.webp`)} alt="" width={800} height={800} unoptimized/><div><h2>{zone.title}</h2><p>{zone.description}</p>{zone.status === "coming" && <span className="world-status">待更新 · 暂未上架</span>}<Link href={zone.route}>{zone.status === "coming" ? "看看这个角落" : `进入${zone.title}`}<ArrowRight size={18}/></Link></div></article>)}</section></>}
    <noscript><nav aria-label="直接访问区域">{zones.map(zone => <Link href={zone.route} key={zone.id}>{zone.title} </Link>)}</nav></noscript>
  </main>;
}
