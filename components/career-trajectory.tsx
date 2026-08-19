"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { experiences } from "@/lib/site-data";

export function CareerTrajectory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const entriesRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    let frame = 0;

    const updateActiveEntry = () => {
      frame = 0;
      const entries = entriesRef.current.filter(Boolean) as HTMLElement[];
      if (!entries.length) return;

      const focusLine = window.innerHeight * 0.42;
      let nextIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      entries.forEach((entry, index) => {
        const rect = entry.getBoundingClientRect();
        const distance = focusLine < rect.top
          ? rect.top - focusLine
          : focusLine > rect.bottom
            ? focusLine - rect.bottom
            : 0;

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nextIndex = index;
        }
      });

      setActiveIndex(current => current === nextIndex ? current : nextIndex);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveEntry);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="career-trajectory">
      <aside className="career-rail" aria-label="职业轨迹进度">
        <span>CAREER SIGNAL</span>
        <div className="career-rail-line">
          <i style={{ transform: `scaleY(${(activeIndex + 1) / experiences.length})` }} />
        </div>
        {experiences.map((item, index) => (
          <a key={item.period} href={`#career-${index + 1}`} aria-current={index === activeIndex ? "step" : undefined}>
            <b>{String(experiences.length - index).padStart(2, "0")}</b><small>{item.period}</small>
          </a>
        ))}
      </aside>

      <div className="career-line">
        {experiences.map((item, index) => (
          <article
            key={item.period}
            id={`career-${index + 1}`}
            ref={node => { entriesRef.current[index] = node; }}
            data-career-index={index}
            data-active={index === activeIndex}
            className="career-entry"
          >
            <div className="career-index">0{experiences.length - index}</div>
            <div className="career-time">{item.period}</div>
            <div className="career-content">
              <p className="career-state"><span /> {item.status}</p>
              <h2>{item.company}</h2>
              <h3>{item.role}</h3>
              <p className="career-scope">{item.scope.join(" · ")}</p>
              <p>{item.summary}</p>
              <div className="career-responsibilities" aria-label="职责与贡献">
                {item.responsibilities.map((responsibility, responsibilityIndex) => (
                  <div key={responsibility}>
                    <span>{String(responsibilityIndex + 1).padStart(2, "0")}</span>
                    <p>{responsibility}</p>
                  </div>
                ))}
              </div>
              <p className="career-progression"><span>能力演进</span>{item.progression}</p>
              <div className="career-evidence" aria-label="经历证据">
                {item.facts.map((fact, factIndex) => (
                  <div key={`${fact.value}-${fact.label}`} style={{ "--fact-index": factIndex } as CSSProperties}>
                    <strong>{fact.value}</strong><p>{fact.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="career-evolution" aria-label="能力演进">
        <span>系统排查</span><b>→</b><span>团队机制</span><b>→</b><span>产品运营</span><b>→</b><span>AI 能力产品化</span>
      </section>
    </div>
  );
}
