"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { notes } from "@/lib/site-data";

export function NotesFocus() {
  const [activeIndex, setActiveIndex] = useState(0);
  const noteRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const activeNote = notes[activeIndex];

  useEffect(() => {
    const entries = noteRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const observer = new IntersectionObserver(
      changes => {
        const current = changes
          .filter(change => change.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActiveIndex(Number((current.target as HTMLElement).dataset.noteIndex ?? 0));
      },
      { rootMargin: "-24% 0px -48%", threshold: [0.3, 0.6] },
    );
    entries.forEach(entry => observer.observe(entry));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="notes-focus" aria-label="文章与观点信号">
      <aside className="viewpoint-signal" aria-live="polite">
        <div className="viewpoint-orbit" aria-hidden="true"><i /><i /><span /></div>
        <p>VIEWPOINT SIGNAL / 0{activeIndex + 1}</p>
        <h2>{activeNote.theme}</h2>
        <dl>
          <div><dt>结论类型</dt><dd>{activeNote.conclusionType}</dd></div>
          <div><dt>阅读方向</dt><dd>{activeNote.readingDirection}</dd></div>
          <div><dt>阅读时间</dt><dd>{activeNote.readingTime}</dd></div>
        </dl>
      </aside>

      <div className="notes-list">
        {notes.map((note, index) => (
          <Link
            href={`/notes/${note.slug}`}
            key={note.slug}
            ref={node => { noteRefs.current[index] = node; }}
            data-note-index={index}
            data-active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
          >
            <span>0{index + 1}</span>
            <div><small>{note.theme} · {note.readingTime}</small><h2>{note.title}</h2><p>{note.summary}</p></div>
            <b>阅读 →</b>
          </Link>
        ))}
      </div>
    </section>
  );
}
