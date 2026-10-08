"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, Check, FileSpreadsheet, FileText, Globe2, Link2, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import { opinionEvidence } from "@/lib/global-opinion-demo";
import { DemoSlot } from "./demo-slot";
import { ProjectCaseStudyView } from "./project-case-study";
import { ProjectDisclosure } from "./project-tour";
import "./global-opinion-detail.css";

function GlobeIllustration({ moving = false, small = false }: { moving?: boolean; small?: boolean }) {
  return <div className={`op-globe ${moving ? "op-globe--moving" : ""} ${small ? "op-globe--small" : ""}`} role="img" aria-label={moving ? "地球仪正在展示不同地区的公开信息" : "木质底座上的卡通地球仪"}>
    <Image className="op-globe-asset" src={publicPath("/world/global-opinion-globe-v1.webp")} alt="" width={1254} height={1254} sizes="(max-width: 700px) 240px, 360px" unoptimized />
    <div className="op-globe-back-ring" aria-hidden="true" />
    <div className="op-globe-ball" aria-hidden="true">
      <div className="op-globe-map-track">
        <svg viewBox="0 0 720 300" preserveAspectRatio="none" focusable="false" aria-hidden="true">
          <g fill="#729260" stroke="#4e7651" strokeWidth="3" strokeLinejoin="round">
            <path d="M25 70 60 44 100 48 115 77 145 80 160 104 144 129 109 121 85 154 57 140 43 106 19 101Z M108 153 135 161 153 192 144 224 119 252 101 231 91 192Z" />
            <path d="M209 61 239 42 266 52 269 76 292 78 310 107 291 125 254 118 245 151 218 160 192 133 195 99Z M248 166 284 158 303 185 293 221 268 257 241 224Z" />
            <path d="M336 99 367 79 407 87 434 111 428 143 397 155 377 140 348 147 323 124Z M380 178 414 167 432 184 450 213 424 235 389 223Z" />
            <path d="M505 70 540 44 580 48 595 77 625 80 640 104 624 129 589 121 565 154 537 140 523 106 499 101Z M588 153 615 161 633 192 624 224 599 252 581 231 571 192Z" />
            <path d="M689 61 710 48 718 64 718 139 698 151 672 128 675 99Z" />
          </g>
        </svg>
      </div>
      <div className="op-globe-lines" />
      <i className="op-globe-shine" />
      <i className="op-globe-region op-globe-region--a" /><i className="op-globe-region op-globe-region--b" /><i className="op-globe-region op-globe-region--c" />
    </div>
    <div className="op-globe-front-ring" aria-hidden="true" />
    <div className="op-globe-axis" aria-hidden="true" />
    <div className="op-globe-stem" aria-hidden="true" />
    <div className="op-globe-foot" aria-hidden="true" />
  </div>;
}

function HeroScene() {
  return <div className="op-hero-scene" aria-label="杨逸凡和奶牛猫坐在卡通地球仪旁">
    <i className="op-hero-cloud op-hero-cloud--one" /><i className="op-hero-cloud op-hero-cloud--two" />
    <span className="op-hero-star op-hero-star--one">✦</span><span className="op-hero-star op-hero-star--two">✳</span>
    <div className="op-hero-desk"><span>GLOBAL · EVIDENCE</span></div>
    <div className="op-hero-globe"><GlobeIllustration /></div>
    <Image className="op-hero-person" src={publicPath("/world/yifan-scene-idle.webp")} alt="" width={400} height={400} sizes="(max-width: 700px) 150px, 270px" priority />
    <Image className="op-hero-cat" src={publicPath("/world/cat-scene-idle.webp")} alt="" width={400} height={400} sizes="(max-width: 700px) 90px, 150px" priority />
    <span className="op-hero-pencil" aria-hidden="true">✎</span>
  </div>;
}

function ProblemScene() {
  return <section id="op-problem" className="op-problem" aria-labelledby="op-problem-title">
    <div className="op-problem-source" aria-label="零散的公开信息"><span className="op-paper op-paper--news">新闻<small>事件与报道</small></span><span className="op-paper op-paper--community">社区<small>讨论与疑问</small></span><span className="op-paper op-paper--social">社交<small>短评与回应</small></span><span className="op-paper op-paper--web">网页<small>公开说明</small></span></div>
    <div className="op-problem-copy"><h2 id="op-problem-title">信息很杂。<br/>先整理，再判断，还能找到依据。</h2><p>它把全球公开信息，整理成有证据的报告。</p></div>
    <div className="op-problem-result" aria-label="整理后的报告和证据卡"><div className="op-problem-report"><FileText aria-hidden="true"/><b>分析报告</b><i/><i/><i/></div><div className="op-problem-evidence"><Link2 size={18} aria-hidden="true"/><strong>EV-028</strong><small>能回到依据</small></div></div>
  </section>;
}

type DeskState = "idle" | "collecting" | "papers" | "sorting" | "ready" | "report";

function OpinionDesk() {
  const [state, setState] = useState<DeskState>("idle");
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const globeRef = useRef<HTMLButtonElement>(null);
  const duplicateRef = useRef<HTMLButtonElement>(null);
  const folderRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  const handoffFocusRef = useRef<"duplicate" | "folder" | null>(null);
  const hasPapers = state !== "idle";
  const cleaned = state === "ready" || state === "report";
  const evidence = opinionEvidence.find(record => record.id === selectedEvidence);
  const hint = {
    idle: "点一下地球仪，把全球信息收回来。",
    collecting: "新闻、社区、公开网页……信息正在落到桌上。",
    papers: "两张新闻内容一样。点重复的那张，把它丢进纸篓。",
    sorting: "重复内容不算两份证据。留下有用的信息。",
    ready: "整理好了！打开桌上的报告，看看发现了什么。",
    report: "点报告里的证据编号，就能找到结论的依据。",
  }[state];

  useEffect(() => {
    if (state === "idle" && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      globeRef.current?.focus({ preventScroll: true });
    }
    if (state === "papers" && handoffFocusRef.current === "duplicate") {
      handoffFocusRef.current = null;
      duplicateRef.current?.focus({ preventScroll: true });
    }
    if (state === "ready" && handoffFocusRef.current === "folder") {
      handoffFocusRef.current = null;
      folderRef.current?.focus({ preventScroll: true });
    }
    if (state !== "collecting" && state !== "sorting") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      handoffFocusRef.current = state === "collecting" ? "duplicate" : "folder";
      setState(state === "collecting" ? "papers" : "ready");
    }, reduceMotion ? 80 : state === "collecting" ? 1200 : 750);
    return () => window.clearTimeout(timer);
  }, [state]);

  const reset = () => {
    handoffFocusRef.current = null;
    restoreFocusRef.current = true;
    setState("idle");
    setSelectedEvidence(null);
  };

  return <div className="op-play-desk" data-state={state}>
    <div className="op-desk-instruction" role="status"><span aria-hidden="true">✦</span><p>{hint}</p></div>
    <div className="op-desk-world">
      <div className="op-desk-window" aria-hidden="true"><i/><i/><i/><span>公开信息的世界</span></div>
      <div className="op-desk-surface" aria-hidden="true"/>
      <div className="op-desk-globe">
        <button ref={globeRef} className="op-object-globe" type="button" aria-label="点地球仪，收集全球信息" disabled={state !== "idle"} onClick={() => setState("collecting")}>
          <GlobeIllustration moving={state === "collecting"}/>
          {state === "idle" && <span className="op-object-note">点我收集 <span aria-hidden="true">↖</span></span>}
        </button>
        <Image className="op-desk-person" src={publicPath(state === "collecting" ? "/world/yifan-scene-wave.webp" : cleaned ? "/world/yifan-scene-look.webp" : "/world/yifan-scene-idle.webp")} alt="" width={400} height={400} sizes="(max-width: 700px) 120px, 170px"/>
        <Image className="op-desk-cat" src={publicPath(state === "collecting" ? "/world/cat-scene-awake.webp" : state === "sorting" ? "/world/cat-scene-stretch.webp" : "/world/cat-scene-idle.webp")} alt="" width={400} height={400} sizes="(max-width: 700px) 78px, 110px"/>
      </div>

      <div className="op-desk-papers" aria-label="收集到的演示信息">
        {!hasPapers && <div className="op-paper-place"><span aria-hidden="true">↓</span><p>信息会落在这里</p></div>}
        {hasPapers && opinionEvidence.map((paper, index) => <article className="op-toy-paper" key={paper.id} data-highlight={selectedEvidence === paper.id} style={{ "--paper-index": index } as CSSProperties}>
          <small>{paper.region} · {paper.kind}</small><strong>{paper.deskTitle}</strong><i aria-hidden="true"/><i aria-hidden="true"/>
          <span className="op-paper-origin">{cleaned ? paper.id : paper.source}</span>
          {cleaned && <Check className="op-paper-check" size={22} aria-label="已保留"/>}
        </article>)}
        {(state === "collecting" || state === "papers" || state === "sorting") && <button ref={duplicateRef} type="button" className="op-toy-paper op-duplicate-paper" aria-label="把重复新闻放进纸篓" disabled={state !== "papers"} onClick={() => setState("sorting")}>
          <small>欧洲 · 新闻</small><strong>{opinionEvidence[0].deskTitle}</strong><i aria-hidden="true"/><span className="op-duplicate-stamp">同一条新闻</span><span className="op-duplicate-action">点我去重 <span aria-hidden="true">↗</span></span>
        </button>}
        {cleaned && <span className="op-kept-note"><Check size={16} aria-hidden="true"/>重复已移除，来源已保留</span>}
      </div>

      <div className="op-desk-output">
        {!cleaned && <div className="op-toy-bin" aria-label={state === "sorting" ? "重复新闻正在进入纸篓" : "放重复内容的纸篓"}>
          <svg viewBox="0 0 150 160" aria-hidden="true"><path className="op-bin-paper" d="m48 40 43-8 8 47-43 8Z"/><path className="op-bin-body" d="M26 52 38 145Q75 161 112 145L124 52Z"/><path className="op-bin-rim" d="M24 51Q75 32 126 51L124 62Q74 79 26 62Z"/><path className="op-bin-line" d="m45 75 6 63m23-59v64m29-67-5 62"/></svg>
          <span>重复内容</span>
        </div>}
        {state === "ready" && <button className="op-toy-folder" ref={folderRef} type="button" aria-label="打开分析报告" onClick={() => setState("report")}>
          <span className="op-folder-back" aria-hidden="true"/><span className="op-folder-sheet" aria-hidden="true"><FileText size={33}/><i/><i/></span><span className="op-folder-front"><Check size={24} aria-hidden="true"/><strong>有依据的报告</strong><small>点我打开</small></span>
        </button>}
        {state === "report" && <article className="op-toy-report" aria-label="演示报告">
          <span className="op-report-clip" aria-hidden="true"/><small>演示报告 / 某品牌</small><h3>售后等待，值得关注。</h3><p>售后体验是当前较集中的负面讨论主题之一。</p>
          <div className="op-report-sources"><span>依据在这里 ↓</span>{opinionEvidence.map(record => <button key={record.id} type="button" aria-pressed={record.id === selectedEvidence} onClick={() => setSelectedEvidence(current => current === record.id ? null : record.id)}>{record.id}</button>)}</div>
          {evidence && <div className="op-report-original" aria-live="polite"><b>{evidence.title}</b><small>演示原文 · {evidence.source} · {evidence.region} · 演示日前 {evidence.daysAgo} 天</small><p>{evidence.original}</p></div>}
          <div className="op-report-delivery"><FileText size={18} aria-hidden="true"/>报告 <span>＋</span><FileSpreadsheet size={18} aria-hidden="true"/>可复用的数据</div>
        </article>}
      </div>
    </div>
    <div className="op-desk-caption"><span>模拟案例 · 纸片展示整理原理，非真实采集结果</span>{state !== "idle" && <button type="button" onClick={reset}><RotateCcw size={16} aria-hidden="true"/>重新整理</button>}</div>
  </div>;
}

export function GlobalOpinionDetail({ project }: { project: Project }) {
  const demoRef = useRef<HTMLElement>(null);
  const begin = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    demoRef.current?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" });
    demoRef.current?.querySelector<HTMLButtonElement>(".op-object-globe")?.focus({ preventScroll: true });
  };

  return <main className="project-page opinion-page">
    <section className="op-hero" aria-labelledby="op-title"><div className="op-hero-inner"><div className="op-hero-copy"><Link href="/work" className="op-back"><ArrowLeft size={18} aria-hidden="true"/>回到工作室</Link><p className="op-eyebrow">WORKSHOP / GLOBAL EVIDENCE</p><h1 id="op-title">全球舆情与<br/>品牌口碑分析 Skill</h1><p className="op-hero-lead">把全球公开信息，整理成有证据的品牌判断。</p><div className="op-keywords"><span>全球多源</span><span>证据可追溯</span><span>报告交付</span></div><div className="op-hero-actions"><button type="button" className="op-primary" onClick={begin}><Play size={19} fill="currentColor" aria-hidden="true"/>动手整理一次</button><a href="#op-problem" className="op-secondary">它能做什么 <ArrowDown size={17} aria-hidden="true"/></a></div><p className="op-demo-note">卡通模拟体验 · 不发起真实检索</p></div><HeroScene/></div></section>

    <ProblemScene/>

    <section className="op-demo op-demo-play" id="op-demo" ref={demoRef} aria-labelledby="op-demo-title"><div className="op-section-head"><h2 id="op-demo-title">把信息，变成一份报告。</h2><p>点点桌上的物件，亲手试一遍。</p></div><OpinionDesk/></section>

    <section className="op-behind" aria-label="项目实现说明"><ProjectDisclosure title="想了解它如何实现？" caption="流程、分析能力与交付方式"><div className="op-chain">{["数据采集", "清洗去重", "证据分析", "报告与数据交付"].map((name, index) => <span key={name}>{name}{index < 3 && <ArrowRight size={15} aria-hidden="true"/>}</span>)}</div><p>根 Skill 编排阶段脚本与结构化产物；各阶段留下可核对的交接结果。数据覆盖不足时，会说明缺口，停止生成正式结论。</p><p><b>品牌 / 事件声誉：</b>梳理议题、立场与风险。<br/><b>产品 VOC：</b>分析使用体验、痛点与机会。<br/>交付 Markdown 报告、Excel 数据包，HTML 可按需生成。</p></ProjectDisclosure></section>

    <section className="op-more" aria-label="深入了解项目"><ProjectDisclosure title="项目视频与完整技术证据" caption="按需展开，查看原有项目资料"><DemoSlot title={project.title} demo={project.demo}/>{project.caseStudy && <ProjectCaseStudyView caseStudy={project.caseStudy}/>}</ProjectDisclosure></section>
    <div className="op-final"><div><Globe2 size={32} aria-hidden="true"/><p>把全球公开信息，变成有证据、能复核、能继续使用的分析结果。</p></div><a href={project.github} target="_blank" rel="noreferrer">查看 GitHub <ArrowRight size={18} aria-hidden="true"/></a><Link href="/work">回到工作室</Link></div>
  </main>;
}
