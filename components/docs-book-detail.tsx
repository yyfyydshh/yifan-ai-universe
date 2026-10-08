"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Compass, GraduationCap, Plug } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { Project } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import { DemoSlot } from "./demo-slot";
import { ProjectDisclosure } from "./project-tour";
import { ProjectCaseStudyView } from "./project-case-study";
import { useBookPageDrag } from "./use-book-page-drag";
import { paperFold } from "@/lib/docs-paper-fold";
import "./docs-book-detail.css";

const chapters = [
  { id: "overview", label: "认识产品", icon: Compass, title: "先知道它能做什么", copy: "了解八爪鱼采集器的产品能力、工作原理与使用方式。", items: ["产品概览", "本地与云端采集", "使用须知与计费"] },
  { id: "learn", label: "动手采集", icon: GraduationCap, title: "跟着教程，动手试试", copy: "从基础采集到进阶功能，沿着教程和案例学习。", items: ["采集学院", "操作步骤", "实战案例"] },
  { id: "connect", label: "连接应用", icon: Plug, title: "让数据走进你的应用", copy: "查阅开放能力，把采集器接入业务系统或 AI 工作流。", items: ["OpenAPI", "MCP", "CLI"] },
] as const;

export const docsSiteUrl = "https://www.bazhuayu.com/docs/zh/overview";

const leftPages = [
  { title: "先找到合适的入口", copy: "了解产品，再开始第一次采集。", footer: "认识产品 · 找到方向", steps: ["了解产品", "选择方式", "开始采集"] },
  { title: "照着步骤，走完一次采集", copy: "把操作方法写成可以跟着做的教程。", footer: "采集教程 · 动手学习", steps: ["选择字段", "运行任务", "导出数据"] },
  { title: "把采集接入你的工作流", copy: "用文档找到接口与接入方式。", footer: "开放集成 · 连接应用", steps: ["查阅接口", "连接应用", "使用数据"] },
] as const;

function BookLeftPage({ index }: { index: number }) {
  const page = leftPages[index], Icon = chapters[index].icon;
  return <div className="db-title-page">
    <div className="db-left-illustration"><Image src={publicPath("/world/tour-notebook.webp")} alt="" width={800} height={800} sizes="(max-width:700px) 88px, 140px" unoptimized/><span><Icon size={24} aria-hidden="true"/></span></div>
    <span>八爪鱼 · {chapters[index].label}</span><h2>{page.title}</h2>
    <p>{page.copy}</p><div className="db-left-route" aria-label={`${chapters[index].label}阅读方向`}>{page.steps.map((step, i) => <span key={step}><i>{i + 1}</i>{step}</span>)}</div><small>{page.footer}</small>
  </div>;
}

function ChapterContent({ index }: { index: number }) {
  const chapter = chapters[index], Icon = chapter.icon;
  return <div className="db-page-content"><Icon className="db-chapter-icon" size={48} strokeWidth={1.5} aria-hidden="true"/><p className="db-chapter-label">{chapter.label}</p><h2>{chapter.title}</h2><p>{chapter.copy}</p><ul>{chapter.items.map(item => <li key={item}><span aria-hidden="true"/> {item}</li>)}</ul></div>;
}

export function DocsBookDetail({ project }: { project: Project }) {
  const { index, turn, size, pageRef, selectPage, cornerHandlers } = useBookPageDrag(chapters.length);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const shadeId = useId();
  const cutoutId = useId();
  const [greeting, setGreeting] = useState(0);
  const visibleIndex = turn ? turn.direction === "forward" ? turn.to : turn.from : index;
  const leftIndex = turn ? turn.direction === "forward" ? turn.from : turn.to : index;
  const frontIndex = turn?.direction === "forward" ? turn.from : turn?.to ?? index;
  const backIndex = turn?.direction === "forward" ? turn.to : turn?.from ?? index;
  const fold = turn ? paperFold(size.width, size.height, turn.direction === "forward" ? turn.travel : 1 - turn.travel, turn.bend) : null;
  const chapter = chapters[visibleIndex];
  function keySelect(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % chapters.length;
    else if (event.key === "ArrowLeft") next = (current + chapters.length - 1) % chapters.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = chapters.length - 1;
    else return;
    event.preventDefault(); selectPage(next); tabs.current[next]?.focus({ preventScroll: true });
  }
  return <main className="db-page">
    <svg width="0" height="0" className="db-asset-filters" aria-hidden="true"><defs><filter id={cutoutId} colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncA type="table" tableValues="0 0 0 1 1"/></feComponentTransfer></filter></defs></svg>
    <header className="db-intro">
      <Link href="/work" className="db-back"><ArrowLeft size={17} aria-hidden="true"/>回到工作室</Link>
      <p className="db-eyebrow">书架上的一个项目</p>
      <h1>八爪鱼产品文档站</h1>
      <p className="db-lead">把产品说明、采集教程与开放能力，整理成一本好查、好读的在线手册。</p>
      <p className="db-description">从内容迁移、栏目整理到页面与链接核对，让零散资料成为可以连续阅读的中文文档。</p>
    </header>

    <section className="db-reading" aria-label="翻阅文档站介绍">
      <p className="db-hint"><BookOpen size={19} aria-hidden="true"/>拖动或点击右页往后翻，左页往前翻</p>
      <div className="db-nook" data-turning={!!turn}>
        <button className="db-person" type="button" aria-label="和读书的杨逸凡打个招呼" onClick={() => setGreeting(value => value + 1)}>
          <span className="db-reader-feet" aria-hidden="true"><Image src={publicPath("/world/docs-yifan-reader-v1.png")} alt="" width={1024} height={1536} sizes="(max-width:700px) 135px, 230px" style={{filter:`url(#${cutoutId})`}} unoptimized/></span>
          <span className="db-reader-body" aria-hidden="true"><Image src={publicPath("/world/docs-yifan-reader-v1.png")} alt="" width={1024} height={1536} sizes="(max-width:700px) 135px, 230px" style={{filter:`url(#${cutoutId})`}} unoptimized/></span>
          <span className="db-reader-head" aria-hidden="true"><span key={greeting} className={greeting ? "db-reader-greeting" : undefined}><Image src={publicPath("/world/docs-yifan-reader-v1.png")} alt="" width={1024} height={1536} sizes="(max-width:700px) 135px, 230px" style={{filter:`url(#${cutoutId})`}} unoptimized/></span></span>
        </button>
        <div className="db-book">
          <div className="db-bookmarks" role="tablist" aria-label="手册章节">{chapters.map((item, i) => <button key={item.id} ref={node => { tabs.current[i] = node; }} id={`db-tab-${item.id}`} role="tab" aria-selected={index === i} aria-controls="db-chapter" tabIndex={index === i ? 0 : -1} type="button" onClick={() => selectPage(i)} onKeyDown={event => keySelect(event, i)}>{item.label}</button>)}</div>
          <div className="db-pages">
            <div className="db-left-sheet" data-enabled={index > 0} {...cornerHandlers("backward")}><BookLeftPage index={leftIndex}/></div>
            <div ref={pageRef} className="db-chapter-wrap" data-direction={turn?.direction}>
              <article id="db-chapter" role="tabpanel" aria-labelledby={`db-tab-${chapter.id}`} aria-describedby="db-drag-help" aria-busy={!!turn} data-enabled={index < 2} tabIndex={0} className="db-chapter" {...cornerHandlers("forward")} onKeyDown={event => { if(event.key === "Enter" || event.key === " ") { event.preventDefault(); selectPage(index + 1); } }}>
                <ChapterContent index={visibleIndex}/>
                <span className="sr-only" aria-live="polite">当前章节：{chapters[index].label}</span>
              </article>
              {turn && fold && <div className="db-flip-leaf" data-direction={turn.direction} data-mode={turn.mode} data-progress={turn.travel.toFixed(3)} aria-hidden="true">
                <div className="db-paper-front" style={{ clipPath: fold.front }}><div className="db-chapter"><ChapterContent index={frontIndex}/></div></div>
                <div className="db-paper-back" style={{ clipPath: fold.back, transform: fold.matrix }}><div className="db-paper-back-content"><BookLeftPage index={backIndex}/></div></div>
                <svg className="db-paper-crease" viewBox={`${-size.width} 0 ${size.width * 2} ${size.height}`} preserveAspectRatio="none"><defs><linearGradient id={shadeId}><stop offset="0" stopColor="var(--db-crease-shadow)"/><stop offset=".45" stopColor="var(--db-crease-light)"/><stop offset="1" stopColor="var(--db-page-shadow)"/></linearGradient></defs><path d={fold.curve} fill={`url(#${shadeId})`}/></svg>
              </div>}
            </div>
            <div className="db-page-turn"><button className="db-corner db-corner-prev" type="button" aria-label="上一页" aria-describedby="db-drag-help" disabled={index === 0} {...cornerHandlers("backward")}/><button className="db-corner db-corner-next" type="button" aria-label="下一页" aria-describedby="db-drag-help" disabled={index === 2} {...cornerHandlers("forward")}/></div>
          </div>
          <span id="db-drag-help" className="sr-only">点击右侧任意位置或往左拖动翻到下一页，点击左侧或往右拖动回到上一页；也可以用书签、页角或按 Enter。拖得少会回落，按 Escape 取消。</span>
        </div>
        <div className="db-cat" data-pose={index === 0 && !turn ? "idle" : "awake"} aria-hidden="true"><Image src={publicPath(index === 0 && !turn ? "/world/cat-scene-idle.webp" : "/world/cat-scene-awake.webp")} alt="" width={200} height={200} sizes="(max-width:700px) 90px, 130px" unoptimized/></div>
        <div className="db-shelf" aria-hidden="true"/>
      </div>
    </section>

    <nav className="db-exits project-actions" aria-label="文档站项目链接"><a href={docsSiteUrl} target="_blank" rel="noreferrer"><BookOpen size={21} aria-hidden="true"/>打开文档站<ArrowRight size={19} aria-hidden="true"/></a><a href={project.github} target="_blank" rel="noreferrer">查看 GitHub 仓库 ↗</a></nav>

    <div className="db-more">
      <ProjectDisclosure title="观看项目演示" caption="想了解搭建过程，再打开看看"><DemoSlot title={project.title} demo={project.demo}/></ProjectDisclosure>
      <ProjectDisclosure title="展开完整方法与证据" caption="迁移、验收与维护过程">
        <dl className="project-mast-facts"><div><dt>任务入口</dt><dd>{project.mastFacts.input}</dd></div><div><dt>关键判断</dt><dd>{project.mastFacts.judgment}</dd></div><div><dt>交付结果</dt><dd>{project.mastFacts.output}</dd></div></dl>
        {project.caseStudy && <ProjectCaseStudyView caseStudy={project.caseStudy}/>}
      </ProjectDisclosure>
    </div>
  </main>;
}
