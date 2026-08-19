import { ArrowRight, Check, Crosshair, Database, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import type { CaseStudyStage } from "@/lib/site-data";

export function CaseStudyHeading({ eyebrow, title, intro, evidenceStatus, summary }: {
  eyebrow: string;
  title: string;
  intro: string;
  evidenceStatus: string;
  summary: Array<{ label: string; value: string }>;
}) {
  const icons = [Crosshair, UserRound, Database];
  return (
    <>
      <header className="case-study-heading">
        <div><p className="section-label">{eyebrow}</p><h2 id="case-study-title">{title}</h2></div>
        <div className="case-study-heading-copy"><p>{intro}</p><span>{evidenceStatus}</span></div>
      </header>
      <div className="case-study-summary" aria-label="项目三十秒摘要">
        {summary.map((item, index) => {
          const Icon = icons[index] ?? Database;
          return <div key={item.label}><span><Icon aria-hidden="true" size={23} strokeWidth={1.45} /></span><p><b>{item.label}</b><small>{item.value}</small></p></div>;
        })}
      </div>
    </>
  );
}

export function StageDepthPanel({ stage, index, total, nextStage, onNext, children }: {
  stage: CaseStudyStage;
  index: number;
  total: number;
  nextStage?: CaseStudyStage;
  onNext?: () => void;
  children?: ReactNode;
}) {
  return (
    <aside className="case-depth-panel" aria-live="polite" aria-labelledby="case-stage-title">
      <header><span>ACTIVE STAGE / {String(index + 1).padStart(2, "0")} OF {String(total).padStart(2, "0")}</span><h3 id="case-stage-title">{stage.title}</h3><p>{stage.short}</p></header>
      {children}
      <section key={`${stage.id}-purpose`} className="case-depth-purpose"><span>WHY IT EXISTS / 为什么需要</span><p>{stage.depth.purpose}</p></section>
      <section className="case-depth-mechanism"><span>MECHANISM / 实际机制</span><ol>{stage.depth.mechanism.map((item, itemIndex) => <li key={item}><b>{String(itemIndex + 1).padStart(2, "0")}</b><p>{item}</p></li>)}</ol></section>
      <section className="case-depth-artifacts"><span>AUDIT TRAIL / 留下的证据</span><dl>{stage.depth.artifacts.map(artifact => <div key={artifact.name}><dt>{artifact.name}</dt><dd>{artifact.role}</dd></div>)}</dl></section>
      <section className="case-depth-decision"><span>DECISION / 继续或停止</span><p>{stage.depth.decision}</p></section>
      {nextStage && onNext ? <button className="case-depth-next" type="button" onClick={onNext}><span>NEXT OBSERVATION / 下一阶段</span><p>{nextStage.title}<ArrowRight aria-hidden="true" size={17} strokeWidth={1.5} /></p></button> : <div className="case-depth-complete"><Check aria-hidden="true" size={18} /><span>当前路径已完成</span></div>}
    </aside>
  );
}
