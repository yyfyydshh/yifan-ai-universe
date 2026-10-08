"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle, PencilLine, RotateCcw, Phone, NotebookPen, X } from "lucide-react";
import type { Project } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import { DemoSlot } from "./demo-slot";
import { ProjectDisclosure } from "./project-tour";
import { ProjectCaseStudyView } from "./project-case-study";
import "./sales-telephone-detail.css";

const chapters = ["初次来电", "问清细节", "讨论方案"] as const;
const shortReplies = ["想持续采集网页数据，少做些人工整理。", "数据和更新要求已整理，想减少重复操作。", "希望打通采集到交付，再接入现有系统。"] as const;
const followups = [
  { question: "你会先问什么？", useful: "问业务和数据范围", premature: "直接推荐完整方案", explanation: "先问清需求，再推荐方案。" },
  { question: "还要确认哪一件事？", useful: "问规模和自动化范围", premature: "现在承诺价格和工期", explanation: "规模还没问清，暂时不能给出报价。" },
] as const;

// Each compact summary retains its own source reply.
const summaryFacts = [
  { text: "持续采集公开网页数据，目前靠人工整理", turn: 0 },
  { text: "已补充行业、目标数据、字段与更新频率", turn: 1 },
  { text: "打通采集到交付，评估现有系统或 AI 衔接", turn: 2 },
] as const;

export function SalesTelephoneDetail({ project }: { project: Project }) {
  const [turn, setTurn] = useState(0);
  const [connected, setConnected] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [source, setSource] = useState<{ text: string; turn: number } | null>(null);
  const [brief, setBrief] = useState(false);
  const [history, setHistory] = useState(false);
  const [petted, setPetted] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const noteDialog = useRef<HTMLDialogElement>(null);
  const cutout = useId();
  useEffect(() => {
    if (noteOpen) noteDialog.current?.showModal();
    else noteDialog.current?.close();
  }, [noteOpen]);
  const study = project.caseStudy;
  if (study?.visualKind !== "sales-conversion") return null;
  const current = study.turns[turn];
  const nextReply = current.outputs.find(output => output.id === "reply")!;
  const action = !connected || turn === 0 ? "listening" : brief ? "summary" : "recording";
  const figure = action === "summary" ? "/world/tender-yifan-guide-v1.webp" : action === "recording" ? "/world/tender-yifan-receive-v1.webp" : "/world/news-yifan-listen-v2.webp";
  const cat = petted || brief ? "/world/cat-scene-stretch.webp" : connected ? "/world/cat-scene-awake.webp" : "/world/cat-scene-idle.webp";
  const facts = brief ? summaryFacts : current.newFacts.slice(0, turn === 2 ? 2 : undefined).map(text => ({ text, turn }));
  function closeNote() { setNoteOpen(false); setSource(null); }
  function restart() {
    setTurn(0); setConnected(false); setFeedback(null); setSource(null); setBrief(false); setHistory(false); setPetted(false); setNoteOpen(false);
  }
  function advance() {
    setTurn(Math.min(turn + 1, 2)); setFeedback(null); setSource(null); setHistory(false);
  }

  return <main className="sales-page">
    <svg width="0" height="0" className="sales-filters" aria-hidden="true"><defs><filter id={cutout} colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncA type="table" tableValues="0 0 0 1 1"/></feComponentTransfer></filter></defs></svg>
    <header className="sales-intro">
      <Link href="/work" className="sales-back"><ArrowLeft size={17} aria-hidden="true"/>回到工作室</Link>
      <h1>{project.title}</h1>
      <p className="sales-lead">听需求，理线索，给建议。</p>
    </header>

    <section className="sales-demo sales-simulator" aria-labelledby="sales-demo-heading" data-connected={connected} data-brief={brief}>
      <div className="sales-scene" onKeyDown={event => { if (event.key === "Escape") setHistory(false); }}>
        <div className="sales-scene-toolbar">
          <h2 id="sales-demo-heading"><Phone size={16} aria-hidden="true"/>{brief ? "通话已整理" : connected ? "正在听客户说" : "有一通来电"}</h2>
          <button type="button" onClick={restart} aria-label="重新接一通电话"><RotateCcw size={16} aria-hidden="true"/>重来</button>
        </div>
        <div className="sales-customer-bubble" aria-live="polite">
          {history ? <div className="sales-history">
            <button type="button" onClick={() => setHistory(false)} aria-label="收起通话记录"><X size={16}/></button>
            {study.turns.slice(0, turn + 1).map((item, i) => <p key={item.id}><b>{chapters[i]}</b>{item.reply}</p>)}
          </div> : <p className="sales-current-reply">{brief ? "记好了，下一步先核验。" : connected ? shortReplies[turn] : "电话响了，接起来听听？"}</p>}
        </div>

        <div className="sales-still-life" data-action={action}>
          <svg className="sales-art-setting" viewBox="0 0 860 380" preserveAspectRatio="none" aria-hidden="true">
            <path className="sales-ground" d="M119 334 Q211 306 340 323 Q479 303 701 329 Q767 340 733 357 Q440 390 158 355 Q106 347 119 334Z"/>
            <path className="sales-ground-line" d="M141 349 Q227 355 275 349 M557 351 Q671 356 714 347"/>
            <g className="sales-setting-plant"><path d="M109 335 Q93 297 105 269 M98 305 Q76 280 59 283 M99 297 Q123 280 137 275"/>
              <path className="sales-setting-leaf" d="M59 283 Q58 262 84 277 Q90 291 59 283Z M103 283 Q89 261 108 246 Q124 264 103 283Z M115 286 Q127 260 146 271 Q141 291 115 286Z"/>
            </g>
            <path className="sales-breeze" d="M625 49 Q655 31 689 44 Q713 55 740 45 M70 139 Q87 130 104 137"/>
          </svg>
          <div className="sales-reader" aria-hidden="true"><Image key={figure} src={publicPath(figure)} alt="" width={1254} height={1254} style={{filter: "url(#" + cutout + ")"}} sizes="(max-width:600px) 240px, 380px" unoptimized/></div>
          <div className="sales-phone-stand" aria-hidden="true"/>
          <button type="button" className="sales-phone" onClick={() => {if (connected) setHistory(!history); else setConnected(true);}} aria-label={connected ? "查看通话记录" : "接起客户来电"} aria-expanded={connected ? history : undefined}>
            <Image src={publicPath("/world/sales-phone-v2.png")} alt="" width={1254} height={1254} sizes="180px" style={{filter: "url(#" + cutout + ")"}} unoptimized/>
            <span>{connected ? "通话记录" : "接起电话"}</span>
          </button>
          <button type="button" className="sales-notebook" disabled={!connected} aria-label={brief ? "查看沟通小结" : "查看需求笔记"} aria-haspopup="dialog" aria-expanded={noteOpen} onClick={() => setNoteOpen(true)}>
            <span className="sales-notebook-clip" aria-hidden="true"/>
            <NotebookPen size={36} aria-hidden="true"/>
            <span className="sales-notebook-title">{brief ? "沟通小结" : "需求笔记"}</span>
            <span className="sales-notebook-lines" aria-hidden="true"><i/><i/><i/></span>
            <small>{!connected ? "接听后记录" : brief ? "点击查看" : "已记下线索"}</small>
            {brief && <Check className="sales-notebook-check" size={21} aria-hidden="true"/>}
          </button>
          <button type="button" className="sales-cat" data-petted={petted} onClick={() => setPetted(!petted)} aria-pressed={petted} aria-label="摸摸小牛">
            <Image key={cat} src={publicPath(cat)} alt="" width={197} height={197} sizes="115px" unoptimized/>{petted && <span>呼噜～</span>}
          </button>
        </div>

        <div className="sales-question-area">
          {!connected ? <p className="sales-call-hint">点电话开始</p> : brief ? <p className="sales-end-message"><Check size={18} aria-hidden="true"/>点纸页，看看小结。</p> : turn < 2 ? <>
            <h3>{followups[turn].question}</h3>
            <div className="sales-choices"><button type="button" onClick={advance}>{followups[turn].useful}<ArrowRight size={16} aria-hidden="true"/></button><button type="button" onClick={() => setFeedback(followups[turn].explanation)}>{followups[turn].premature}</button></div>
            {feedback && <p className="sales-choice-feedback" role="status">{feedback}</p>}
          </> : <button type="button" className="sales-finish" onClick={() => {setBrief(true); setSource(null); setHistory(false);}}><NotebookPen size={18} aria-hidden="true"/>整理沟通小结<ArrowRight size={16} aria-hidden="true"/></button>}
        </div>

        <dialog ref={noteDialog} className="sales-note-dialog" aria-labelledby="sales-note-heading" onClose={closeNote} onKeyDown={event => {
          if (event.key === "Escape" && source) { event.preventDefault(); event.stopPropagation(); setSource(null); }
        }}>
          <article className="sales-note sim-customer-card">
            <header><PencilLine size={21} aria-hidden="true"/><h3 id="sales-note-heading">{brief ? "这次通话的沟通小结" : "需求笔记"}</h3><button type="button" className="sales-note-close" onClick={closeNote} aria-label="收起笔记"><X size={20}/></button></header>
            <p className="sales-context">{current.contextSummary}</p>
            <strong className="sales-stage-judgment">助手判断：{current.mql.level} · {current.mql.label}</strong>
            <h4 className="sales-paper-caption">{brief ? "客户已说明 · 累计三轮" : "这轮新听到的线索"}<span>点一条，回看原话</span></h4>
            <ul className="sales-new-facts">{facts.map(fact => <li key={fact.text}><button type="button" aria-expanded={source?.text === fact.text} onClick={() => setSource(source?.text === fact.text ? null : fact)}><Check size={15} aria-hidden="true"/><span>{fact.text}</span><MessageCircle size={14} aria-hidden="true"/></button></li>)}</ul>
            {source && <aside className="sales-source" aria-label="线索对应的客户原话"><span>{chapters[source.turn]} · 客户原话</span><p>{study.turns[source.turn].reply}</p><button type="button" onClick={() => setSource(null)}>收起原话</button></aside>}
            <div className="sales-next-question"><h4>{brief ? "下一步建议" : "追问建议"}</h4><p>{nextReply.value}</p></div>
            <p className="sales-unknown">{turn === 0 ? "没有问清的事，先留空，不替客户补答案。" : turn === 1 ? "再确认规模、交付和自动化范围。" : "还需确认：数据量、交付格式与系统接口；预算、采购与合规边界仍需人工确认。"}</p>
          </article>
        </dialog>
      </div>
      <p className="sales-disclosure">脱敏示例，不是实时客户分析；不连接在线服务，不发送回复。</p>
    </section>

    <div className="sales-capabilities" aria-label="项目的基本能力"><span>听需求</span><ArrowRight size={15} aria-hidden="true"/><span>补信息</span><ArrowRight size={15} aria-hidden="true"/><span>给建议</span></div>
    <div className="sales-more">
      <ProjectDisclosure title="观看项目演示" caption="视频"><DemoSlot title={project.title} demo={project.demo}/></ProjectDisclosure>
      <ProjectDisclosure title="展开完整方法与证据" caption="按需展开"><dl className="project-mast-facts"><div><dt>任务入口</dt><dd>{project.mastFacts.input}</dd></div><div><dt>关键判断</dt><dd>{project.mastFacts.judgment}</dd></div><div><dt>交付结果</dt><dd>{project.mastFacts.output}</dd></div></dl><ProjectCaseStudyView caseStudy={study}/></ProjectDisclosure>
    </div>
    <nav className="project-actions sales-exits" aria-label="销售助手项目链接"><a href={project.github} target="_blank" rel="noreferrer">查看 GitHub ↗</a><Link href="/work">回到工作室</Link></nav>
  </main>;
}
