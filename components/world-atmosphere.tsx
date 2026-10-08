"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { useWorldStore } from "@/lib/world-store";
import "./world-atmosphere.css";

export function WorldAtmosphere() {
  const breeze=useWorldStore(s=>s.breeze),pulse=useWorldStore(s=>s.breezePulse);
  const [gust,setGust]=useState(false);
  useEffect(()=>{if(!pulse)return;const start=setTimeout(()=>setGust(true),0),end=setTimeout(()=>setGust(false),4200);return()=>{clearTimeout(start);clearTimeout(end);};},[pulse]);
  return <div className={`world-atmosphere ${breeze?"has-breeze":""} ${gust?"has-gust":""}`} aria-hidden="true">
    <div className="passing-cloud cloud-one"/><div className="passing-cloud cloud-two"/>
    {Array.from({length:9},(_,i)=><span key={i} className="breeze-leaf" style={{"--leaf-y":`${18+(i*17)%73}%`,"--leaf-delay":`${-i*3.7}s`,"--leaf-speed":`${19+(i*7)%17}s`,"--leaf-size":`${12+(i%3)*4}px`} as CSSProperties}><svg viewBox="0 0 30 20"><path d="M2 17C1 5 12 0 28 3c-2 13-12 17-26 14Z" fill={i%2?"#e6c876":"#a3bc7b"} stroke="#5c8254" strokeWidth="1.2"/><path d="M1 19 24 5" fill="none" stroke="#5c8254" strokeWidth="1"/></svg></span>)}
    <span className="world-pointer-leaf"><svg viewBox="0 0 30 20"><path d="M2 17C1 5 12 0 28 3c-2 13-12 17-26 14Z" fill="#d1d995" stroke="#4e7055"/><path d="m1 19 23-14" stroke="#4e7055"/></svg></span>
    <span className="world-click-ripple"/>
  </div>;
}

export function WorldGarlands() {
  return <svg className="world-garlands" viewBox="0 0 1600 1120" aria-hidden="true">
    <path className="world-garland-cord" d="M622 190Q770 297 962 230" fill="none" stroke="#6c6348" strokeWidth="2.5"/>
    {[{x:668,y:216,r:13},{x:717,y:237,r:8},{x:771,y:250,r:0},{x:828,y:254,r:-8},{x:886,y:245,r:-14},{x:938,y:236,r:-16}].map((p,i)=><g className="garland-flag" key={i} data-anchor-x={p.x} data-anchor-y={p.y} style={{transformOrigin:`${p.x}px ${p.y}px`,animationDelay:`${-i*.4}s`}}><path d={`M${p.x-9} ${p.y}l18 0-9 26Z`} transform={`rotate(${p.r} ${p.x} ${p.y})`} fill={["#e9b17d","#e9d387","#95bba0"][i%3]} stroke="#665b46" strokeWidth="1.2"/><circle className="garland-light" cx={p.x+20} cy={p.y+8} r="4" fill="#f6d77e"/></g>)}
  </svg>;
}
