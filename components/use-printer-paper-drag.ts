"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";

type Gesture = { id: number; startX: number; startY: number; x: number; y: number; moved: boolean };

export function usePrinterPaperDrag(onDrop: () => void) {
  const paperRef = useRef<HTMLButtonElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [overTarget, setOverTarget] = useState(false);
  const attachPaper = useCallback((node: HTMLButtonElement | null) => { paperRef.current = node; }, []);
  const attachTarget = useCallback((node: HTMLDivElement | null) => { targetRef.current = node; }, []);
  const focusPaper = useCallback(() => paperRef.current?.focus({ preventScroll: true }), []);

  const contains = useCallback((x: number, y: number) => {
    const box = targetRef.current?.getBoundingClientRect();
    return Boolean(box && x >= box.left && x <= box.right && y >= box.top && y <= box.bottom);
  }, []);
  const placeGhost = useCallback(() => {
    const active = gesture.current;
    if (active && ghostRef.current) ghostRef.current.style.translate = `${active.x - 85}px ${active.y - 75}px`;
  }, []);
  const attachGhost = useCallback((node: HTMLDivElement | null) => { ghostRef.current = node; placeGhost(); }, [placeGhost]);
  const clear = useCallback(() => {
    const active = gesture.current;
    gesture.current = null;
    cancelAnimationFrame(frame.current);
    if (active && paperRef.current?.hasPointerCapture(active.id)) paperRef.current.releasePointerCapture(active.id);
    setDragging(false);
    setOverTarget(false);
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === "Escape" && gesture.current) { event.preventDefault(); clear(); } };
    const hidden = () => { if (document.hidden) clear(); };
    window.addEventListener("blur", clear);
    window.addEventListener("resize", clear);
    window.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("blur", clear);
      window.removeEventListener("resize", clear);
      window.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [clear]);

  const autoScroll = useCallback(function tick() {
    const active = gesture.current;
    if (!active?.moved) return;
    const edge = 85;
    const speed = active.y < edge ? -Math.min(18, (edge - active.y) / 4)
      : active.y > innerHeight - edge ? Math.min(18, (active.y - innerHeight + edge) / 4) : 0;
    if (speed) window.scrollBy({ top: speed, behavior: "instant" });
    setOverTarget(contains(active.x, active.y));
    frame.current = requestAnimationFrame(tick);
  }, [contains]);

  return {
    attachPaper, attachTarget, focusPaper, attachGhost, dragging, overTarget, cancel: clear,
    handlers: {
      onPointerDown(event: PointerEvent<HTMLButtonElement>) {
        if (!event.isPrimary || event.button !== 0 || gesture.current) return;
        gesture.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove(event: PointerEvent<HTMLButtonElement>) {
        const active = gesture.current;
        if (!active || active.id !== event.pointerId) return;
        active.x = event.clientX; active.y = event.clientY;
        if (!active.moved && Math.hypot(active.x - active.startX, active.y - active.startY) < 6) return;
        event.preventDefault();
        if (!active.moved) { active.moved = true; setDragging(true); frame.current = requestAnimationFrame(autoScroll); }
        placeGhost();
        setOverTarget(contains(active.x, active.y));
      },
      onPointerUp(event: PointerEvent<HTMLButtonElement>) {
        const active = gesture.current;
        if (!active || active.id !== event.pointerId) return;
        const accepted = active.moved && contains(event.clientX, event.clientY);
        clear();
        if (accepted) onDrop();
      },
      onPointerCancel: clear,
      onLostPointerCapture: clear,
      // A physical mouse/touch click never feeds paper. Native keyboard and
      // assistive activation remain an equivalent path without requiring drag.
      onClick(event: MouseEvent<HTMLButtonElement>) { if (event.detail === 0) onDrop(); },
    },
  };
}
