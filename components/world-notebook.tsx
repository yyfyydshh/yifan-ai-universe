"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Dices } from "lucide-react";
import { notes } from "@/lib/site-data";

export function WorldNotebook({onClose}:{onClose:()=>void}) {
  const [page,setPage]=useState(0);const note=notes[page];const route=page===0?"writing":"thoughts";
  return <div className="pocket-notebook"><p className="world-status">翻到第 {page+1} 页 / 共 {notes.length} 页</p><div className="pocket-notebook-page" aria-live="polite"><span>{note.theme}</span><h3>{note.title}</h3><p>{note.summary}</p><Link className="paper-button paper-button--primary" href={`/${route}/${note.slug}`} onClick={onClose}>读这篇文章<ArrowRight size={17}/></Link></div><div className="notebook-pagination"><button className="paper-button" disabled={page===0} onClick={()=>setPage(p=>p-1)}><ArrowLeft size={17}/>上一页</button><button className="paper-button" disabled={page===notes.length-1} onClick={()=>setPage(p=>p+1)}>下一页<ArrowRight size={17}/></button></div></div>;
}

export function WorldDice() {
  const [value,setValue]=useState<number|null>(null),[round,setRound]=useState(0);
  const spots:Record<number,number[]>={1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,3,4,6,7,9]};
  return <div className="pocket-game"><p>休息一下，掷一颗骰子。点骰子或下面的按钮都可以。</p><button className="cartoon-die" aria-label={value?`骰子是 ${value} 点，再掷一次`:"掷骰子"} onClick={()=>{setValue(1+Math.floor(Math.random()*6));setRound(r=>r+1);}}>{value?Array.from({length:9},(_,i)=><span key={i} className={spots[value].includes(i+1)?"die-dot":""}/>):<Dices size={70}/>}</button><p className="dice-result" role="status">{value?`第 ${round} 次：${value} 点。${value===6?"今天的好运气，接住了！":"再来一次？"}`:"准备好，看看会掷出几点。"}</p><button className="paper-button paper-button--primary" onClick={()=>{setValue(1+Math.floor(Math.random()*6));setRound(r=>r+1);}}>掷一次</button><p className="world-status">小岛上的互动彩蛋；游戏作品还在整理。</p></div>;
}
