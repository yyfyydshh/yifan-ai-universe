"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { RadioNews } from "@/lib/hot-news-radio-demo";

type Gesture = { id:number; x:number; y:number; startX:number; startY:number; moved:boolean; news:RadioNews; button:HTMLButtonElement };

export function useNewsPaperDrag(onDrop:(news:RadioNews,button:HTMLButtonElement)=>void) {
  const targetRef=useRef<HTMLDivElement>(null), ghostRef=useRef<HTMLDivElement>(null);
  const gesture=useRef<Gesture|null>(null), suppressed=useRef(false), frame=useRef(0);
  const [paper,setPaper]=useState<RadioNews|null>(null), [over,setOver]=useState(false);
  const contains=useCallback((x:number,y:number)=>{
    const b=targetRef.current?.getBoundingClientRect();
    return Boolean(b&&x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom);
  },[]);
  const place=useCallback(()=>{const g=gesture.current;if(g&&ghostRef.current)ghostRef.current.style.translate=`${g.x-95}px ${g.y-45}px`;},[]);
  const attachGhost=useCallback((node:HTMLDivElement|null)=>{ghostRef.current=node;place();},[place]);
  const cancel=useCallback(()=>{
    const g=gesture.current;gesture.current=null;cancelAnimationFrame(frame.current);
    if(g?.moved)suppressed.current=true;
    if(g?.button.hasPointerCapture(g.id))g.button.releasePointerCapture(g.id);
    setPaper(null);setOver(false);
  },[]);
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{if(e.key==="Escape"&&gesture.current){e.preventDefault();cancel();}};
    const hidden=()=>{if(document.hidden)cancel();};
    window.addEventListener("blur",cancel);window.addEventListener("resize",cancel);window.addEventListener("keydown",key);document.addEventListener("visibilitychange",hidden);
    return ()=>{cancelAnimationFrame(frame.current);window.removeEventListener("blur",cancel);window.removeEventListener("resize",cancel);window.removeEventListener("keydown",key);document.removeEventListener("visibilitychange",hidden);};
  },[cancel]);
  const tick=useCallback(function scroll(){
    const g=gesture.current;if(!g?.moved)return;
    const speed=g.y<85?-Math.min(16,(85-g.y)/4):g.y>innerHeight-85?Math.min(16,(g.y-innerHeight+85)/4):0;
    const hit=contains(g.x,g.y);
    if(speed&&!hit)window.scrollBy({top:speed,behavior:"instant"});
    setOver(hit);frame.current=requestAnimationFrame(scroll);
  },[contains]);
  return {targetRef,attachGhost,paper,over,cancel,
    takeClick(){if(suppressed.current){suppressed.current=false;return false;}return true;},
    handlers(news:RadioNews){return {
      onPointerDown(e:PointerEvent<HTMLButtonElement>){if(!e.isPrimary||e.button!==0||gesture.current)return;suppressed.current=false;gesture.current={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,news,button:e.currentTarget};e.currentTarget.setPointerCapture(e.pointerId);},
      onPointerMove(e:PointerEvent<HTMLButtonElement>){const g=gesture.current;if(!g||g.id!==e.pointerId)return;g.x=e.clientX;g.y=e.clientY;if(!g.moved&&Math.hypot(g.x-g.startX,g.y-g.startY)<7)return;e.preventDefault();if(!g.moved){g.moved=true;setPaper(news);frame.current=requestAnimationFrame(tick);}place();setOver(contains(g.x,g.y));},
      onPointerUp(e:PointerEvent<HTMLButtonElement>){const g=gesture.current;if(!g||g.id!==e.pointerId)return;const hit=g.moved&&contains(e.clientX,e.clientY);cancel();if(hit)onDrop(g.news,g.button);},
      onPointerCancel:cancel,onLostPointerCapture:cancel,
    };},
  };
}
