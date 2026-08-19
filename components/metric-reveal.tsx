"use client";

import { useEffect, useRef, useState } from "react";

type Metric = { value: string; label: string; note: string };

function splitMetric(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  return { number: Number(match?.[1] ?? 0), suffix: match?.[2] ?? "" };
}

export function MetricReveal({ metrics }: { metrics: Metric[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let revealed = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || revealed) return;
      revealed = true;
      observer.disconnect();
      if (reduced) {
        setProgress(1);
        return;
      }
      const startedAt = performance.now();
      const tick = (time: number) => {
        const next = Math.min(1, (time - startedAt) / 900);
        setProgress(1 - Math.pow(1 - next, 3));
        if (next < 1) frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    }, { threshold: 0.35 });

    observer.observe(root);
    return () => {
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="metrics-grid" ref={rootRef}>
      {metrics.map(metric => {
        const { number, suffix } = splitMetric(metric.value);
        return (
          <article key={metric.label}>
            <strong aria-label={metric.value}>{Math.round(number * progress)}{suffix}</strong>
            <h3>{metric.label}</h3>
            <p>{metric.note}</p>
          </article>
        );
      })}
    </div>
  );
}
