"use client";

import { AlertTriangle, Braces, Check, FileSpreadsheet, Files, KeyRound, TableProperties, Workflow } from "lucide-react";
import { useMemo, useState, type KeyboardEvent } from "react";
import type { TenderCaseStudy } from "@/lib/site-data";
import { CaseStudyHeading, StageDepthPanel } from "./case-study-shared";

const fieldFallback = {
  evidence: "从公告正文的显式标签、所在段落或可靠结构化列取证。",
  rule: "正文优先，结构化列只作补充，不能覆盖更明确的原文。",
  blank: "没有原文依据时保留空字符串，不从常识或相似公告补齐。",
};

export function TenderSchemaCaseStudy({ study }: { study: TenderCaseStudy }) {
  const [inputMode, setInputMode] = useState<"files" | "tasks">("files");
  const [activeStageIndex, setActiveStageIndex] = useState(2);
  const [activeField, setActiveField] = useState("招标金额");
  const activeStage = study.stages[activeStageIndex] ?? study.stages[0];
  const activeMode = study.inputModes.find(mode => mode.id === inputMode) ?? study.inputModes[0];
  const nextStage = study.stages[activeStageIndex + 1];
  const detail = useMemo(
    () => study.fieldDetails.find(field => field.label === activeField) ?? { label: activeField, ...fieldFallback },
    [activeField, study.fieldDetails],
  );

  const onStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (activeStageIndex + direction + study.stages.length) % study.stages.length;
    setActiveStageIndex(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-stage]")[next]?.focus();
  };

  return (
    <section id="case-study" className="case-study case-study--tender" aria-labelledby="case-study-title">
      <CaseStudyHeading eyebrow="SCHEMA REFINERY / 29 字段语义炼制台" title={study.title} intro={study.intro} evidenceStatus={study.evidenceStatus} summary={study.summary} />

      <div className="tender-input-switch" role="group" aria-label="输入路径">
        {study.inputModes.map(mode => (
          <button key={mode.id} type="button" aria-pressed={inputMode === mode.id} onClick={() => setInputMode(mode.id)}>
            {mode.id === "files" ? <Files aria-hidden="true" /> : <Workflow aria-hidden="true" />}
            <span><b>{mode.label}</b><small>{mode.note}</small></span>
          </button>
        ))}
        <div className="tender-input-detail" aria-live="polite">
          <span>ACTIVE INPUT / 当前入口</span>
          <b>{activeMode.label}</b>
          <ul>{activeMode.details.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>

      <div className="tender-stage-rail" role="list" aria-label="语义清洗阶段" onKeyDown={onStageKeyDown}>
        {study.stages.map((stage, index) => (
          <div key={stage.id} role="listitem" data-active={activeStageIndex === index} data-passed={index < activeStageIndex}>
            <button data-stage type="button" aria-pressed={activeStageIndex === index} onClick={() => setActiveStageIndex(index)} onFocus={() => setActiveStageIndex(index)}>
              <small>{String(index + 1).padStart(2, "0")}</small><b>{stage.title}</b>
            </button>
            {index < study.stages.length - 1 ? <i aria-hidden="true" /> : null}
          </div>
        ))}
      </div>

      <div className="case-workbench case-workbench--tender">
        <div className="tender-console">
          <header className="tender-console-head">
            <div><span>FIELD CONTRACT / 固定字段合同</span><h3>点击字段，查看它凭什么填写、何时必须留空</h3></div>
            <p>机制演示，不读取真实公告。</p>
          </header>

          <div className="tender-schema-grid">
            {study.fieldGroups.map(group => (
              <section key={group.id} data-group={group.id}>
                <header><span>{group.range}</span><b>{group.label}</b></header>
                <div>{group.fields.map(field => <button type="button" key={field} data-active={activeField === field} aria-pressed={activeField === field} onClick={() => setActiveField(field)}>{field}</button>)}</div>
              </section>
            ))}
          </div>

          <section className="tender-field-drawer" key={activeField} aria-live="polite">
            <header><TableProperties aria-hidden="true" size={23} strokeWidth={1.45} /><span>SELECTED FIELD / 当前字段</span><h3>{detail.label}</h3></header>
            <div>
              <article><span>01 / 原文依据</span><p>{detail.evidence}</p></article>
              <article><span>02 / 提取规则</span><p>{detail.rule}</p></article>
              <article><span>03 / 留空条件</span><p>{detail.blank}</p></article>
            </div>
          </section>

          <section className="tender-exception-lane">
            <div><AlertTriangle aria-hidden="true" size={20} /><span>EXCEPTION LANE / 单条异常隔离</span></div>
            <p><b>一条记录缺字段或解析失败</b><small>保留索引与原因，进入异常清单</small></p>
            <i aria-hidden="true" />
            <p data-continue><Check aria-hidden="true" size={17} /><span><b>其余记录继续</b><small>批次不因单条失败中断</small></span></p>
          </section>

          <section className="tender-delivery-gate">
            <header><span>DELIVERY GATE / 一致性验收</span><h3>同一批次，两个格式，一份字段合同</h3></header>
            <div className="tender-checks">{study.checks.map(check => <article key={check.label}><Check aria-hidden="true" size={17} /><p><b>{check.label}</b><small>{check.detail}</small></p></article>)}</div>
            <div className="tender-deliverables">{study.deliverables.map((item, index) => <article key={item.label}>{index === 0 ? <FileSpreadsheet aria-hidden="true" /> : index === 1 ? <Braces aria-hidden="true" /> : <TableProperties aria-hidden="true" />}<p><b>{item.label}</b><small>{item.detail}</small></p></article>)}</div>
            <p className="tender-secret"><KeyRound aria-hidden="true" size={18} /><span>API Key 只在采集路径运行时使用，不写入脚本、输出或页面。</span></p>
          </section>
        </div>

        <StageDepthPanel stage={activeStage} index={activeStageIndex} total={study.stages.length} nextStage={nextStage} onNext={() => setActiveStageIndex(index => Math.min(index + 1, study.stages.length - 1))}>
          <div className="case-live-state" data-state="ready"><span>CURRENT FOCUS / 当前观察</span><b>{activeField} · {activeMode.label}</b></div>
        </StageDepthPanel>
      </div>
      <p className="case-boundary"><span>BOUNDARY / 边界</span>{study.boundary}</p>
    </section>
  );
}
