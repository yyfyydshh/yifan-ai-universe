"use client";

import {
  ArrowDown,
  ArrowRight,
  Check,
  Crosshair,
  Database,
  Download,
  FileSearch,
  Files,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { ProjectEvidence, ProjectEvidenceStepKey } from "@/lib/site-data";

const stepIcons: Record<ProjectEvidenceStepKey, LucideIcon> = {
  scope: Crosshair,
  collect: Download,
  audit: FileSearch,
  gate: ShieldCheck,
  deliver: Files,
};

const summaryIcons: LucideIcon[] = [Crosshair, UserRound, Database];

export function ProjectEvidenceFlow({ evidence }: { evidence: ProjectEvidence }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(3);
  const [gateChecks, setGateChecks] = useState(() => evidence.gates.map(() => true));
  const [scanIndex, setScanIndex] = useState(0);
  const [gatePaused, setGatePaused] = useState(false);
  const activeStep = evidence.steps[activeIndex] ?? evidence.steps[0];
  const nextStep = evidence.steps[activeIndex + 1];
  const ActiveStepIcon = stepIcons[activeStep.key];
  const allGatesMet = gateChecks.every(Boolean);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      const timeout = setTimeout(() => setRevealed(true), 0);
      return () => clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        setRevealed(true);
        observer.disconnect();
      },
      { rootMargin: "-10% 0px -14%", threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed || gatePaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setScanIndex(index => (index + 1) % evidence.gates.length);
      }
    }, 1450);

    return () => window.clearInterval(timer);
  }, [evidence.gates.length, gatePaused, revealed]);

  const toggleGate = (index: number) => {
    setScanIndex(index);
    setGateChecks(checks => checks.map((checked, current) => current === index ? !checked : checked));
  };

  return (
    <section
      ref={sectionRef}
      className="project-evidence"
      data-revealed={revealed}
      aria-labelledby="evidence-flow-title"
    >
      <header className="evidence-heading">
        <div>
          <p className="section-label">EVIDENCE WORKFLOW / 证据工作流</p>
          <h2 id="evidence-flow-title">{evidence.title}</h2>
        </div>
        <p>{evidence.intro}</p>
      </header>

      <div className="evidence-summary" aria-label="项目三十秒摘要">
        {evidence.summary.map((item, index) => {
          const Icon = summaryIcons[index] ?? Database;
          return (
            <div key={item.label}>
              <span className="evidence-summary-icon"><Icon aria-hidden="true" size={24} strokeWidth={1.5} /></span>
              <p><b>{item.label}</b><span>{item.value}</span></p>
            </div>
          );
        })}
      </div>

      <div className="evidence-workbench">
        <div className="evidence-workflow">
          <div className="evidence-flow-track" role="list" aria-label="全球舆情分析五步工作流">
            {evidence.steps.map((step, index) => {
              const Icon = stepIcons[step.key];
              const active = activeIndex === index;
              const style = { "--step-index": index } as CSSProperties;

              return (
                <div
                  className="evidence-flow-item"
                  data-active={active}
                  key={step.key}
                  role="listitem"
                  style={style}
                >
                  <button
                    type="button"
                    aria-pressed={active}
                    aria-describedby={`evidence-step-${step.key}`}
                    aria-controls="evidence-stage-panel"
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span className="evidence-step-icon"><Icon aria-hidden="true" size={28} strokeWidth={1.45} /></span>
                    <span className="evidence-step-index">0{index + 1}</span>
                    <strong>{step.title}</strong>
                  </button>
                  <ul id={`evidence-step-${step.key}`}>
                    {step.details.map(detail => <li key={detail}>{detail}</li>)}
                  </ul>
                  {index < evidence.steps.length - 1 ? <span className="evidence-flow-link" aria-hidden="true" /> : null}
                </div>
              );
            })}
          </div>

          <div
            className="evidence-quality-gate"
            data-result={allGatesMet ? "met" : "unmet"}
            aria-labelledby="quality-gate-title"
            onMouseEnter={() => setGatePaused(true)}
            onMouseLeave={() => setGatePaused(false)}
            onFocusCapture={() => setGatePaused(true)}
            onBlurCapture={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) setGatePaused(false);
            }}
          >
            <div className="quality-gate-heading">
              <span><ShieldCheck aria-hidden="true" size={28} strokeWidth={1.45} /></span>
              <div>
                <small>QUALITY GATE SIMULATOR / 质量门规则模拟</small>
                <h3 id="quality-gate-title">{allGatesMet ? "三项全部通过，可以进入正式报告" : "存在覆盖缺口，自动切换为降级交付"}</h3>
              </div>
            </div>

            <div className="quality-gate-toolbar">
              <p><i aria-hidden="true" />点击任一门槛，观察交付路径如何变化</p>
              <div>
                <button type="button" onClick={() => setGateChecks(evidence.gates.map(() => true))}>全部满足</button>
                <button type="button" onClick={() => setGateChecks(evidence.gates.map((_, index) => index !== 1))}>模拟缺口</button>
              </div>
            </div>

            <div className="quality-thresholds">
              {evidence.gates.map((gate, index) => (
                <button
                  type="button"
                  key={gate.label}
                  data-checked={gateChecks[index]}
                  data-scanning={scanIndex === index}
                  aria-pressed={gateChecks[index]}
                  aria-label={`${gate.label}门槛，当前${gateChecks[index] ? "满足" : "未满足"}`}
                  onClick={() => toggleGate(index)}
                >
                  <i aria-hidden="true" />
                  <strong>{gate.value}</strong>
                  <span>{gate.label}</span>
                  <small>{gateChecks[index] ? "PASS / 满足" : "GAP / 缺口"}</small>
                </button>
              ))}
            </div>

            <div className="quality-diagnostic" key={`${scanIndex}-${gateChecks[scanIndex]}`}>
              <div className="quality-diagnostic-heading">
                <span>GATE 0{scanIndex + 1} / 当前诊断</span>
                <b data-checked={gateChecks[scanIndex]}>{gateChecks[scanIndex] ? "门槛满足" : "发现缺口"}</b>
              </div>
              <dl>
                <div>
                  <dt>防止什么误判</dt>
                  <dd>{evidence.gates[scanIndex].prevents}</dd>
                </div>
                <div>
                  <dt>实际核验字段</dt>
                  <dd>{evidence.gates[scanIndex].verifies}</dd>
                </div>
                <div>
                  <dt>失败后的动作</dt>
                  <dd>{evidence.gates[scanIndex].fallback}</dd>
                </div>
              </dl>
            </div>

            <div className="quality-route" aria-hidden="true">
              <i />
              <span /><span /><span />
              <ArrowDown size={22} strokeWidth={1.4} />
            </div>

            <div className="quality-branches" aria-live="polite">
              <div className="quality-branch quality-branch--met" data-active={allGatesMet}>
                <span><Check aria-hidden="true" size={18} strokeWidth={1.8} /></span>
                <p><b>若达到门槛</b>{evidence.branches.met}</p>
              </div>
              <div className="quality-branch quality-branch--unmet" data-active={!allGatesMet}>
                <span><TriangleAlert aria-hidden="true" size={18} strokeWidth={1.7} /></span>
                <p><b>若未达到门槛</b>{evidence.branches.unmet}</p>
              </div>
            </div>

            <p className="quality-gate-note">这是门槛逻辑演示，不代表当前正在采集或已有实时数据。</p>
          </div>

        </div>

        <aside
          className="evidence-deliverables"
          id="evidence-stage-panel"
          aria-labelledby="evidence-stage-title"
          aria-live="polite"
        >
          <header>
            <span>ACTIVE STAGE / 0{activeIndex + 1} OF 05</span>
            <h3 id="evidence-stage-title">{activeStep.title}</h3>
          </header>

          <div className="evidence-stage-content" key={activeStep.key}>
            <div className="evidence-stage-mark" aria-hidden="true">
              <ActiveStepIcon size={30} strokeWidth={1.45} />
              <b>0{activeIndex + 1}</b>
            </div>

            <div className="evidence-stage-purpose">
              <span>WHY IT EXISTS / 为什么需要</span>
              <p>{activeStep.depth.purpose}</p>
            </div>

            <div className="evidence-stage-mechanism">
              <span>MECHANISM / 实际机制</span>
              <ol>
                {activeStep.depth.mechanism.map((item, index) => (
                  <li key={item}>
                    <b>0{index + 1}</b>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="evidence-stage-artifacts">
              <span>AUDIT TRAIL / 留下的证据</span>
              <dl>
                {activeStep.depth.artifacts.map(artifact => (
                  <div key={artifact.name}>
                    <dt>{artifact.name}</dt>
                    <dd>{artifact.role}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="evidence-stage-decision">
              <span>DECISION / 继续或停止</span>
              <p>{activeStep.depth.decision}</p>
            </div>

            {nextStep ? (
              <button
                className="evidence-stage-next"
                type="button"
                onClick={() => setActiveIndex(index => Math.min(index + 1, evidence.steps.length - 1))}
              >
                <span>NEXT OBSERVATION / 下一阶段</span>
                <p>{nextStep.title}<ArrowRight aria-hidden="true" size={17} strokeWidth={1.5} /></p>
              </button>
            ) : (
              <div className="evidence-stage-complete">
                <Check aria-hidden="true" size={18} strokeWidth={1.7} />
                <span>从范围到交付的证据链已闭合</span>
              </div>
            )}
          </div>

          <p className="evidence-boundary"><ShieldCheck aria-hidden="true" size={18} strokeWidth={1.45} />{evidence.boundary}</p>
        </aside>
      </div>
    </section>
  );
}
