"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Dices, Disc3, Send, Star } from "lucide-react";
import { publicPath } from "@/lib/site-config";
import { useWorldStore } from "@/lib/world-store";

export function WorldToys({compact=false}:{compact?:boolean}) {
  const [flying,setFlying]=useState(false),[playing,setPlaying]=useState(false),[stars,setStars]=useState(0),[feedback,setFeedback]=useState("");
  const audio=useRef<AudioContext|null>(null),soundTimer=useRef<ReturnType<typeof setTimeout>|null>(null),messageTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const stop=()=>{void audio.current?.close().catch(()=>{});audio.current=null;if(soundTimer.current)clearTimeout(soundTimer.current);setPlaying(false);};
  useEffect(()=>{const hidden=()=>{if(document.hidden)stop();};document.addEventListener("visibilitychange",hidden);return()=>{document.removeEventListener("visibilitychange",hidden);void audio.current?.close().catch(()=>{});if(soundTimer.current)clearTimeout(soundTimer.current);if(messageTimer.current)clearTimeout(messageTimer.current);};},[]);
  const say=(text:string)=>{setFeedback(text);if(messageTimer.current)clearTimeout(messageTimer.current);messageTimer.current=setTimeout(()=>setFeedback(""),6000);};
  const play=async()=>{
    if(audio.current){stop();say("唱片暂停了。慢慢逛，不着急。");return;}
    try{
      const ctx=new AudioContext();audio.current=ctx;setPlaying(true);await ctx.resume();if(audio.current!==ctx)return;
      const notes=[261.63,329.63,392,523.25,440,392,329.63,261.63];
      notes.forEach((frequency,index)=>{const oscillator=ctx.createOscillator(),gain=ctx.createGain();const start=ctx.currentTime+index*.38;oscillator.type="sine";oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.075,start+.03);gain.gain.exponentialRampToValueAtTime(.001,start+.34);oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(start);oscillator.stop(start+.36);});
      setPlaying(true);say("一小段示例旋律。声音作品还在慢慢整理。");soundTimer.current=setTimeout(stop,3300);
    }catch{stop();say("这里暂时无法播放声音，其他角落照常开放。");}
  };
  const panel=useWorldStore(s=>s.setPanel);
  return <div className={`world-toys ${compact?"world-toys--compact":""}`} aria-label="小岛上的可互动物件">
    <button data-no-pan data-island-owner="writing" className={`world-toy toy-plane ${flying?"is-flying":""}`} aria-label="放飞纸飞机" onClick={()=>{setFlying(true);useWorldStore.getState().gust();say("纸飞机绕着小岛飞一圈。跟着它，发现新的角落。");}} onAnimationEnd={()=>setFlying(false)}><Send aria-hidden="true"/><span>放飞纸飞机</span></button>
    <button data-no-pan data-island-owner="music" className={`world-toy toy-record ${playing?"is-playing":""}`} aria-label={playing?"停止示例旋律":"唱片机，播放示例旋律"} aria-pressed={playing} onClick={play}><Disc3 aria-hidden="true"/><span>{playing?"暂停旋律":"试听唱片"}</span>{playing&&<i aria-hidden="true">♪ ♫</i>}</button>
    <button data-no-pan data-island-owner="central" className="world-toy toy-notebook" aria-label="翻开随手笔记" onClick={()=>panel("notebook")}><Image src={publicPath("/world/tour-notebook.webp")} alt="" width={90} height={90} unoptimized/><span>翻开笔记</span></button>
    <button data-no-pan data-island-owner="games" className="world-toy toy-dice" aria-label="游戏桌，掷一次骰子" onClick={()=>panel("dice")}><Dices aria-hidden="true"/><span>玩一会儿</span></button>
    <button data-no-pan data-island-owner="thoughts" className="world-toy toy-camera" aria-label="相机，拍一张插画明信片" onClick={()=>panel("postcard")}><Camera aria-hidden="true"/><span>拍张明信片</span></button>
    <button data-no-pan data-island-owner="writing" className="world-toy toy-chime" aria-label="拨动风铃，吹来一阵清风" onClick={()=>{useWorldStore.getState().gust();say("微风穿过浮岛，风铃也跟着轻轻晃了起来。");}}><svg viewBox="0 0 64 86" aria-hidden="true"><path d="M32 0v13M8 22Q32 6 56 22" fill="none" stroke="#746444" strokeWidth="2"/><path d="M13 21v18m19-22v30m19-26v16" stroke="#746444" strokeWidth="1.5"/><rect x="9" y="37" width="8" height="26" rx="3" fill="#dbb373" stroke="#655640" strokeWidth="2"/><rect x="28" y="45" width="8" height="34" rx="3" fill="#e6c07d" stroke="#655640" strokeWidth="2"/><rect x="47" y="35" width="8" height="28" rx="3" fill="#dbb373" stroke="#655640" strokeWidth="2"/></svg><span>拨动风铃</span></button>
    <button data-no-pan data-island-owner="stuff" className="world-toy toy-jar" aria-label={`收集灵感，已收藏 ${stars} 颗星星`} onClick={()=>{const count=Math.min(stars+1,3);setStars(count);say(["收下第一颗灵感：先把一个小想法做出来。","第二颗灵感：留下过程，也是一种创作。","三颗灵感装满了。翻翻笔记，找个想法开始吧。"][count-1]);}}><svg viewBox="0 0 64 76" aria-hidden="true"><path d="M20 8h24v12l9 9v34q0 7-7 7H18q-7 0-7-7V29l9-9Z" fill="#e9f4de" stroke="#355345" strokeWidth="3"/><rect x="18" y="3" width="28" height="9" rx="3" fill="#b78a53" stroke="#355345" strokeWidth="3"/><path d="m32 30 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z" fill="#f6ce70" stroke="#795b34" strokeWidth="2"/></svg><span>{stars?`${stars} / 3 颗灵感`:"收集灵感"}</span>{stars>0&&<Star className="collected-star" fill="#f6ce70" aria-hidden="true"/>}</button>
    <button data-no-pan data-island-owner="stuff" className="world-toy toy-mail" aria-label="打开信箱，联系杨逸凡" onClick={()=>panel("contact")}><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M30 40h5v21h-5z" fill="#ac845d" stroke="#355345" strokeWidth="2"/><path d="M10 38V19c0-9 8-14 18-14h18c8 0 12 6 12 14v19Z" fill="#df8568" stroke="#355345" strokeWidth="3"/><path d="M10 38V19c0-9 8-14 18-14s18 5 18 14v19Z" fill="#f4af89" stroke="#355345" strokeWidth="3"/><path d="M18 19h20M18 26h20" fill="none" stroke="#355345" strokeWidth="3"/><path d="M51 24V8h10v8H51" fill="#f6ce70" stroke="#355345" strokeWidth="2"/></svg><span>打开信箱</span></button>
    {feedback&&<p className="toy-feedback" role="status">{feedback}</p>}
  </div>;
}
