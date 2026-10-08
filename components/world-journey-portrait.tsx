"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { publicPath } from "@/lib/site-config";
import { useWorldStore } from "@/lib/world-store";

export function JourneyPortrait() {
  const [greeting,setGreeting]=useState(false),[cat,setCat]=useState<"sleep"|"stretch"|"awake">("sleep");
  const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
  const personTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{timers.current.forEach(clearTimeout);if(personTimer.current)clearTimeout(personTimer.current);},[]);
  const greet=()=>{if(personTimer.current)clearTimeout(personTimer.current);setGreeting(true);personTimer.current=setTimeout(()=>setGreeting(false),2100);};
  const pet=()=>{timers.current.forEach(clearTimeout);setCat("stretch");timers.current=[setTimeout(()=>setCat("awake"),2400),setTimeout(()=>setCat("sleep"),6500)];};
  return <div className="journey-portrait" data-person-action={greeting?"wave":"idle"} data-cat-action={cat}>
    <Image className="journey-ground" src={publicPath("/world/mobile-ground.webp")} alt="" width={1536} height={1024} priority unoptimized/>
    <i className="journey-contact journey-person-contact" aria-hidden="true"/>
    <i className="journey-contact journey-cat-contact" aria-hidden="true"/>
    <button className="journey-person" aria-label="和杨逸凡打个招呼" onClick={greet}><Image src={publicPath(`/world/${greeting?"yifan-wave":"yifan-cartoon-v2"}.webp`)} alt="坐在创作岛上的杨逸凡" width={800} height={800} priority unoptimized/></button>
    <button className="journey-cat" aria-label="摸摸小牛" onClick={pet}><Image src={publicPath(`/world/${cat==="stretch"?"cat-stretch":cat==="awake"?"cat-awake":"cat-cartoon"}.webp`)} alt="奶牛猫小牛" width={800} height={800} priority unoptimized/></button>
    {(greeting||cat!=="sleep")&&<div className="journey-greeting" role="status"><span>{greeting?"你好，欢迎来到我的世界。":"小牛伸了个懒腰。"}</span><button onClick={()=>useWorldStore.getState().setPanel("profile")}>认识一下</button></div>}
  </div>;
}
