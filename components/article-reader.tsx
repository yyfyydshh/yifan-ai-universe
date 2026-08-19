"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export function ArticleReader({ children, title }: { children: ReactNode; title: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState("开始阅读");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll<HTMLHeadingElement>(".article-body h2[id]"));

    const update = () => {
      frameRef.current = null;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = Math.max(1, root.offsetHeight - viewport * 0.45);
      setProgress(Math.min(1, Math.max(0, -rect.top / travel)));

      const current = headings
        .filter(heading => heading.getBoundingClientRect().top <= viewport * 0.36)
        .at(-1);
      setChapter(current?.textContent?.trim() || "开始阅读");
    };

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="article-reader" ref={rootRef}>
      <div className="reading-progress" aria-hidden="true"><i style={{ width: `${progress * 100}%` }} /></div>
      <aside className="reading-signal" aria-live="polite">
        <span>READING / {Math.round(progress * 100)}%</span>
        <small>{title}</small>
        <b>{chapter}</b>
      </aside>
      {children}
    </div>
  );
}
