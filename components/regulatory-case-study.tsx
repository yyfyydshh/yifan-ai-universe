"use client";

import {
  ArrowRight,
  Building2,
  Check,
  CircleHelp,
  FileCheck2,
  FileSearch,
  Fingerprint,
  MapPin,
  PackageCheck,
  Scale,
  ShieldAlert,
  TimerReset,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { RegulatoryCaseStudy } from "@/lib/site-data";
import { CaseStudyHeading } from "./case-study-shared";

type AxisStatus = "match" | "pending" | "mismatch";

const axisIcons = [MapPin, Building2, Scale, TimerReset];
const stageIcons = [CircleHelp, Fingerprint, PackageCheck, FileSearch, Scale, ShieldAlert, FileCheck2, Fingerprint];
const statusLabel: Record<AxisStatus, string> = { match: "匹配", pending: "待确认", mismatch: "不匹配" };

export function RegulatoryCaseStudyView({ study }: { study: RegulatoryCaseStudy }) {
  const [activeIndex, setActiveIndex] = useState(4);
  const [axisStates, setAxisStates] = useState<AxisStatus[]>(["match", "pending", "match", "match"]);
  const [guardStates, setGuardStates] = useState(() => study.guards.map(() => true));
  const activeStage = study.stages[activeIndex] ?? study.stages[0];
  const nextStage = study.stages[activeIndex + 1];
  const ActiveStageIcon = stageIcons[activeIndex] ?? CircleHelp;

  const applicability = useMemo(() => {
    if (axisStates.some(state => state === "mismatch")) return "excluded";
    if (axisStates.some(state => state === "pending")) return "pending";
    return "candidate";
  }, [axisStates]);
  const guardsPassed = guardStates.every(Boolean);
  const routeState = guardsPassed && applicability === "candidate" ? "report" : applicability === "excluded" ? "excluded" : "blocked";

  const cycleAxis = (index: number) => {
    const order: AxisStatus[] = ["match", "pending", "mismatch"];
    setAxisStates(states => states.map((state, current) => current === index ? order[(order.indexOf(state) + 1) % order.length] : state));
  };

  return (
    <section id="case-study" className="case-study case-study--regulatory" aria-labelledby="case-study-title">
      <CaseStudyHeading
        eyebrow="APPLICABILITY DESK / 企业适用性审阅"
        title={study.title}
        intro={study.intro}
        evidenceStatus={study.evidenceStatus}
        summary={study.summary}
      />

      <div className="regulatory-stage-deck">
        <div className="regulatory-stage-nav" role="list" aria-label="金融监管监测工作流">
          {study.stages.map((stage, index) => {
            const Icon = stageIcons[index];
            return (
              <div key={stage.id} role="listitem" data-active={activeIndex === index}>
                <button
                  type="button"
                  aria-pressed={activeIndex === index}
                  aria-controls="regulatory-stage-focus"
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                >
                  <span><Icon aria-hidden="true" size={20} strokeWidth={1.5} /></span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <b>{stage.title}</b>
                </button>
                {index < study.stages.length - 1 ? <i aria-hidden="true" /> : null}
              </div>
            );
          })}
        </div>

        <article
          className="regulatory-stage-focus"
          id="regulatory-stage-focus"
          key={activeStage.id}
          aria-live="polite"
        >
          <header>
            <span className="regulatory-stage-mark" aria-hidden="true">
              <ActiveStageIcon size={25} strokeWidth={1.45} />
              <b>{String(activeIndex + 1).padStart(2, "0")}</b>
            </span>
            <div>
              <small>ACTIVE STAGE / 当前步骤</small>
              <h3>{activeStage.title}</h3>
              <p>{activeStage.short}</p>
            </div>
            <div className="regulatory-stage-route" data-state={routeState === "report" ? "ready" : "paused"}>
              <span>ROUTE STATE / 路径状态</span>
              <b>{routeState === "report" ? "证据路径可继续" : "存在待确认或阻断条件"}</b>
            </div>
          </header>

          <div className="regulatory-stage-details">
            <section>
              <span>WHY IT EXISTS / 为什么需要</span>
              <p>{activeStage.depth.purpose}</p>
            </section>
            <section>
              <span>MECHANISM / 实际机制</span>
              <ol>
                {activeStage.depth.mechanism.map((item, index) => (
                  <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><p>{item}</p></li>
                ))}
              </ol>
            </section>
            <section>
              <span>AUDIT TRAIL / 可核验证据</span>
              <dl>
                {activeStage.depth.artifacts.map(artifact => (
                  <div key={artifact.name}><dt>{artifact.name}</dt><dd>{artifact.role}</dd></div>
                ))}
              </dl>
            </section>
            <section>
              <span>DECISION / 继续或停止</span>
              <p>{activeStage.depth.decision}</p>
            </section>
          </div>

          <footer>
            <span>点击上方任一步骤，当前解释会在这里同步切换。</span>
            {nextStage ? (
              <button type="button" onClick={() => setActiveIndex(index => Math.min(index + 1, study.stages.length - 1))}>
                下一步：{nextStage.title}<ArrowRight aria-hidden="true" size={17} strokeWidth={1.5} />
              </button>
            ) : <b><Check aria-hidden="true" size={17} />工作流已到达投递防重</b>}
          </footer>
        </article>
      </div>

      <div className="regulatory-console">
          <header>
            <div>
              <span>MECHANISM DEMO / 机制演示</span>
              <h3>四轴适用性矩阵</h3>
            </div>
            <p>点击任一轴切换“匹配 / 待确认 / 不匹配”，观察结论与投递路径如何变化。</p>
          </header>

          <div className="applicability-matrix">
            {study.axes.map((axis, index) => {
              const Icon = axisIcons[index];
              const state = axisStates[index];
              return (
                <button type="button" key={axis.label} data-state={state} onClick={() => cycleAxis(index)}>
                  <span><Icon aria-hidden="true" size={24} strokeWidth={1.45} /></span>
                  <small>AXIS {String(index + 1).padStart(2, "0")}</small>
                  <b>{axis.label}</b>
                  <p>{axis.question}</p>
                  <i>{state === "match" ? <Check size={15} /> : state === "mismatch" ? <X size={15} /> : <CircleHelp size={15} />}{statusLabel[state]}</i>
                </button>
              );
            })}
            <div className="applicability-result" data-result={applicability}>
              <span>APPLICABILITY / 当前判断</span>
              <b>{applicability === "candidate" ? "候选风险" : applicability === "excluded" ? "排除" : "待确认"}</b>
              <p>{applicability === "candidate"
                ? "四个条件均有支持证据，可进入候选风险与证据覆盖检查。"
                : applicability === "excluded"
                  ? "至少一个适用条件明确不匹配，该记录不支持目标企业风险结论。"
                  : "仍有未知条件，保留为 pending 并生成补证问题。"}</p>
            </div>
          </div>

          <div className="regulatory-guards">
            <div>
              <span>REPORT GUARDS / 报告阻断条件</span>
              <h3>{guardsPassed ? "机制门均开启" : "报告路径已阻断"}</h3>
            </div>
            <div>
              {study.guards.map((guard, index) => (
                <button
                  type="button"
                  key={guard.label}
                  aria-pressed={guardStates[index]}
                  data-checked={guardStates[index]}
                  onClick={() => setGuardStates(states => states.map((state, current) => current === index ? !state : state))}
                >
                  <span>{guardStates[index] ? <Check aria-hidden="true" size={15} /> : <X aria-hidden="true" size={15} />}</span>
                  <p><b>{guard.label}</b><small>{guard.reason}</small></p>
                </button>
              ))}
            </div>
          </div>

          <div className="regulatory-route" data-state={routeState} aria-live="polite">
            <div><Fingerprint aria-hidden="true" size={24} strokeWidth={1.45} /><span>DELIVERY ROUTE / 当前交付路径</span></div>
            <b>{routeState === "report" ? "可进入报告校验与防重投递" : routeState === "excluded" ? "记录排除，保留判断依据" : "暂停正式报告，输出缺口与补证建议"}</b>
            <p>投递指纹 = 渠道 + 报告哈希 + 企业画像 + 任务快照 + 收件目标</p>
          </div>

          <div className="regulatory-proof">
            <span>EVIDENCE FIELDS / 关键证据字段</span>
            <div>{study.proofFields.map(field => <code key={field}>{field}</code>)}</div>
          </div>

          <div className="regulatory-artifacts">
            <span>AUDIT ARTIFACTS / 可核验证据</span>
            <dl>{study.artifacts.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.role}</dd></div>)}</dl>
          </div>
      </div>

      <p className="case-boundary"><span>BOUNDARY / 边界</span>{study.boundary}</p>
    </section>
  );
}
