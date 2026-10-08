"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, FileSpreadsheet, Braces, RotateCcw, Printer } from "lucide-react";
import { useEffect, useId, useRef, useState, type Ref } from "react";
import type { Project } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import { tenderPrinterFeatured, tenderPrinterRows, tenderPrinterSample, type TenderPrinterField, type TenderPrinterRow } from "@/lib/tender-printer-demo";
import { DemoSlot } from "./demo-slot";
import { ProjectDisclosure } from "./project-tour";
import { ProjectCaseStudyView } from "./project-case-study";
import { usePrinterPaperDrag } from "./use-printer-paper-drag";
import "./tender-printer-detail.css";

type PrinterState = "idle" | "feeding" | "loaded" | "printing" | "delivering" | "ready" | "done";

function ResultField({ row, selected, onSelect, buttonRef }: { row: TenderPrinterRow; selected: boolean; onSelect: () => void; buttonRef?: Ref<HTMLButtonElement> }) {
  return <button ref={buttonRef} type="button" className="tp-result-field" aria-pressed={selected} data-empty={!row.value} onClick={onSelect}><span>{row.field}</span><strong>{row.value || "留空"}</strong><ArrowRight size={15} aria-hidden="true"/></button>;
}

function PrinterDesk() {
  const [state, setState] = useState<PrinterState>("idle");
  const [activeField, setActiveField] = useState<TenderPrinterField | null>(null);
  const { attachPaper, attachTarget, attachGhost, focusPaper, dragging, overTarget, cancel, handlers } = usePrinterPaperDrag(() => setState("feeding"));
  const printRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLButtonElement>(null);
  const printerRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLElement>(null);
  const takeRef = useRef<HTMLButtonElement>(null);
  const paperClip = useId();
  const focusTarget = useRef<"paper" | "print" | "output" | "result" | null>(null);
  const selectedRow = tenderPrinterRows.find(row => row.field === activeField);
  const hint = {
    idle: dragging ? overTarget ? "对准了！松手，把公告交给打印机。" : "拿稳纸张，拖到打印机上方的进纸口。" : "拿起公告，拖到打印机的进纸口。",
    feeding: "公告正在进纸……先读原文，再整理。",
    loaded: "公告放好了。点打印机的绿色按钮。",
    printing: "整理项目、时间、金额……没有依据的字段留空。",
    delivering: "纸张滑到托盘上了……",
    ready: "打印好了，点托盘上的纸张查看字段。",
    done: "打印好了！点一个字段，看看它从哪句话来。",
  }[state];

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollOnPhone = (target: HTMLElement | null) => {
      if (window.matchMedia("(max-width:700px)").matches) target?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "center" });
    };
    if (state === "idle" && focusTarget.current === "paper") { focusTarget.current = null; focusPaper(); }
    if (state === "loaded" && focusTarget.current === "print") { focusTarget.current = null; printRef.current?.focus({ preventScroll: true }); scrollOnPhone(printerRef.current); }
    if (state === "ready" && focusTarget.current === "output") { focusTarget.current = null; takeRef.current?.focus({ preventScroll: true }); }
    if (state === "done" && focusTarget.current === "result") { focusTarget.current = null; firstFieldRef.current?.focus({ preventScroll: true }); scrollOnPhone(outputRef.current); }
    if (state !== "feeding" && state !== "printing" && state !== "delivering") return;
    const timer = window.setTimeout(() => {
      if (state !== "printing") focusTarget.current = state === "feeding" ? "print" : "output";
      setState(state === "feeding" ? "loaded" : state === "printing" ? "delivering" : "ready");
    }, reduceMotion ? 80 : state === "feeding" ? 650 : state === "printing" ? 1900 : 400);
    return () => window.clearTimeout(timer);
  }, [state, focusPaper]);

  const reset = () => { cancel(); focusTarget.current = "paper"; setActiveField(null); setState("idle"); };
  const selectField = (field: TenderPrinterField) => setActiveField(current => current === field ? null : field);
  const readReport = () => { focusTarget.current = "result"; setState("done"); };

  const personPose = state === "done" ? "receive" : dragging || state !== "idle" ? "guide" : "idle";
  const catPose = state === "done" ? "awake" : dragging || state !== "idle" ? "reach" : "idle";

  return <div className="tp-desk" data-state={state} data-dragging={dragging} data-over={overTarget}>
    {dragging && <div ref={attachGhost} className="tp-drag-paper" aria-hidden="true"><small>青岚学习馆</small><b>招标公告</b><i/><i/><i/><i/><span>原文 · 待整理</span></div>}
    <div className="tp-instruction" role="status"><span aria-hidden="true">✦</span><p>{hint}</p></div>
    <div className="tp-scene">
      <div className="tp-table" aria-hidden="true"/>
      <div className="tp-source-place">
        <article className="tp-source-paper" aria-label="虚构公告原文节选">
          <small>原公告 · 虚构样本</small><h3>青岚学习馆<br/>阅览室改造工程</h3>
          <div className="tp-notice-lines">{tenderPrinterSample.source.map((line, index) => <p key={line} data-highlight={selectedRow?.sourceIndex === index}><span>{line}</span></p>)}</div>
          {state === "idle" && <button ref={attachPaper} type="button" className="tp-feed-action" aria-label="拖动公告到打印机，键盘按 Enter 放入" {...handlers}><span>拿起纸张，拖到进纸口 <ArrowRight size={16} aria-hidden="true"/></span></button>}
        </article>
      </div>
      <div className="tp-machine-place" ref={printerRef}>
        <div className="tp-machine">
          {state === "idle" && <div ref={attachTarget} className="tp-feed-target" data-active={dragging} data-ready={overTarget} aria-label="打印机进纸口"><span>{overTarget ? "松手放入" : "进纸口"}</span></div>}
          {(state === "feeding" || state === "loaded" || state === "printing") && <div className="tp-feed-slip" aria-hidden="true"><b>招标公告</b><i/><i/><i/></div>}
          <Image className="tp-printer-asset" src={publicPath("/world/tender-printer-gray-v2.webp")} alt="与工作室入口一致的灰色卡通打印机，后方进纸、前方出纸" width={1536} height={1024} sizes="(max-width:700px) 310px, 450px" unoptimized priority/>
          <button className="tp-print-key" ref={printRef} type="button" aria-label="点绿色按钮，清洗并打印字段" disabled={state !== "loaded"} onClick={() => setState("printing")}><span className="tp-print-light" aria-hidden="true"/>{state === "loaded" && <span className="tp-print-note">点这里打印 <span aria-hidden="true">↓</span></span>}</button>
          {["printing", "delivering", "ready", "done"].includes(state) && <>
            <svg className="tp-output-mouth" viewBox="0 0 1536 1024" aria-hidden="true">
              {/* Same camera plane as the printer tray: rightward + downward
                  feed direction. The sheet keeps its shape behind a slot mask. */}
              <g className="tp-output-plane" transform="matrix(1 -.17 1.45 1 640 715)">
                <defs><clipPath id={paperClip}><rect width="500" height="148"/></clipPath></defs>
                <g clipPath={`url(#${paperClip})`}>
                  <g className="tp-output-slip">
                    <path className="tp-sheet-shadow" d="M0 5 H500 V138 Q250 149 0 138 Z"/>
                    <path className="tp-sheet-face" d="M0 0 H500 V130 Q250 141 0 130 Z"/>
                    <path className="tp-sheet-ink" d="M35 26 H375 M35 46 H460 M35 66 H450 M35 86 H345"/>
                    <text x="35" y="119">29 字段 · 原文依据</text>
                  </g>
                </g>
              </g>
            </svg>
            <button ref={takeRef} className="tp-take-report" type="button" disabled={state !== "ready"} aria-label="查看打印好的结果" onClick={readReport}>{state === "ready" && <span>点纸张，看字段 <ArrowRight size={13} aria-hidden="true"/></span>}</button>
          </>}
          {state === "done" && <span className="tp-finish-tag"><Check size={15} aria-hidden="true"/>29 字段，已整理</span>}
        </div>
        <div className="tp-person-place" data-pose={personPose} aria-hidden="true">
          <Image className="tp-person tp-person-idle" data-active={personPose === "idle"} src={publicPath("/world/yifan-scene-idle.webp")} alt="" width={400} height={400} sizes="150px" priority/>
          <Image className="tp-person tp-person-standing" data-active={personPose === "guide"} src={publicPath("/world/tender-yifan-guide-v1.webp")} alt="" width={1254} height={1254} sizes="220px" priority/>
          <Image className="tp-person tp-person-standing" data-active={personPose === "receive"} src={publicPath("/world/tender-yifan-receive-v1.webp")} alt="" width={1254} height={1254} sizes="220px" priority/>
          {personPose === "guide" && <span className="tp-reaction">{state === "printing" ? "我看看整理得怎么样。" : state === "ready" || state === "delivering" ? "好了，看看这张纸。" : "这里，放进来。"}</span>}
          {personPose === "receive" && <span className="tp-reaction">有依据的，才留下。</span>}
        </div>
        <div className="tp-cat-place" data-pose={catPose} aria-hidden="true">
          <Image className="tp-cat" data-active={catPose === "idle"} src={publicPath("/world/cat-scene-idle.webp")} alt="" width={400} height={400} sizes="100px" priority/>
          <Image className="tp-cat tp-cat-reaching" data-active={catPose === "reach"} src={publicPath("/world/tender-cat-reach-v1.webp")} alt="" width={1254} height={1254} sizes="130px" priority/>
          <Image className="tp-cat" data-active={catPose === "awake"} src={publicPath("/world/cat-scene-awake.webp")} alt="" width={400} height={400} sizes="100px" priority/>
          {catPose === "reach" && <span className="tp-cat-curious">?</span>}
        </div>
      </div>
      <div className="tp-result-place">
        {state !== "done" && <div className="tp-empty-result" aria-hidden="true"><FileSpreadsheet size={42}/><p>{state === "ready" ? "纸张在托盘上，点一下看看。" : "等一张清晰的结果"}</p><span>原文 → 固定字段</span></div>}
        {state === "done" && <article ref={outputRef} className="tp-result-paper" aria-label="清洗后的字段结果"><span className="tp-paper-clip" aria-hidden="true"/><small>字段清单 · 29 字段中的几个例子</small><h3>杂乱公告，整理好了。</h3>
          <div className="tp-featured-fields">{tenderPrinterFeatured.map((field, index) => <ResultField key={field} buttonRef={index === 0 ? firstFieldRef : undefined} row={tenderPrinterRows.find(row => row.field === field)!} selected={activeField === field} onSelect={() => selectField(field)}/>)}</div>
          {selectedRow && <div className="tp-field-evidence" role="status"><b>{selectedRow.field} · {selectedRow.value ? "找到原文" : "为什么留空"}</b>{selectedRow.sourceIndex !== null && <blockquote>{tenderPrinterSample.source[selectedRow.sourceIndex]}</blockquote>}<p>{selectedRow.note}</p></div>}
          <details className="tp-all-fields"><summary>看看完整 29 字段 <span aria-hidden="true">＋</span></summary><div>{tenderPrinterRows.map(row => <ResultField key={row.field} row={row} selected={activeField === row.field} onSelect={() => selectField(row.field)}/>)}</div></details>
          <div className="tp-delivery"><FileSpreadsheet size={18} aria-hidden="true"/>CSV <span>＋</span><Braces size={18} aria-hidden="true"/>JSON<small>同一份字段，可继续筛选或入库</small></div>
        </article>}
      </div>
    </div>
    <div className="tp-caption"><span>固定演示样本 · 不上传文件或调用真实清洗服务</span>{state !== "idle" && <button type="button" onClick={reset}><RotateCcw size={16} aria-hidden="true"/>再整理一次</button>}</div>
  </div>;
}

export function TenderPrinterDetail({ project }: { project: Project }) {
  return <main className="project-page tender-printer-page">
    <header className="tp-intro"><Link className="tp-back" href="/work"><ArrowLeft size={18} aria-hidden="true"/>回到工作室</Link><div><div><p className="tp-eyebrow">WORKSHOP / NOTICE PRINTER</p><h1>招投标公告<br/>29 字段清洗</h1><p className="tp-lead">把杂乱公告，整理成有原文依据的字段。</p></div><aside className="tp-mission"><Printer size={28} aria-hidden="true"/><p>放入一张公告，<br/>试试这台整理打印机。</p><span>正文优先 · 缺失留空 · 固定字段</span></aside></div></header>
    <section className="tp-play" aria-label="用打印机体验公告清洗"><PrinterDesk/></section>
    <section className="tp-more" aria-label="项目资料">
      <ProjectDisclosure title="观看项目演示" caption="原有视频，看看完整公告如何整理"><DemoSlot title={project.title} demo={project.demo}/></ProjectDisclosure>
      <ProjectDisclosure title="展开完整方法与证据" caption="输入路径、29 字段口径与清洗边界"><dl className="project-mast-facts"><div><dt>任务入口</dt><dd>{project.mastFacts.input}</dd></div><div><dt>关键判断</dt><dd>{project.mastFacts.judgment}</dd></div><div><dt>交付结果</dt><dd>{project.mastFacts.output}</dd></div></dl>{project.caseStudy && <ProjectCaseStudyView caseStudy={project.caseStudy}/>}</ProjectDisclosure>
    </section>
    <footer className="tp-final"><p>只整理有依据的事实。没有写的，就留空。</p><a href={project.github} target="_blank" rel="noreferrer">查看 GitHub <ArrowRight size={17} aria-hidden="true"/></a><Link href="/work">回到工作室</Link></footer>
  </main>;
}
