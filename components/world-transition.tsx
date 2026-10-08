"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { useWorldStore } from "@/lib/world-store";
import type { ZoneId } from "@/lib/world-data";
import "./world-transition.css";

export function useSceneTravel() {
  const router=useRouter();
  return { travelTo:(route:string,label:string,zone?:ZoneId)=>{
    if(matchMedia("(prefers-reduced-motion: reduce)").matches){useWorldStore.getState().setPreview(null);router.push(route);return;}
    router.prefetch(route);
    useWorldStore.getState().travelTo(route,label,zone);
  }};
}

export function WorldTransition() {
  const travel=useWorldStore(s=>s.travel),pathname=usePathname(),router=useRouter();
  const [arriving,setArriving]=useState(false);
  const sent=useRef(false);
  useEffect(()=>{
    if(!travel)return;
    sent.current=false;
    if(travel.zone)useWorldStore.getState().camera("focus",1.25,travel.zone);
    const leave=setTimeout(()=>{sent.current=true;router.push(travel.route);},500);
    const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"&&!sent.current){clearTimeout(leave);useWorldStore.getState().finishTravel();}};
    window.addEventListener("keydown",escape);
    // Always release the curtain if navigation fails or is superseded.
    const timeout=setTimeout(()=>useWorldStore.getState().finishTravel(),6500);
    return()=>{clearTimeout(leave);clearTimeout(timeout);window.removeEventListener("keydown",escape);};
  },[travel,router]);
  useEffect(()=>{
    if(!travel||pathname.replace(/\/$/,"")!==travel.route.replace(/\/$/,""))return;
    const reveal=setTimeout(()=>setArriving(true),160);
    const finish=setTimeout(()=>{useWorldStore.getState().finishTravel();setArriving(false);},800);
    return()=>{clearTimeout(reveal);clearTimeout(finish);};
  },[pathname,travel]);
  if(!travel)return null;
  return <div className={`world-transition ${arriving?"is-arriving":""}`} role="status" aria-live="polite"><div className="world-transition-paper"><Send size={54} aria-hidden="true"/><span>前往{travel.label}</span><i aria-hidden="true"/></div></div>;
}
