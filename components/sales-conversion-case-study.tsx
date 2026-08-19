"use client";

import {
  Building2,
  Cable,
  ChartNoAxesColumnIncreasing,
  Clock3,
  Database,
  FileCheck2,
  FolderCheck,
  Link2,
  LockKeyhole,
  MessageSquareText,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundSearch,
  Workflow,
} from "lucide-react";
import { type KeyboardEvent, useMemo, useState } from "react";
import type { SalesCaseStudy } from "@/lib/site-data";

const dimensionIcons = {
  industry: Building2,
  data: Database,
  cadence: Clock3,
  automation: SlidersHorizontal,
  integration: Cable,
};

const outputIcons = {
  profile: UserRoundSearch,
  mql: ChartNoAxesColumnIncreasing,
  solution: Workflow,
  materials: FolderCheck,
  reply: MessageSquareText,
};

const statusLabels = {
  ready: "本轮可判断",
  partial: "初步判断",
  withheld: "暂缓判断",
  draft: "可编辑草稿",
};

export function SalesConversionCaseStudy({ study }: { study: SalesCaseStudy }) {
  const [activeTurnIndex, setActiveTurnIndex] = useState(study.turns.length - 1);
  const [activeOutputId, setActiveOutputId] = useState("solution");

  const activeTurn = study.turns[activeTurnIndex];
  const activeOutput = activeTurn.outputs.find(output => output.id === activeOutputId) ?? activeTurn.outputs[0];
  const activeSources = useMemo(() => new Set(activeOutput.sourceIds), [activeOutput.sourceIds]);
  const activeSourceTurns = useMemo(
    () => study.turns.filter(turn => activeSources.has(turn.messageId)),
    [activeSources, study.turns],
  );

  const selectTurn = (index: number) => {
    setActiveTurnIndex(index);
    const nextTurn = study.turns[index];
    const nextOutput = nextTurn.outputs.find(output => output.id === activeOutputId) ?? nextTurn.outputs[0];
    setActiveOutputId(nextOutput.id);
  };

  const moveFocus = (
    event: KeyboardEvent<HTMLDivElement>,
    selector: string,
    currentIndex: number,
    itemCount: number,
    onSelect: (index: number) => void,
  ) => {
    const navigationKeys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!navigationKeys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = currentIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = itemCount - 1;
    else {
      const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      nextIndex = (currentIndex + direction + itemCount) % itemCount;
    }

    onSelect(nextIndex);
    event.currentTarget.querySelectorAll<HTMLButtonElement>(selector)[nextIndex]?.focus({ preventScroll: true });
  };

  const onTurnKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    moveFocus(event, "button[data-turn]", activeTurnIndex, study.turns.length, selectTurn);
  };

  const onOutputKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = activeTurn.outputs.findIndex(output => output.id === activeOutput.id);
    moveFocus(
      event,
      "button[data-output]",
      currentIndex,
      activeTurn.outputs.length,
      index => setActiveOutputId(activeTurn.outputs[index].id),
    );
  };

  const revealSourceTurn = (turnId: string) => {
    const sourceTurn = document.getElementById(`sales-turn-${turnId}`);
    if (!sourceTurn) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sourceTurn.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  };

  return (
    <section id="case-study" className="case-study case-study--sales sales-conversion" aria-labelledby="case-study-title">
      <header className="sales-conversion-hero">
        <div>
          <p className="section-label">SALES PROFESSIONAL ASSISTANT / 多轮转化分析</p>
          <h2 id="case-study-title">{study.title}</h2>
          <p>{study.intro}</p>
        </div>
        <aside className="sales-conversion-disclosure" aria-label="演示与保密说明">
          <LockKeyhole aria-hidden="true" size={20} strokeWidth={1.45} />
          <p><b>{study.demoLabel}</b><span>{study.confidentiality}</span></p>
        </aside>
      </header>

      <div className="sales-conversion-workbench">
        <div className="sales-conversion-grid">
          <section className="sales-turn-pane" aria-labelledby="sales-turn-title">
            <header>
              <div>
                <span>客户回答 / 累计上下文</span>
                <h3 id="sales-turn-title">需求怎样逐轮变得清晰</h3>
              </div>
              <p>当前读取截至第 {activeTurnIndex + 1} 轮的全部脱敏摘要。</p>
            </header>

            <div
              className="sales-turn-list"
              role="tablist"
              aria-label="选择客户回复轮次"
              aria-orientation="vertical"
              onKeyDown={onTurnKeyDown}
            >
              {study.turns.map((turn, index) => {
                const active = index === activeTurnIndex;
                const linked = activeSources.has(turn.messageId);
                return (
                  <button
                    key={turn.id}
                    id={`sales-turn-${turn.id}`}
                    type="button"
                    role="tab"
                    data-turn
                    data-active={active}
                    data-linked={linked}
                    aria-selected={active}
                    aria-controls="sales-conversion-snapshot"
                    tabIndex={active ? 0 : -1}
                    onClick={() => selectTurn(index)}
                  >
                    <span className="sales-turn-index" aria-hidden="true">{index + 1}</span>
                    <span className="sales-turn-copy">
                      <small>{turn.label}</small>
                      <b>{turn.reply}</b>
                      <em>{turn.tag}</em>
                    </span>
                    {linked ? <span className="sales-turn-evidence">支撑当前：{activeOutput.title}</span> : null}
                  </button>
                );
              })}
            </div>

            <div className="sales-turn-guide">
              <Link2 aria-hidden="true" size={20} strokeWidth={1.4} />
              <p><span>读图方式</span><b>点击右侧任一结果，左侧会同步标出支撑判断的客户回答。</b></p>
            </div>
          </section>

          <section
            id="sales-conversion-snapshot"
            className="sales-conversion-snapshot"
            role="tabpanel"
            aria-labelledby={`sales-turn-${activeTurn.id}`}
          >
            <header>
              <div>
                <span>当前转化状态</span>
                <h3>第 {activeTurnIndex + 1} 轮后</h3>
              </div>
              <p>{activeTurn.contextSummary}</p>
            </header>

            <div className="sales-state-overview">
              <div key={`mql-${activeTurn.id}`} className="sales-mql-track" aria-label={`当前 MQL 等级为 ${activeTurn.mql.level}`}>
                <div className="sales-mql-label">
                  <span>MQL 等级轨迹</span>
                  <b>{activeTurn.mql.level} · {activeTurn.mql.label}</b>
                </div>
                <ol>
                  {study.mqlLevels.map((level, index) => {
                    const currentLevelIndex = study.mqlLevels.findIndex(item => item.level === activeTurn.mql.level);
                    const reached = index <= currentLevelIndex;
                    const current = level.level === activeTurn.mql.level;
                    return (
                      <li key={level.level} data-reached={reached} data-current={current}>
                        <span>{level.level}</span>
                        <small>{level.label}</small>
                      </li>
                    );
                  })}
                </ol>
                <div className="sales-mql-missing">
                  <span>尚未达到 A</span>
                  <p>{activeTurn.mql.missingForA.join("、")}仍待确认。</p>
                </div>
              </div>

              <aside className="sales-dimension-bridge" aria-label="当前结果与客户回答的关联" aria-live="polite">
                <div className="sales-association-now">
                  <Link2 aria-hidden="true" size={20} strokeWidth={1.4} />
                  <p>
                    <span>判断依据带</span>
                    <b>{activeOutput.title}</b>
                    <small>关联 {activeSourceTurns.map(turn => turn.label).join("、")}</small>
                  </p>
                </div>
                <div className="sales-dimension-list" aria-label="累计读取的需求维度">
                  {study.dimensions.map(dimension => {
                    const Icon = dimensionIcons[dimension.id];
                    const reached = dimension.reachedAt <= activeTurnIndex + 1;
                    return (
                      <p key={dimension.id} data-reached={reached}>
                        <Icon aria-hidden="true" size={18} strokeWidth={1.35} />
                        <b>{dimension.label}</b>
                        <small>{dimension.detail}</small>
                      </p>
                    );
                  })}
                </div>
              </aside>
            </div>

            <div key={`outputs-${activeTurn.id}`} className="sales-conversion-output-list" aria-label="本轮转化分析结果" onKeyDown={onOutputKeyDown}>
              {activeTurn.outputs.map(output => {
                const Icon = outputIcons[output.id];
                const active = output.id === activeOutput.id;
                return (
                  <button
                    key={output.id}
                    type="button"
                    data-output
                    data-active={active}
                    data-status={output.status}
                    aria-pressed={active}
                    onClick={() => setActiveOutputId(output.id)}
                    onFocus={() => setActiveOutputId(output.id)}
                  >
                    <Icon aria-hidden="true" size={22} strokeWidth={1.4} />
                    <span>
                      <b>{output.title}</b>
                      <small>{output.value}</small>
                      {output.steps?.length ? (
                        <span className="sales-solution-route" aria-label="方案推进路径">
                          {output.steps.map(step => <em key={step}>{step}</em>)}
                        </span>
                      ) : null}
                    </span>
                    <small className="sales-output-status">
                      <span aria-hidden="true" />
                      状态：{statusLabels[output.status]}
                    </small>
                  </button>
                );
              })}
            </div>

            <div className="sales-conversion-rationale" key={`${activeTurn.id}-${activeOutput.id}`} aria-live="polite">
              <div>
                <span>为什么这样判断</span>
                <p>{activeOutput.rationale}</p>
              </div>
              <div>
                <span>相对上一轮的变化</span>
                <p>{activeTurn.changeReason}</p>
              </div>
              <section className="sales-conversion-source-links" aria-label="支撑当前判断的客户回答">
                <span>关联客户回答</span>
                <div>
                  {activeSourceTurns.map(turn => (
                    <article key={turn.id}>
                      <p><b>{turn.label}</b><small>{turn.reply}</small></p>
                      <button type="button" onClick={() => revealSourceTurn(turn.id)}>定位第 {study.turns.indexOf(turn) + 1} 轮</button>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>

        <footer className="sales-conversion-evidence" aria-label="本轮事实、未知项与人工边界">
          <section>
            <FileCheck2 aria-hidden="true" size={24} strokeWidth={1.35} />
            <div><span>本轮新增事实</span>{activeTurn.newFacts.map(item => <p key={item}>{item}</p>)}</div>
          </section>
          <section>
            <Route aria-hidden="true" size={24} strokeWidth={1.35} />
            <div><span>仍待确认</span><p>{activeTurn.unknowns.join(" / ")}</p></div>
          </section>
          <section>
            <ShieldCheck aria-hidden="true" size={24} strokeWidth={1.35} />
            <div><span>人工边界</span><p>{study.humanBoundary}</p></div>
          </section>
        </footer>
      </div>

      <section className="sales-implementation" aria-labelledby="sales-implementation-title">
        <header>
          <p className="section-label">WHY IT IS RELIABLE / 它为什么可靠</p>
          <h3 id="sales-implementation-title">需求可以持续刷新，事实边界不能漂移。</h3>
          <p>工作台只展示公开、脱敏的需求维度；这里说明内部输出如何保持结构化、可核验和人工可控。</p>
        </header>
        <div>
          {study.implementation.map((item, index) => (
            <article key={item.title}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <h4>{item.title}</h4>
              <p>{item.detail}</p>
              <span>{item.evidence}</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="case-source-notes sales-source-notes">
        {study.sources.map(source => <p key={source.label}><span>{source.label}</span><b>{source.value}</b></p>)}
      </footer>

      <p className="case-boundary"><span>BOUNDARY / 边界</span>{study.boundary}</p>
    </section>
  );
}
