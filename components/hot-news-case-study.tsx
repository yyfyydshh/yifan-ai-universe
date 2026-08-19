"use client";

import { Ban, CalendarRange, Check, CircleOff, FileSearch, Layers3, Link2, ListFilter, Radio, Search, Split } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import type { HotNewsCaseStudy } from "@/lib/site-data";
import { CaseStudyHeading, StageDepthPanel } from "./case-study-shared";

const dayLabels = ["D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "D0"];
type SourceId = "all" | "decision" | "content" | "international";
type GateId = "window" | "contract" | "dedupe" | "source";

type DemoCandidate = {
  id: string;
  day: string;
  sourceId: Exclude<SourceId, "all">;
  sourceLabel: string;
  fields: string;
  storyKey: string;
  failAt?: GateId;
  failReason?: string;
  mergedInto?: string;
  selected: boolean;
  fast: boolean;
};

const demoCandidates: DemoCandidate[] = [
  { id: "C-01", day: "D-1", sourceId: "decision", sourceLabel: "决策信源", fields: "标题 / URL / 日期齐全", storyKey: "STORY-A", selected: true, fast: true },
  { id: "C-02", day: "D-4", sourceId: "international", sourceLabel: "国际信源", fields: "标题 / URL / 日期齐全", storyKey: "STORY-B", selected: true, fast: true },
  { id: "C-03", day: "D0", sourceId: "content", sourceLabel: "内容平台", fields: "标题 / URL / 日期齐全", storyKey: "STORY-C", selected: true, fast: true },
  { id: "C-04", day: "D-8", sourceId: "decision", sourceLabel: "决策信源", fields: "标题 / URL / 日期齐全", storyKey: "STORY-D", failAt: "window", failReason: "样例发布日期为 D-8，落在 D-6 至 D0 之外。", selected: false, fast: true },
  { id: "C-05", day: "D-2", sourceId: "content", sourceLabel: "内容平台", fields: "缺少可打开 URL", storyKey: "STORY-E", failAt: "contract", failReason: "标题、HTTP(S) URL 与发布日期未同时满足。", selected: false, fast: false },
  { id: "C-06", day: "D-1", sourceId: "international", sourceLabel: "国际信源", fields: "标题 / URL / 日期齐全", storyKey: "STORY-B", failAt: "dedupe", failReason: "规范化后与 C-02 指向同一故事。", mergedInto: "C-02", selected: false, fast: false },
  { id: "C-07", day: "D-3", sourceId: "content", sourceLabel: "内容平台", fields: "标题 / URL / 日期齐全", storyKey: "STORY-F", failAt: "source", failReason: "同域候选已达到上限，保留证据更强的记录。", selected: false, fast: false },
  { id: "C-08", day: "D-5", sourceId: "decision", sourceLabel: "决策信源", fields: "标题 / URL / 日期齐全", storyKey: "STORY-G", selected: true, fast: false },
];

const gateOrder: Record<GateId, number> = { window: 1, contract: 2, dedupe: 3, source: 4 };

function getCandidateState(candidate: DemoCandidate, stageIndex: number) {
  const failedAt = candidate.failAt ? gateOrder[candidate.failAt] : Number.POSITIVE_INFINITY;
  if (stageIndex < failedAt) {
    if (stageIndex < 5) return { id: "checking", label: "待检查" };
    return candidate.selected ? { id: "selected", label: stageIndex === 6 ? "已绑定" : "入选" } : { id: "standby", label: "未入选" };
  }
  if (candidate.failAt === "dedupe") return { id: "merged", label: `并入 ${candidate.mergedInto}` };
  return { id: "excluded", label: "已排除" };
}

function getCandidateReason(candidate: DemoCandidate, stageIndex: number) {
  if (candidate.failAt && stageIndex >= gateOrder[candidate.failAt]) return candidate.failReason ?? "未通过当前门槛。";
  const reasons = [
    "匿名候选已进入规则样例；真实工作流会先确认主题安全边界。",
    `${candidate.day} 位于本次七日标尺内，继续检查证据字段。`,
    `${candidate.fields}，可进入链接规范化与故事去重。`,
    `${candidate.storyKey} 暂无更强重复项，保留一条代表记录。`,
    `${candidate.sourceLabel}参与来源分层，并受单域最多两条约束。`,
    candidate.selected ? "证据完整度、来源质量与相关性满足本次入选条件。" : "记录可核验，但未进入最多十条的最终集合。",
    candidate.selected ? "只把这条记录绑定到清单、判断或选题，不生成记录之外的事实。" : "未入选记录不进入输出，也不会被补写成摘要。",
  ];
  return reasons[stageIndex] ?? reasons[0];
}

export function HotNewsEvidenceRadar({ study }: { study: HotNewsCaseStudy }) {
  const [searchMode, setSearchMode] = useState<"fast" | "deep">("deep");
  const [activeStageIndex, setActiveStageIndex] = useState(2);
  const [outputMode, setOutputMode] = useState<"news" | "decision" | "radar" | "both">("news");
  const [sourceFilter, setSourceFilter] = useState<SourceId>("all");
  const [candidateId, setCandidateId] = useState("C-01");
  const activeStage = study.stages[activeStageIndex] ?? study.stages[0];
  const nextStage = study.stages[activeStageIndex + 1];
  const mode = study.searchModes.find(item => item.id === searchMode) ?? study.searchModes[0];
  const output = study.outputModes.find(item => item.id === outputMode) ?? study.outputModes[0];
  const modeCandidates = demoCandidates.filter(candidate => searchMode === "deep" || candidate.fast);
  const visibleCandidates = modeCandidates.filter(candidate => sourceFilter === "all" || candidate.sourceId === sourceFilter);
  const selectedCandidate = visibleCandidates.find(candidate => candidate.id === candidateId) ?? visibleCandidates[0] ?? modeCandidates[0];
  const selectedState = getCandidateState(selectedCandidate, activeStageIndex);

  const selectMode = (id: "fast" | "deep") => {
    setSearchMode(id);
    setSourceFilter("all");
    setCandidateId("C-01");
  };

  const selectSource = (id: SourceId) => {
    setSourceFilter(id);
    const first = modeCandidates.find(candidate => id === "all" || candidate.sourceId === id);
    if (first) setCandidateId(first.id);
  };

  const onStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (activeStageIndex + direction + study.stages.length) % study.stages.length;
    setActiveStageIndex(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-stage]")[next]?.focus();
  };

  return (
    <section id="case-study" className="case-study case-study--news" aria-labelledby="case-study-title">
      <CaseStudyHeading eyebrow="EVIDENCE RADAR / 七日证据雷达" title={study.title} intro={study.intro} evidenceStatus={study.evidenceStatus} summary={study.summary} />

      <div className="news-mode-switch" role="group" aria-label="检索模式">
        {study.searchModes.map(item => <button key={item.id} type="button" aria-pressed={searchMode === item.id} onClick={() => selectMode(item.id)}><span>{item.id === "fast" ? <Search aria-hidden="true" /> : <Split aria-hidden="true" />}</span><p><b>{item.label}</b><small>{item.note}</small></p><i>{item.queryCount} {item.queryCount === 1 ? "批" : "角度"}</i></button>)}
        <p><Radio aria-hidden="true" size={18} /><span>只读规则样例 · 匿名记录 · 非实时新闻流</span></p>
      </div>

      <div className="news-stage-rail" role="list" aria-label="证据筛选阶段" onKeyDown={onStageKeyDown}>
        {study.stages.map((stage, index) => <div key={stage.id} role="listitem" data-active={activeStageIndex === index} data-passed={index < activeStageIndex}><button data-stage type="button" aria-pressed={activeStageIndex === index} onClick={() => setActiveStageIndex(index)} onFocus={() => setActiveStageIndex(index)}><small>{String(index + 1).padStart(2, "0")}</small><b>{stage.title}</b></button>{index < study.stages.length - 1 ? <i aria-hidden="true" /> : null}</div>)}
      </div>

      <div className="case-workbench case-workbench--news">
        <div className="news-console">
          <header><div><span>MECHANISM DEMO / 机制演示</span><h3>{mode.label}如何把候选收敛为证据集合</h3></div><p>点击来源、日期、候选或阶段；每一步都说明记录为什么保留、合并或排除。</p></header>

          <section className="news-radar" data-mode={searchMode}>
            <div className="news-source-axis">
              <span>SOURCE FILTER / 来源过滤</span>
              <div role="group" aria-label="按来源查看候选">
                {([ ["all", "全部候选", "所有来源"], ["decision", "决策信源", "支持事实判断"], ["content", "内容平台", "支持选题线索"], ["international", "国际信源", "补充跨市场视角"] ] as const).map(([id, label, role]) => <button key={id} type="button" aria-pressed={sourceFilter === id} onClick={() => selectSource(id)}><i /><p><b>{label}</b><small>{role} · {modeCandidates.filter(candidate => id === "all" || candidate.sourceId === id).length} 条</small></p></button>)}
              </div>
            </div>

            <div className="news-window">
              <header><div><CalendarRange aria-hidden="true" size={19} /><span>STRICT WINDOW / 最近七日</span></div><small>规则样例 · {modeCandidates.length} 条匿名候选</small></header>
              <div className="news-day-scale" role="group" aria-label="按发布日期选择候选">{dayLabels.map(day => {
                const onDay = visibleCandidates.filter(candidate => candidate.day === day);
                return <button key={day} type="button" disabled={onDay.length === 0} aria-label={`${day}，${onDay.length} 条候选`} onClick={() => onDay[0] && setCandidateId(onDay[0].id)}><i data-has-record={onDay.length > 0} />{day}<small>{onDay.length || "—"}</small></button>;
              })}</div>
              <div className="news-candidate-grid" aria-live="polite">
                {visibleCandidates.map(candidate => {
                  const state = getCandidateState(candidate, activeStageIndex);
                  return <button key={candidate.id} type="button" aria-pressed={selectedCandidate.id === candidate.id} data-status={state.id} onClick={() => setCandidateId(candidate.id)}><span>{candidate.id}</span><b>{candidate.sourceLabel}</b><small>{candidate.day} · {candidate.fields}</small><i>{state.label}</i></button>;
                })}
              </div>
              <article className="news-candidate-inspector" data-status={selectedState.id}>
                <header><div><Link2 aria-hidden="true" size={18} /><span>CURRENT RECORD / 当前记录</span></div><b>{selectedCandidate.id} · {selectedState.label}</b></header>
                <dl><div><dt>时间</dt><dd>{selectedCandidate.day}</dd></div><div><dt>来源层</dt><dd>{selectedCandidate.sourceLabel}</dd></div><div><dt>故事键</dt><dd>{selectedCandidate.storyKey}</dd></div></dl>
                <p><strong>{activeStage.title}：</strong>{getCandidateReason(selectedCandidate, activeStageIndex)}</p>
              </article>
            </div>

            <div className="news-gates">
              {study.stages.slice(1, 6).map((stage, index) => <button key={stage.id} type="button" data-active={activeStage.id === stage.id} data-passed={activeStageIndex > index + 1} onClick={() => setActiveStageIndex(index + 1)}><small>{index + 1}</small><span>{stage.id === "window" ? <CalendarRange /> : stage.id === "contract" ? <FileSearch /> : stage.id === "dedupe" ? <Layers3 /> : stage.id === "source" ? <ListFilter /> : <Check />}</span><b>{stage.title}</b></button>)}
            </div>
          </section>

          <section className="news-exclusion-ledger"><header><CircleOff aria-hidden="true" size={19} /><span>EXCLUSION LEDGER / 真实规则中的排除原因</span></header><div>{study.exclusions.map(item => <article key={item.reason}><Ban aria-hidden="true" size={15} /><p><b>{item.reason}</b><small>{item.treatment}</small></p></article>)}</div></section>
          <section className="news-output-modes"><header><span>ONE EVIDENCE SET / 四种输出，共用同一来源底座</span><p aria-live="polite"><b>{output.label}</b>{output.detail}</p></header><div role="group" aria-label="输出模式">{study.outputModes.map(item => <button key={item.id} type="button" aria-pressed={outputMode === item.id} onClick={() => setOutputMode(item.id)}><b>{item.label}</b><small>{item.detail}</small></button>)}</div></section>
          <p className="news-empty-state"><CircleOff aria-hidden="true" size={18} /><span><b>没有合格记录时：</b>明确返回“近 7 天未发现合格新闻”，不为凑数生成摘要。</span></p>
        </div>

        <StageDepthPanel stage={activeStage} index={activeStageIndex} total={study.stages.length} nextStage={nextStage} onNext={() => setActiveStageIndex(index => Math.min(index + 1, study.stages.length - 1))}>
          <div className="case-live-state" data-state="ready"><span>CURRENT CONTRACT / 当前合同</span><b>{mode.label} · {output.label}</b></div>
        </StageDepthPanel>
      </div>
      <p className="case-boundary"><span>BOUNDARY / 边界</span>{study.boundary}</p>
    </section>
  );
}
