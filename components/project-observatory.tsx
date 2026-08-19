"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/site-data";

const CHAPTERS = [
  { key: "problem", index: "01", title: "问题", signal: "从噪声中识别真正需要解决的问题" },
  { key: "judgment", index: "02", title: "我的判断", signal: "把原始输入收敛为可执行的关键判断" },
  { key: "system", index: "03", title: "系统结构", signal: "让处理步骤、工具与结果形成可见路径" },
  { key: "reliability", index: "04", title: "可靠性设计", signal: "用明确门禁控制事实边界与交付质量" },
  { key: "outputs", index: "05", title: "可交付产物", signal: "把能力落成团队可以直接使用的产物" },
  { key: "reuse", index: "06", title: "复用与沉淀", signal: "从一次项目扩散为可复用的能力资产" },
] as const;

type ChapterKey = (typeof CHAPTERS)[number]["key"];

function ProblemVisual({ project }: { project: Project }) {
  return (
    <div className="scene scene--problem" aria-label={`问题信号被归拢为：${project.problem}`}>
      <div className="signal-cloud" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
      </div>
      <div className="signal-funnel" aria-hidden="true"><span /><span /><span /></div>
      <div className="scene-core">
        <small>CORE PROBLEM</small>
        <p>{project.problem}</p>
      </div>
    </div>
  );
}

function JudgmentVisual({ project }: { project: Project }) {
  return (
    <div className="scene scene--judgment" aria-label={`关键判断：${project.judgment}`}>
      <div className="judgment-input"><small>RAW INPUT</small><p>{project.problem}</p></div>
      <div className="judgment-lens" aria-hidden="true"><i /><span>判断</span></div>
      <div className="judgment-output"><small>DECISION</small><p>{project.judgment}</p></div>
    </div>
  );
}

function SystemVisual({ project }: { project: Project }) {
  return (
    <div className="scene scene--system" aria-label={`系统包含 ${project.system.length} 个步骤`}>
      <div className="system-path" aria-hidden="true"><i /></div>
      <div className="system-nodes">
        {project.system.map((step, index) => (
          <div key={step} className="system-node" style={{ "--node-index": index } as CSSProperties}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReliabilityVisual({ project }: { project: Project }) {
  return (
    <div className="scene scene--reliability" aria-label="可靠性门禁矩阵">
      <div className="gate-matrix">
        {project.reliability.map((item, index) => (
          <div key={item} style={{ "--gate-index": index } as CSSProperties}>
            <span aria-hidden="true">✓</span><p>{item}</p><small>CONTROL {String(index + 1).padStart(2, "0")}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutputsVisual({ project }: { project: Project }) {
  return (
    <div className="scene scene--outputs" aria-label="可交付产物堆栈">
      <div className="output-stack">
        {project.outputs.map((item, index) => (
          <div key={item} style={{ "--output-index": index } as CSSProperties}>
            <span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><small>DELIVERABLE</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReuseVisual({ project }: { project: Project }) {
  return (
    <div className="scene scene--reuse" aria-label={`复用说明：${project.reuse}`}>
      <div className="reuse-core"><span>PROJECT</span><strong>{project.shortTitle}</strong></div>
      <div className="reuse-branches">
        {project.tags.slice(0, 4).map((tag, index) => (
          <div key={tag} style={{ "--branch-index": index } as CSSProperties}><i aria-hidden="true" /><span>{tag}</span></div>
        ))}
      </div>
      <p>{project.reuse}</p>
    </div>
  );
}

function SceneVisual({ chapter, project }: { chapter: ChapterKey; project: Project }) {
  if (chapter === "problem") return <ProblemVisual project={project} />;
  if (chapter === "judgment") return <JudgmentVisual project={project} />;
  if (chapter === "system") return <SystemVisual project={project} />;
  if (chapter === "reliability") return <ReliabilityVisual project={project} />;
  if (chapter === "outputs") return <OutputsVisual project={project} />;
  return <ReuseVisual project={project} />;
}

function ChapterContent({ chapter, project }: { chapter: ChapterKey; project: Project }) {
  if (chapter === "problem") return <p>{project.problem}</p>;
  if (chapter === "judgment") return <p>{project.judgment}</p>;
  if (chapter === "system") return <ol>{project.system.map(item => <li key={item}>{item}</li>)}</ol>;
  if (chapter === "reliability") return <ul>{project.reliability.map(item => <li key={item}>{item}</li>)}</ul>;
  if (chapter === "outputs") return <ul>{project.outputs.map(item => <li key={item}>{item}</li>)}</ul>;
  return <p>{project.reuse}</p>;
}

export function ProjectObservatory({ project }: { project: Project }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const activeChapter = CHAPTERS[activeIndex];

  useEffect(() => {
    const sections = chapterRefs.current.filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const nextIndex = Number((visible.target as HTMLElement).dataset.chapterIndex ?? 0);
        setActiveIndex(nextIndex);
      },
      { rootMargin: "-24% 0px -48%", threshold: [0.2, 0.45, 0.7] },
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const progress = useMemo(() => `${((activeIndex + 1) / CHAPTERS.length) * 100}%`, [activeIndex]);

  return (
    <section className="project-observatory" aria-label={`${project.title} 能力观测台`}>
      <aside className="observatory-panel">
        <div className="observatory-head">
          <div><span>CAPABILITY OBSERVATORY</span><small>当前观测 / {activeChapter.index}</small></div>
          <b>{activeChapter.title}</b>
        </div>
        <div className="observatory-stage" aria-live="polite">
          <SceneVisual key={activeChapter.key} chapter={activeChapter.key} project={project} />
        </div>
        <div className="observatory-signal">
          <span>OBSERVATION SIGNAL</span>
          <p>{activeChapter.signal}</p>
        </div>
        <nav aria-label="项目章节">
          {CHAPTERS.map((chapter, index) => (
            <a
              key={chapter.key}
              href={`#chapter-${chapter.key}`}
              aria-current={activeIndex === index ? "step" : undefined}
            >
              <span>{chapter.index}</span><b>{chapter.title}</b>
            </a>
          ))}
        </nav>
        <div className="observatory-progress" aria-hidden="true"><i style={{ width: progress }} /></div>
      </aside>

      <div className="project-narrative">
        {CHAPTERS.map((chapter, index) => (
          <article
            key={chapter.key}
            id={`chapter-${chapter.key}`}
            ref={node => { chapterRefs.current[index] = node; }}
            data-chapter-index={index}
            data-active={activeIndex === index}
            aria-labelledby={`chapter-title-${chapter.key}`}
          >
            <header><span>{chapter.index}</span><small>{chapter.signal}</small></header>
            <h2 id={`chapter-title-${chapter.key}`}>{chapter.title}</h2>
            <ChapterContent chapter={chapter.key} project={project} />
            <div className="observatory-mobile-scene"><SceneVisual chapter={chapter.key} project={project} /></div>
          </article>
        ))}
      </div>
    </section>
  );
}
