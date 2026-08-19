"use client";

import { useEffect, useRef, useState } from "react";

type Capability = readonly [string, string];

export function CapabilitySystem({ capabilities }: { capabilities: readonly Capability[] }) {
  const stages = [
    { index: "01", title: "输入问题", label: "业务抽象", items: [capabilities[0]] },
    { index: "02", title: "方法", label: "Agent 与实现", items: [capabilities[1], capabilities[2]] },
    { index: "03", title: "质量控制", label: "可靠性交付", items: [capabilities[3]] },
    { index: "04", title: "交付沉淀", label: "复用与赋能", items: [capabilities[4]] },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const sections = stageRefs.current.filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      entries => {
        const current = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActiveIndex(Number((current.target as HTMLElement).dataset.capabilityIndex ?? 0));
      },
      { rootMargin: "-28% 0px -42%", threshold: [0.25, 0.55, 0.8] },
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="capability-system" aria-labelledby="capability-system-title">
      <aside className="capability-diagram">
        <p>CAPABILITY SYSTEM</p>
        <h2 id="capability-system-title">能力不是列表，<br />而是一条交付链。</h2>
        <div className="capability-path" aria-label="输入问题到交付沉淀的能力路径">
          <i style={{ height: `${((activeIndex + 1) / stages.length) * 100}%` }} aria-hidden="true" />
          {stages.map((stage, index) => (
            <a key={stage.index} href={`#capability-${stage.index}`} aria-current={activeIndex === index ? "step" : undefined}>
              <span>{stage.index}</span><div><b>{stage.title}</b><small>{stage.label}</small></div>
            </a>
          ))}
        </div>
      </aside>

      <div className="capability-stages">
        {stages.map((stage, index) => (
          <article
            key={stage.index}
            id={`capability-${stage.index}`}
            ref={node => { stageRefs.current[index] = node; }}
            data-capability-index={index}
            data-active={activeIndex === index}
          >
            <header><span>{stage.index}</span><small>{stage.label}</small></header>
            <h3>{stage.title}</h3>
            {stage.items.filter(Boolean).map(([title, text]) => (
              <div className="capability-method" key={title}>
                <b>{title}</b><p>{text}</p>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
