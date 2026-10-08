"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Eraser, LockKeyhole, RotateCcw, X } from "lucide-react";
import type { Project } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import { literaryFragments, fragmentOriginal, fragmentEdited } from "@/lib/humanizer-editor-demo";
import { DemoSlot } from "./demo-slot";
import { ProjectDisclosure } from "./project-tour";
import { ProjectCaseStudyView } from "./project-case-study";
import "./humanizer-editor-detail.css";

type Phase = "original" | "erasing" | "edited";

export function HumanizerEditorDetail({ project }: { project: Project }) {
  const [sample, setSample] = useState(0);
  const [phase, setPhase] = useState<Phase>("original");
  const [message, setMessage] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [petted, setPetted] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false, over: false });
  const dragging = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const extra = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const cutout = `manuscript-${useId().replace(/:/g, "")}`;
  const fragment = literaryFragments[sample];
  const edited = phase === "edited";
  const working = phase === "erasing";

  useEffect(() => {
    if (phase !== "erasing") return;
    const timer = setTimeout(() => setPhase("edited"), 480);
    return () => clearTimeout(timer);
  }, [phase]);
  useEffect(() => {
    if (compareOpen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [compareOpen]);

  const reset = (index = sample) => {
    setSample(index); setPhase("original"); setMessage(""); setBlocked(false);
    setCompareOpen(false); setPetted(false);
    dragging.current = null; suppressClick.current = false;
    setDrag({ x: 0, y: 0, active: false, over: false });
  };
  const erase = () => {
    if (phase !== "original") return;
    setBlocked(false); setMessage(""); setPhase("erasing");
  };
  const isOverExtra = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = extra.current?.getBoundingClientRect();
    return !!rect && event.clientX >= rect.left - 12 && event.clientX <= rect.right + 12 && event.clientY >= rect.top - 12 && event.clientY <= rect.bottom + 12;
  };
  const endDrag = (event: PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const start = dragging.current;
    if (!start) return;
    if (!cancelled && start.moved) {
      suppressClick.current = true;
      if (isOverExtra(event)) erase();
      else setMessage("把橡皮拖到标出的句子上。也可以直接点它。");
    }
    dragging.current = null;
    setDrag({ x: 0, y: 0, active: false, over: false });
  };

  const actor = edited ? "/world/tender-yifan-guide-v1.webp" : blocked ? "/world/tender-yifan-receive-v1.webp" : "/world/docs-yifan-reader-v1.png";
  const cat = petted ? "/world/cat-stretch.webp" : blocked ? "/world/tender-cat-reach-v1.webp" : edited ? "/world/cat-awake.webp" : "/world/cat-idle.webp";

  return <main className="humanizer-editor-page">
    <header className="he-intro"><Link className="back-link" href="/work"><ArrowLeft size={16} aria-hidden="true"/>回到工作室</Link><h1>文学去 AI 味</h1><p>少一点套话，留住你的声音。</p></header>
    <section className="he-workbench writing-simulator" aria-labelledby="he-heading" data-phase={phase} data-blocked={blocked}>
      <div className="he-toolbar"><h2 id="he-heading">动手改一小段</h2><button type="button" onClick={() => reset()} aria-label="还原手稿"><RotateCcw size={15} aria-hidden="true"/>还原</button></div>
      <div className="he-samples" role="group" aria-label="选择文学片段">{literaryFragments.map((item, index) => <button key={item.id} type="button" aria-pressed={index === sample} onClick={() => reset(index)}>{item.label}</button>)}</div>
      <div className="he-stage">
        <svg className="he-setting" viewBox="0 0 1000 440" preserveAspectRatio="none" aria-hidden="true">
          <defs><filter id={cutout} colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 1 1"/></feComponentTransfer></filter></defs>
          <path className="he-ground" d="M20 410C110 380 210 410 315 400S520 379 700 400S891 382 978 414Q983 436 765 433H186Q0 436 20 410Z"/>
          <path className="he-ground-line" d="M64 419Q185 410 280 419M760 421Q842 411 925 419"/>
          <g className="he-sprig"><path d="M935 355Q913 334 919 286M918 320L945 301M919 306L900 290"/><path className="he-leaf" d="M919 306Q896 303 893 278Q916 277 919 306ZM928 315Q935 292 956 294Q951 314 928 315ZM919 288Q909 265 923 255Q937 272 919 288Z"/></g>
          <path className="he-breeze" d="M50 72Q76 61 95 68T140 66M868 72Q895 54 932 64"/>
        </svg>
        <div className="he-person" data-pose={edited ? "guide" : blocked ? "protect" : "read"} aria-hidden="true"><Image key={actor} src={publicPath(actor)} alt="" width={512} height={768} unoptimized sizes="(max-width: 700px) 155px, 250px" style={{ filter: `url(#${cutout})` }}/><span>{blocked ? "这句得留下。" : edited ? "还是原来的故事。" : "先读，再改。"}</span></div>
        <article className="he-manuscript" aria-label="可编辑的演示手稿">
          <span className="he-paper-clip" aria-hidden="true"/>
          <header><span>原创演示 · 单篇</span><span>{String(sample + 1).padStart(2, "0")} / 03</span></header>
          <h3>{fragment.title}</h3>
          <p className="he-profile">{fragment.profile}</p>
          <div className="he-manuscript-text">
            <p>{fragment.lead}</p>
            <button type="button" className="he-protected" aria-label="试改受保护的句子" onClick={() => {setBlocked(true); setMessage(fragment.lockReason);}}><LockKeyhole size={14} aria-hidden="true"/>{fragment.protectedText}</button>
            <div className="he-extra-space"><button ref={extra} type="button" className="he-extra" disabled={phase !== "original"} aria-label="删去多余解释" data-over={drag.over} onClick={erase}>{fragment.extra}<span className="he-pencil-line" aria-hidden="true"/></button>{edited && <span className="he-kept" aria-hidden="true">留一点空白。</span>}</div>
          </div>
          <footer><span><LockKeyhole size={13} aria-hidden="true"/>意象 / 对白 / 结尾不改</span>{edited ? <span className="he-stamp"><Check size={15} aria-hidden="true"/>原意保留</span> : <span>点橡皮，或拖到标记处</span>}</footer>
        </article>
        <button type="button" className="he-eraser" disabled={phase !== "original"} aria-label="橡皮：擦去多余解释" aria-describedby="he-status" style={{ translate: `${drag.x}px ${drag.y}px` }} data-dragging={drag.active} onPointerDown={event => {
          if (event.button !== 0 || phase !== "original") return;
          suppressClick.current = false;
          dragging.current = { x: event.clientX, y: event.clientY, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }} onPointerMove={event => {
          const start = dragging.current; if (!start) return;
          const x = event.clientX - start.x, y = event.clientY - start.y;
          if (Math.hypot(x, y) > 6) start.moved = true;
          if (start.moved) setDrag({ x, y, active: true, over: isOverExtra(event) });
        }} onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)} onLostPointerCapture={() => { dragging.current = null; setDrag({ x: 0, y: 0, active: false, over: false }); }} onClick={() => {if (suppressClick.current) {suppressClick.current = false; return;} erase();}}>
          <span className="he-eraser-body" aria-hidden="true"><i/><Eraser size={25}/></span><span>{working ? "轻轻擦掉…" : edited ? "改好了" : "擦去多余解释"}</span>
        </button>
        <button type="button" className="he-cat" aria-label="摸摸小牛" aria-pressed={petted} onClick={() => setPetted(!petted)}><Image key={cat} src={publicPath(cat)} alt="" width={197} height={197} sizes="(max-width: 700px) 85px, 140px" unoptimized style={{ filter: `url(#${cutout})` }}/>{petted && <span>呼噜～</span>}</button>
      </div>
      <div className="he-response"><p id="he-status" role="status">{message || (working ? "只擦这一句，其他都留下。" : edited ? "多余解释少了，作者的留白还在。" : "试着擦掉标出的解释，或点一下带锁的句子。")}</p><button type="button" className="he-compare-button" disabled={!edited} aria-haspopup="dialog" onClick={() => setCompareOpen(true)}><span>{edited ? "看看改了哪里" : "改完后，看看对照"}</span><ArrowRight size={17} aria-hidden="true"/></button></div>
      <p className="he-boundary">固定文学示例，不运行在线改稿。只演示局部编辑，不判断文字是否由 AI 创作。</p>
      <dialog ref={dialog} className="he-compare-dialog" aria-labelledby="he-compare-heading" onClose={() => setCompareOpen(false)}>
        <header><h2 id="he-compare-heading">只改这一处</h2><button type="button" onClick={() => setCompareOpen(false)} aria-label="收起对照"><X size={21}/></button></header>
        <div className="he-compare-pages"><article><h3>原稿 · 始终保留</h3><p>{fragmentOriginal(fragment)}</p></article><article><h3>修改稿 · 另存</h3><p>{fragmentEdited(fragment)}</p><span><Check size={14} aria-hidden="true"/>受保护的句子未变</span></article></div>
        <p className="he-compare-reason">{fragment.reason}</p><small>这是固定示例的对照，不代表真实稿件已通过完整性审计或四角复核。</small>
      </dialog>
    </section>
    <div className="he-capabilities" aria-label="基本能力"><span>认文风</span><ArrowRight size={14} aria-hidden="true"/><span>少量改</span><ArrowRight size={14} aria-hidden="true"/><span>查完整</span></div>
    <div className="he-more"><ProjectDisclosure title="这个 Skill 怎么用" caption="简要说明"><div className="he-method"><p>适用于小说、散文与文学化非虚构。先确认文风与保护项，再改有依据的片段。</p><p>单篇建立临时画像；长期复用需要至少三篇作者确认的相近代表作。完整性审计与四角复核通过后，另存改稿与审计报告，保留原稿。</p></div></ProjectDisclosure><ProjectDisclosure title="观看项目演示" caption="视频"><DemoSlot title={project.title} demo={project.demo}/></ProjectDisclosure><ProjectDisclosure title="展开完整方法与证据" caption="按需展开"><dl className="project-mast-facts"><div><dt>任务入口</dt><dd>{project.mastFacts.input}</dd></div><div><dt>关键判断</dt><dd>{project.mastFacts.judgment}</dd></div><div><dt>交付结果</dt><dd>{project.mastFacts.output}</dd></div></dl>{project.caseStudy && <ProjectCaseStudyView caseStudy={project.caseStudy}/>}</ProjectDisclosure></div>
    <nav className="project-actions he-exits" aria-label="去 AI 味项目链接"><a href={project.github} target="_blank" rel="noreferrer">查看 GitHub ↗</a><Link href="/work">回到工作室</Link></nav>
  </main>;
}
