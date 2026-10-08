"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Radio, RotateCcw, Newspaper, X, FileSearch, Waves, Search, GripVertical } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Project } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import { curateRadioNews, newsRadioChannels, newsRadioSampleDay, type NewsChannelId, type NewsView, type RadioNews } from "@/lib/hot-news-radio-demo";
import { DemoSlot } from "./demo-slot";
import { ProjectDisclosure } from "./project-tour";
import { ProjectCaseStudyView } from "./project-case-study";
import { useNewsPaperDrag } from "./use-news-paper-drag";
import "./hot-news-radio-detail.css";

function RadioDesk() {
  const [channelId, setChannelId] = useState<NewsChannelId>("ai");
  const [state, setState] = useState<"idle" | "listening" | "ready">("idle");
  const [view, setView] = useState<NewsView>("news");
  const [original, setOriginal] = useState<RadioNews | null>(null);
  const [showBin, setShowBin] = useState(false);
  const knobRef = useRef<HTMLButtonElement>(null), resultRef = useRef<HTMLElement>(null);
  const originalRef = useRef<HTMLDivElement>(null), returnRef = useRef<HTMLButtonElement | null>(null);
  const focusResult = useRef(false);
  const focusKnob = useRef(false);
  const dialGesture=useRef<{id:number;x:number;index:number;moved:boolean}|null>(null);
  const dialClickSuppressed=useRef(false);
  const [dialPreview,setDialPreview]=useState<number|null>(null);
  const channel = newsRadioChannels.find(item => item.id === channelId)!;
  const { accepted, rejected } = curateRadioNews(channel.records);
  const tuned = state !== "idle", ready = state === "ready";

  useEffect(() => {
    if (state === "idle" && focusKnob.current) {
      focusKnob.current = false;
      knobRef.current?.focus({ preventScroll: true });
    }
    if (state !== "listening") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setState("ready"), reduce ? 60 : 2200);
    return () => window.clearTimeout(timer);
  }, [state]);
  useEffect(() => {
    if (!ready || !focusResult.current) return;
    focusResult.current = false;
    resultRef.current?.focus({ preventScroll: true });
    if (window.matchMedia("(max-width:700px)").matches) resultRef.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion:reduce)").matches ? "instant" : "smooth" });
  }, [ready]);
  useEffect(() => {
    if (!original) return;
    originalRef.current?.focus({ preventScroll: true });
    originalRef.current?.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion:reduce)").matches ? "instant" : "smooth" });
  }, [original]);

  const closeOriginal = () => { setOriginal(null); returnRef.current?.focus({ preventScroll: true }); };
  const readOriginal = (news: RadioNews, button: HTMLButtonElement) => {
    returnRef.current = button; setOriginal(news);
  };
  const {targetRef:trayRef,attachGhost,paper:dragPaper,over:overTray,cancel:cancelPaper,takeClick,handlers:paperHandlers}=useNewsPaperDrag(readOriginal);
  const cancelDial=()=>{const g=dialGesture.current;dialGesture.current=null;if(g?.moved)dialClickSuppressed.current=true;if(g&&knobRef.current?.hasPointerCapture(g.id))knobRef.current.releasePointerCapture(g.id);setDialPreview(null);};
  const reset = () => { cancelPaper();cancelDial();focusResult.current = false; focusKnob.current = true; setState("idle"); setView("news"); setOriginal(null); setShowBin(false); };
  const selectChannel = (id: NewsChannelId) => { cancelPaper();focusResult.current = false; setChannelId(id); setState("idle"); setOriginal(null); setShowBin(false); setView("news"); };
  const listen = () => { focusResult.current = true; setOriginal(null);setShowBin(false);setView("news");setState("listening"); };
  const moveDial=(e:PointerEvent<HTMLButtonElement>)=>{const g=dialGesture.current;if(!g||g.id!==e.pointerId)return;const dx=e.clientX-g.x;if(!g.moved&&Math.abs(dx)<7)return;g.moved=true;setDialPreview(Math.max(0,Math.min(2,g.index+Math.round(dx/45))));};

  return <section className="hn-desk" data-state={state} data-channel={channelId} aria-label="用收音机体验热点快报">
    <span id="hn-knob-help" className="sr-only">左右拖动调台并收听；箭头键选择频道，Enter 收听</span><span id="hn-news-help" className="sr-only">拖到查证托盘，或直接点击查看原文</span>
    {dragPaper&&<div ref={attachGhost} className="hn-drag-paper" aria-hidden="true"><Newspaper size={22}/><b>{dragPaper.title}</b><small>{dragPaper.source} · {dragPaper.date}</small><span>{overTray?"松手，查看出处":"拖到放大镜托盘"}</span></div>}
    <div className="hn-instruction" role="status"><Waves size={24} aria-hidden="true"/><p>{dragPaper?overTray?"对准了，松手查看这条消息的出处。":"把消息拖到放大镜托盘上。":state === "idle" ? "拖动旋钮调台，或选频道后点旋钮。" : state === "listening" ? "收听七日消息，重复和过期的先放一旁……" : accepted.length ? "拿起一条消息，拖到托盘里查证；也可以点击。" : "这次没有合格消息，快报就留空。"}</p></div>
    <div className="hn-scene" style={{backgroundImage:`url("${publicPath("/world/news-desk-v1.webp")}")`}}>
      <div className="hn-channels">
        <div className="hn-channel-paper"><span className="hn-pin" aria-hidden="true"/><small>近 7 天 · 虚构样本</small><h2>今天听什么？</h2><div role="group" aria-label="选择新闻频道">{newsRadioChannels.map(item => <button key={item.id} type="button" aria-pressed={channelId === item.id} onClick={() => selectChannel(item.id)}>{item.label}<ArrowRight size={17} aria-hidden="true"/></button>)}</div><p>演示日期<br/>{newsRadioSampleDay}</p></div>
      </div>
      <div className="hn-radio-place">
        <p className="hn-tuning-note">{dialPreview!==null?`${newsRadioChannels[dialPreview].label} · 松手收听`:state === "idle" ? "转个频道，听听看" : state === "listening" ? "正在接收消息……" : "有消息，也要有依据"}</p>
        <div className="hn-stage">
          <div className="hn-radio-device"><Image className="hn-radio-asset" src={publicPath("/world/news-radio-clean-v2.webp")} alt="干净的木色新闻收音机" width={1254} height={1254} sizes="(max-width:700px) 170px, 290px" priority unoptimized/>
            <button ref={knobRef} className="hn-knob" type="button" aria-label="拨动旋钮，整理七日快报" aria-describedby="hn-knob-help" disabled={state==="listening"} style={{"--dial-angle":`${(dialPreview??newsRadioChannels.findIndex(item=>item.id===channelId))*60-60}deg`} as CSSProperties}
              onPointerDown={e=>{if(!e.isPrimary||e.button!==0)return;dialClickSuppressed.current=false;dialGesture.current={id:e.pointerId,x:e.clientX,index:newsRadioChannels.findIndex(item=>item.id===channelId),moved:false};e.currentTarget.setPointerCapture(e.pointerId);}}
              onPointerMove={moveDial} onPointerUp={e=>{const g=dialGesture.current;if(!g||g.id!==e.pointerId)return;const id=newsRadioChannels[dialPreview??g.index].id;cancelDial();if(g.moved){selectChannel(id);listen();}}} onPointerCancel={cancelDial} onLostPointerCapture={cancelDial}
              onKeyDown={e=>{if(e.key==="Escape"){cancelDial();return;}if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();const i=newsRadioChannels.findIndex(item=>item.id===channelId);selectChannel(newsRadioChannels[Math.max(0,Math.min(2,i+(e.key==="ArrowRight"?1:-1)))].id);}}}
              onClick={()=>{if(dialClickSuppressed.current){dialClickSuppressed.current=false;return;}listen();}}><span aria-hidden="true"/></button>
            {state === "idle" && <span className="hn-knob-note" aria-hidden="true">↔ 拖动调台</span>}
            {state === "listening" && <span className="hn-waves" aria-hidden="true"><i/><i/><i/></span>}
          </div>
          <div className="hn-person" data-pose={ready&&!dragPaper ? "read" : "listen"} aria-hidden="true"><Image data-active={!ready||!!dragPaper} src={publicPath("/world/news-yifan-listen-v2.webp")} alt="" width={1254} height={1254} sizes="(max-width:700px) 260px, 450px" priority unoptimized/><Image data-active={ready&&!dragPaper} src={publicPath("/world/tender-yifan-receive-v1.webp")} alt="" width={1254} height={1254} sizes="(max-width:700px) 260px, 450px" priority unoptimized/></div>
          <div className="hn-cat" data-pose={dragPaper?"reach":state} aria-hidden="true"><Image data-active={!tuned&&!dragPaper} src={publicPath("/world/cat-scene-idle.webp")} alt="" width={200} height={200} sizes="90px" priority/><Image className="hn-cat-reach" data-active={state === "listening"||!!dragPaper} src={publicPath("/world/tender-cat-reach-v1.webp")} alt="" width={1254} height={1254} sizes="90px" priority/><Image data-active={ready&&!dragPaper} src={publicPath("/world/cat-scene-awake.webp")} alt="" width={200} height={200} sizes="90px" priority/></div>
          {state === "listening" && <div className="hn-flying-notes" aria-hidden="true">{["新消息", "重复消息", "日期核对"].map((label,index) => <span key={label} style={{ "--note-order":index } as CSSProperties}><Newspaper size={18}/>{label}<i/></span>)}</div>}
        </div>
        <div ref={trayRef} className="hn-check-tray" data-active={!!dragPaper} data-over={overTray} aria-label="新闻查证托盘"><Search size={28} aria-hidden="true"/><span>{overTray?"松手，看出处":ready&&accepted.length?"把消息拖到这里，看出处":"查证托盘"}<small>{ready&&accepted.length?"也可以点击新闻上的原文入口":"收听后，拿起一条消息试试"}</small></span></div>
      </div>
      <article ref={resultRef} className="hn-brief" tabIndex={-1} aria-label="七日快报结果" data-ready={ready}>
        <header><small>{channel.label}频道 · 固定演示</small><h2>七日快报</h2><Newspaper size={34} aria-hidden="true"/></header>
        {!ready ? <div className="hn-brief-wait"><Radio size={32} aria-hidden="true"/><p>{state === "idle" ? "消息还在路上。" : "正在把消息整理成短快报。"}</p><span>收听 → 筛选 → 回到来源</span></div> : accepted.length ? <>
          {view !== "news" && <p className="hn-view-note">{view === "decision" ? "变化与建议，仍回到这组消息。" : "换个讲法，依据还是这些消息。"}</p>}
          <ol className="hn-brief-list">{accepted.map((news,index) => <li key={news.id} data-dragged={dragPaper?.id===news.id}><span className="hn-news-number">{String(index+1).padStart(2,"0")}</span><div><h3>{news.title}</h3><p>{view === "news" ? news.summary : view === "decision" ? news.decision : news.angle}</p><small>{news.source} · {news.date}</small><button type="button" aria-label={`查看演示原文：${news.title}`} aria-describedby="hn-news-help" {...paperHandlers(news)} onClick={event => {if(takeClick())readOriginal(news,event.currentTarget);}}><GripVertical size={16} aria-hidden="true"/>拿起查证 / 查看原文 <ArrowRight size={15} aria-hidden="true"/></button></div></li>)}</ol>
          <p className="hn-coverage"><Check size={15} aria-hidden="true"/>留下 {accepted.length} 条有日期、有出处的消息。<span>仅代表这组样本，不能代表完整新闻覆盖。</span></p>
          <div className="hn-views" role="group" aria-label="快报阅读视角">{([["news","新闻"],["decision","决策"],["angle","选题"]] as const).map(([id,label]) => <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>)}</div>
        </> : <div className="hn-empty"><Radio size={34} aria-hidden="true"/><h3>近 7 天未发现合格新闻</h3><p>一张太旧，一张没有日期。<br/>没有依据，就不补写摘要。</p><button type="button" onClick={() => setShowBin(true)}>看看为什么没留下 <ArrowRight size={16} aria-hidden="true"/></button></div>}
      </article>
    </div>
    {ready && <button className="hn-bin-toggle" type="button" aria-expanded={showBin} aria-controls="news-bin" onClick={() => setShowBin(value => !value)}><Newspaper size={18} aria-hidden="true"/><span>没有留下的消息 · {rejected.length} 张</span><small>重复、过期或缺少日期，点开看看</small><ArrowRight size={15} aria-hidden="true"/></button>}
    {showBin && ready && <div id="news-bin" className="hn-bin"><header><h3>这些消息，为什么先放一旁？</h3><button type="button" aria-label="收起排除原因" onClick={() => setShowBin(false)}><X size={20}/></button></header><ul>{rejected.map(({news,reason}) => <li key={news.id}><Newspaper size={23} aria-hidden="true"/><div><b>{news.title}</b><p>{reason}</p><small>{news.source} · {news.date || "日期未提供"}</small></div></li>)}</ul></div>}
    {original && <div ref={originalRef} className="hn-original" role="region" aria-label="演示新闻原文" tabIndex={-1} onKeyDown={event => { if(event.key === "Escape") { event.preventDefault(); closeOriginal(); } }}><header><span><FileSearch size={20} aria-hidden="true"/>演示原文 · {original.id}</span><button type="button" aria-label="关闭演示原文" onClick={closeOriginal}><X size={21}/></button></header><h3>{original.title}</h3><p className="hn-source-meta">{original.source} · {original.date}</p><blockquote>{original.original}</blockquote><p>这是完整的本地虚构样本，不是真实媒体报道或外部网页。</p></div>}
    <footer className="hn-caption"><span>固定虚构演示 · 不进行实时检索</span>{tuned && <button type="button" onClick={reset}>再收听一次 <RotateCcw size={16} aria-hidden="true"/></button>}</footer>
  </section>;
}

export function HotNewsRadioDetail({project}:{project:Project}) {
  return <main className="project-page hot-news-radio-page"><header className="hn-intro"><Link className="hn-back" href="/work"><ArrowLeft size={18} aria-hidden="true"/>回到工作室</Link><h1>{project.title}</h1><p>把七日消息，整理成有来源的短快报。</p></header><div className="hn-play"><RadioDesk/></div><section className="hn-more" aria-label="项目资料"><ProjectDisclosure title="观看项目演示" caption="保留完整案例，看看一次快报如何整理"><DemoSlot title={project.title} demo={project.demo}/></ProjectDisclosure><ProjectDisclosure title="展开完整方法与证据" caption="只读检索、七日窗口与来源边界"><dl className="project-mast-facts"><div><dt>任务入口</dt><dd>{project.mastFacts.input}</dd></div><div><dt>关键判断</dt><dd>{project.mastFacts.judgment}</dd></div><div><dt>交付结果</dt><dd>{project.mastFacts.output}</dd></div></dl><p className="hn-repo-note">当前仓库的 README / 输出契约与 SKILL 对新闻条数上限存在不同口径；此页只演示共同的七日筛选、去重和来源绑定能力。下方保留已有完整技术资料。</p>{project.caseStudy && <ProjectCaseStudyView caseStudy={project.caseStudy}/>}</ProjectDisclosure></section><footer className="hn-final"><p>每条快报，都能回到来源。</p><a href={project.github} target="_blank" rel="noreferrer">查看 GitHub <ArrowRight size={17} aria-hidden="true"/></a><Link href="/work">回到工作室</Link></footer></main>;
}
