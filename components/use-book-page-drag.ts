"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type MouseEvent } from "react";

export type BookTurn = { from: number; to: number; direction: "forward" | "backward"; travel: number; bend: number; key: number; mode: "dragging" | "settling" };
type Grab = { id: number; x: number; y: number; width: number; height: number; button: HTMLElement; moved: boolean };

export function useBookPageDrag(count: number) {
  const [index, setIndex] = useState(0), [turn, setTurn] = useState<BookTurn | null>(null);
  const [size, setSize] = useState({ width: 400, height: 440 });
  const pageRef = useRef<HTMLDivElement>(null), settled = useRef(0), destination = useRef(0), active = useRef<BookTurn | null>(null);
  const frame = useRef(0), serial = useRef(0), grab = useRef<Grab | null>(null), suppressClick = useRef(false);
  const publish = useCallback((value: BookTurn | null) => { active.current = value; setTurn(value); }, []);
  const releaseCapture = useCallback(() => {
    const gesture = grab.current; grab.current = null;
    if (gesture?.button.hasPointerCapture(gesture.id)) gesture.button.releasePointerCapture(gesture.id);
  }, []);
  const animate = useCallback((goal: number, commit: boolean) => {
    cancelAnimationFrame(frame.current);
    function run(target: number, accepted: boolean) {
      const original = active.current;
      if (!original) return;
      const started = performance.now(), start = original.travel;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = reduced ? 0 : 220 + Math.abs(target - start) * 420;
      function tick(now: number) {
        if (active.current?.key !== original!.key) return;
        const elapsed = duration === 0 ? 1 : Math.min(1, (now - started) / duration);
        publish({ ...original!, mode: "settling", travel: start + (target - start) * (1 - Math.pow(1 - elapsed, 3)) });
        if (elapsed < 1) { frame.current = requestAnimationFrame(tick); return; }
        settled.current = accepted ? original!.to : original!.from;
        if (!accepted) { destination.current = settled.current; setIndex(settled.current); }
        if (accepted && destination.current !== settled.current) {
          publish({ from: settled.current, to: destination.current, direction: destination.current > settled.current ? "forward" : "backward", travel: 0, bend: .22, mode: "settling", key: ++serial.current });
          run(1, true);
        } else publish(null);
      }
      tick(started);
    }
    run(goal, commit);
  }, [publish]);
  const cancelDrag = useCallback(() => {
    if (!grab.current) return;
    suppressClick.current = true; releaseCapture(); animate(0, false);
  }, [animate, releaseCapture]);
  useEffect(() => {
    const node = pageRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => { setSize({ width: entry.contentRect.width, height: entry.contentRect.height }); });
    observer.observe(node); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (motion.matches) { cancelAnimationFrame(frame.current); releaseCapture(); settled.current = destination.current; publish(null); } };
    const key = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") cancelDrag(); };
    const visibility = () => { if (document.hidden) cancelDrag(); };
    motion.addEventListener("change", reduce); window.addEventListener("keydown", key); window.addEventListener("blur", cancelDrag); window.addEventListener("resize", cancelDrag); document.addEventListener("visibilitychange", visibility);
    return () => { cancelAnimationFrame(frame.current); releaseCapture(); motion.removeEventListener("change", reduce); window.removeEventListener("keydown", key); window.removeEventListener("blur", cancelDrag); window.removeEventListener("resize", cancelDrag); document.removeEventListener("visibilitychange", visibility); };
  }, [cancelDrag, publish, releaseCapture]);
  function selectPage(next: number) {
    if (next < 0 || next >= count || next === destination.current) return;
    if (grab.current) { cancelAnimationFrame(frame.current); releaseCapture(); publish(null); }
    destination.current = next; setIndex(next);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { cancelAnimationFrame(frame.current); settled.current = next; publish(null); return; }
    if (active.current || next === settled.current) return;
    publish({ from: settled.current, to: next, direction: next > settled.current ? "forward" : "backward", travel: 0, bend: .22, mode: "settling", key: ++serial.current });
    animate(1, true);
  }
  function cornerHandlers(direction: "forward" | "backward") {
    const next = index + (direction === "forward" ? 1 : -1);
    return {
      onPointerDown(event: PointerEvent<HTMLElement>) {
        if (!event.isPrimary || event.button !== 0 || active.current || next < 0 || next >= count) return;
        event.preventDefault(); suppressClick.current = false;
        const rect = pageRef.current!.getBoundingClientRect();
        grab.current = { id: event.pointerId, x: event.clientX, y: event.clientY, width: rect.width, height: rect.height, button: event.currentTarget, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
        publish({ from: settled.current, to: next, direction, travel: 0, bend: .22, mode: "dragging", key: ++serial.current });
      },
      onPointerMove(event: PointerEvent<HTMLElement>) {
        const gesture = grab.current, current = active.current;
        if (!gesture || !current || gesture.id !== event.pointerId) return;
        const dx = (event.clientX - gesture.x) * (current.direction === "forward" ? -1 : 1);
        if (Math.abs(event.clientX - gesture.x) + Math.abs(event.clientY - gesture.y) > 6) gesture.moved = true;
        publish({ ...current, travel: Math.min(1, Math.max(0, dx / (gesture.width * 2))), bend: Math.min(.5, Math.max(.06, .18 + (gesture.y - event.clientY) / gesture.height)) });
      },
      onPointerUp(event: PointerEvent<HTMLElement>) {
        const gesture = grab.current, current = active.current;
        if (!gesture || !current || gesture.id !== event.pointerId) return;
        const commit = !gesture.moved || current.travel >= .22;
        suppressClick.current = true; releaseCapture();
        if (commit) { destination.current = current.to; setIndex(current.to); }
        animate(commit ? 1 : 0, commit);
      },
      onPointerCancel: cancelDrag,
      onLostPointerCapture: cancelDrag,
      onClick(event: MouseEvent<HTMLElement>) { if (suppressClick.current && event.detail > 0) { suppressClick.current = false; return; } suppressClick.current = false; selectPage(next); },
    };
  }
  return { index, turn, size, pageRef, selectPage, cornerHandlers };
}
