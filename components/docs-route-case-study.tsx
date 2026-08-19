"use client";

import {
  Boxes,
  CheckCircle2,
  CloudCog,
  FileCode2,
  GitPullRequestArrow,
  Image,
  Link2,
  Network,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { DocsCaseStudy } from "@/lib/site-data";
import { CaseStudyHeading, StageDepthPanel } from "./case-study-shared";

const stageIcons = [Boxes, Network, FileCode2, Image, Link2, CloudCog, ShieldCheck];

export function DocsRouteCaseStudy({ study }: { study: DocsCaseStudy }) {
  const [routeIndex, setRouteIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);
  const route = study.routes[routeIndex] ?? study.routes[0];
  const activeStage = route.stages[activeIndex] ?? route.stages[0];
  const nextStage = route.stages[activeIndex + 1];

  const selectRoute = (index: number) => {
    setRouteIndex(index);
    setActiveIndex(0);
  };

  return (
    <section id="case-study" className="case-study case-study--docs" aria-labelledby="case-study-title">
      <CaseStudyHeading
        eyebrow="DELIVERY CONTROL / 文档交付控制台"
        title={study.title}
        intro={study.intro}
        evidenceStatus={study.evidenceStatus}
        summary={study.summary}
      />

      <div className="docs-route-tabs" role="tablist" aria-label="文档站任务路径">
        {study.routes.map((item, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={routeIndex === index}
            key={item.id}
            onClick={() => selectRoute(index)}
          >
            <span>PATH {String(index + 1).padStart(2, "0")}</span>
            <b>{item.label}</b>
            <small>{item.brief}</small>
          </button>
        ))}
      </div>

      <div className="case-workbench case-workbench--docs">
        <div className="docs-console">
          <header>
            <div><GitPullRequestArrow aria-hidden="true" size={25} strokeWidth={1.45} /><span>CURRENT ROUTE / 当前路径</span></div>
            <h3>{route.label}</h3>
            <p>{route.brief}</p>
          </header>

          <div className="docs-route-track" role="list" aria-label={`${route.label}阶段`}>
            {route.stages.map((stage, index) => {
              const Icon = stageIcons[Math.min(index, stageIcons.length - 1)];
              const active = activeIndex === index;
              const passed = activeIndex > index;
              return (
                <div key={stage.id} role="listitem" data-active={active} data-passed={passed}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span><Icon aria-hidden="true" size={22} strokeWidth={1.45} /></span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <b>{stage.title}</b>
                    <p>{stage.short}</p>
                  </button>
                  {index < route.stages.length - 1 ? <i aria-hidden="true" /> : null}
                </div>
              );
            })}
          </div>

          <div className="docs-acceptance">
            <div className="docs-acceptance-heading">
              <span>DOUBLE GATE / 双重验收</span>
              <h3>本地通过 <b>≠</b> 正式可发布</h3>
            </div>
            <div>
              {study.acceptance.map((item, index) => (
                <section key={item.title} data-current={index === 0 || activeIndex >= route.stages.length - 2}>
                  <span>{index === 2 ? <ShieldCheck aria-hidden="true" size={20} /> : <CheckCircle2 aria-hidden="true" size={20} />}</span>
                  <p><b>{item.title}</b><small>{item.check}</small></p>
                </section>
              ))}
            </div>
          </div>

          <div className="case-deliverable-strip" aria-label="真实交付物">
            <span>DELIVERABLES</span>
            <div>{study.deliverables.map(item => <b key={item}>{item}</b>)}</div>
          </div>

          <footer className="case-source-notes">
            {study.sources.map(source => <p key={source.label}><span>{source.label}</span><b>{source.value}</b></p>)}
          </footer>
        </div>

        <StageDepthPanel
          key={`${route.id}-${activeStage.id}`}
          stage={activeStage}
          index={activeIndex}
          total={route.stages.length}
          nextStage={nextStage}
          onNext={() => setActiveIndex(index => Math.min(index + 1, route.stages.length - 1))}
        >
          <div className="case-live-state" data-state="route">
            <span>ROUTE / 当前交付路径</span>
            <b>{route.label}</b>
          </div>
        </StageDepthPanel>
      </div>

      <p className="case-boundary"><span>BOUNDARY / 边界</span>{study.boundary}</p>
    </section>
  );
}
