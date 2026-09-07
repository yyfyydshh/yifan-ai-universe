"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Trace = Point & { time: number };

// The atlas is fixed. Pointer proximity reveals it without rearranging its stars.
function atlasPoints(width: number, height: number): Point[] {
  let seed = 7813;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  // Jittered coverage avoids dead patches while keeping the pattern irregular.
  return Array.from({ length: 108 }, (_, index) => ({
    x: (index % 12 + 0.18 + random() * 0.64) * width / 12,
    y: (Math.floor(index / 12) + 0.18 + random() * 0.64) * height / 9,
  }));
}

export function InteractiveStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".home-hero, .work-page");
    const field = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !hero || !field || !context) return;
    const atlas = document.createElement("canvas");
    const ink = atlas.getContext("2d");
    if (!ink) return;
    const cursor = document.createElement("span");
    cursor.className = "stellar-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
    const trailCanvas = document.createElement("canvas");
    trailCanvas.className = "meteor-overlay";
    trailCanvas.setAttribute("aria-hidden", "true");
    trailCanvas.dataset.active = "false";
    const trailInk = trailCanvas.getContext("2d")!;
    document.body.append(trailCanvas);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 769px)");
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let active = false;
    let pointer: Point = { x: 0, y: 0 };
    let traces: Trace[] = [];
    let meteors: Trace[] = [];
    let clientPointer: Point | null = null;
    let scrollTarget = 0;
    let scrollDepth = 0;
    let glow = "";
    let light = "";
    let stars: Point[] = [];
    let lastTrace: Point = pointer;
    let drift: Point = { x: 0, y: 0 };
    let previousTime = 0;
    const enabled = () => !motion.matches && finePointer.matches && !document.hidden;

    const draw = (time: number) => {
      frame = 0;
      const delta = previousTime ? Math.min(64, time - previousTime) : 16;
      previousTime = time;
      traces = traces.filter(trace => time - trace.time < 1000);
      context.globalAlpha = 1;
      meteors = meteors.filter(trace => time - trace.time < 460);
      const scrollBlend = 1 - Math.exp(-delta / 160);
      scrollDepth += (scrollTarget - scrollDepth) * scrollBlend;
      context.clearRect(0, 0, width, height);
      if (active || traces.length) {
        context.globalCompositeOperation = "source-over";
        context.drawImage(atlas, 0, 0, width, height);
        context.globalCompositeOperation = "destination-in";
        // One combined mask: a local stationary reveal and fading old positions.
        const mask = new Path2D();
        mask.rect(0, 0, width, height);
        const radius = Math.min(235, width * 0.19);
        // Use a separate mask canvas so multiple trails combine before clipping.
        maskContext.clearRect(0, 0, width, height);
        const reveal = (point: Point, opacity: number) => {
          const gradient = maskContext.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
          gradient.addColorStop(0, `rgba(255,255,255,${opacity})`);
          gradient.addColorStop(0.36, `rgba(255,255,255,${opacity * 0.85})`);
          gradient.addColorStop(1, "rgba(255,255,255,0)");
          maskContext.fillStyle = gradient;
          maskContext.fill(mask);
        };
        for (const trace of traces) reveal(trace, Math.pow(1 - (time - trace.time) / 1000, 2) * 0.65);
        if (active) reveal(pointer, 1);
        context.drawImage(maskCanvas, 0, 0, width, height);
        context.globalCompositeOperation = "source-over";
      }
      // A few near-field particles travel faster than the distant dust on scroll.
      context.fillStyle = light;
      context.globalAlpha = Math.min(0.6, Math.abs(scrollTarget - scrollDepth) * 0.055);
      for (const star of stars.filter((_, index) => index % 5 === 0)) {
        context.beginPath();
        context.arc(star.x, star.y + scrollDepth * 1.6, 1.4, 0, Math.PI * 2);
        context.fill();
      }
      trailInk.clearRect(0, 0, innerWidth, innerHeight);
      trailInk.save();
      const trailBounds = canvas.getBoundingClientRect();
      trailInk.translate(trailBounds.left, trailBounds.top);
      trailInk.beginPath();
      trailInk.rect(0, 0, width, height);
      trailInk.clip();
      // Short, tapered meteor strokes follow the actual pointer path, then burn out.
      trailInk.lineCap = "round";
      trailInk.shadowColor = glow;
      trailInk.shadowBlur = 9;
      for (let index = 1; index < meteors.length; index++) {
        const tail = meteors[index - 1];
        const head = meteors[index];
        if (Math.hypot(head.x - tail.x, head.y - tail.y) > 180) continue;
        const life = Math.max(0, 1 - (time - head.time) / 460);
        trailInk.globalAlpha = life * life * 0.85;
        trailInk.strokeStyle = index === meteors.length - 1 ? light : glow;
        trailInk.lineWidth = 0.4 + life * 1.7;
        trailInk.beginPath();
        trailInk.moveTo(tail.x, tail.y);
        trailInk.lineTo(head.x, head.y);
        trailInk.stroke();
      }
      trailInk.shadowBlur = 0;
      trailInk.globalAlpha = 1;
      trailInk.restore();
      trailCanvas.dataset.active = String(meteors.length > 1);
      const target = active ? { x: (pointer.x / width - 0.5) * 9, y: (pointer.y / height - 0.5) * 6 } : { x: 0, y: 0 };
      const blend = 1 - Math.exp(-delta / 180);
      drift.x += (target.x - drift.x) * blend;
      drift.y += (target.y - drift.y) * blend;
      field.style.setProperty("--dust-x", `${drift.x.toFixed(2)}px`);
      field.style.setProperty("--dust-y", `${(drift.y + scrollDepth).toFixed(2)}px`);
      field.style.setProperty("--scroll-depth", `${scrollDepth.toFixed(2)}px`);
      canvas.dataset.active = String(active);
      if (traces.length || meteors.length || Math.abs(scrollTarget - scrollDepth) > 0.03 || Math.abs(target.x - drift.x) + Math.abs(target.y - drift.y) > 0.03) frame = requestAnimationFrame(draw);
    };
    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d")!;
    const wake = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const leave = () => {
      if (active) traces.push({ ...pointer, time: performance.now() });
      active = false;
      cursor.dataset.visible = "false";
      hero.removeAttribute("data-stellar-cursor");
      wake();
    };
    const move = (event: PointerEvent) => {
      if (!enabled() || event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      const next = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      clientPointer = { x: event.clientX, y: event.clientY };
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.dataset.visible = "true";
      cursor.dataset.action = (event.target as Element).closest("a, button") ? "link" : "explore";
      hero.dataset.stellarCursor = "true";
      if (!active) meteors = [];
      if (!meteors.length || Math.hypot(next.x - meteors[meteors.length - 1].x, next.y - meteors[meteors.length - 1].y) > 2) {
        meteors.push({ ...next, time: performance.now() });
        meteors = meteors.slice(-24);
      }
      if (active && Math.hypot(next.x - lastTrace.x, next.y - lastTrace.y) > 42) {
        traces.push({ ...pointer, time: performance.now() });
        traces = traces.slice(-8);
        lastTrace = next;
      }
      if (!active) lastTrace = next;
      pointer = next;
      active = true;
      wake();
    };
    const reset = () => {
      active = false;
      traces = [];
      meteors = [];
      clientPointer = null;
      scrollTarget = 0;
      scrollDepth = 0;
      cursor.dataset.visible = "false";
      hero.removeAttribute("data-stellar-cursor");
      drift = { x: 0, y: 0 };
      cancelAnimationFrame(frame);
      frame = 0;
      context.clearRect(0, 0, width, height);
      field.style.setProperty("--dust-x", "0px");
      context.globalAlpha = 1;
      trailInk.clearRect(0, 0, innerWidth, innerHeight);
      trailCanvas.dataset.active = "false";
      field.style.setProperty("--dust-y", "0px");
      field.style.setProperty("--scroll-depth", "0px");
      canvas.dataset.active = "false";
    };
    const resize = () => {
      reset();
      width = field.clientWidth;
      height = field.clientHeight;
      ratio = Math.min(devicePixelRatio || 1, 2);
      trailCanvas.width = Math.round(innerWidth * ratio);
      trailCanvas.height = Math.round(innerHeight * ratio);
      trailInk.setTransform(ratio, 0, 0, ratio, 0, 0);
      for (const surface of [canvas, atlas, maskCanvas]) {
        surface.width = Math.round(width * ratio);
        surface.height = Math.round(height * ratio);
        surface.getContext("2d")!.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
      const style = getComputedStyle(field);
      const points = atlasPoints(width, height);
      stars = points;
      glow = style.getPropertyValue("--color-focus").trim();
      light = style.getPropertyValue("--color-starlight").trim();
      const degree = points.map(() => 0);
      ink.strokeStyle = style.getPropertyValue("--color-orbit-silver").trim();
      ink.lineWidth = 0.85;
      points.forEach((point, index) => {
        const nearest = points.slice(0, index).map((other, candidate) => ({ candidate, distance: Math.hypot(point.x - other.x, point.y - other.y) }))
          .filter(item => item.distance > 45 && item.distance < 165 && degree[item.candidate] < 2)
          .sort((a, b) => a.distance - b.distance)[0];
        if (!nearest) return;
        const other = points[nearest.candidate];
        degree[index]++;
        degree[nearest.candidate]++;
        ink.globalAlpha = 0.72;
        ink.beginPath();
        ink.moveTo(point.x, point.y);
        ink.quadraticCurveTo((point.x + other.x) / 2 + 8, (point.y + other.y) / 2 - 12, other.x, other.y);
        ink.stroke();
      });
      ink.fillStyle = style.getPropertyValue("--color-starlight").trim();
      points.forEach((point, index) => {
        ink.globalAlpha = index % 4 ? 0.72 : 1;
        ink.beginPath();
        ink.arc(point.x, point.y, index % 4 ? 1.5 : 2.2, 0, Math.PI * 2);
        ink.fill();
        if (index % 9 === 0) {
          ink.globalAlpha = 0.55;
          ink.beginPath();
          ink.moveTo(point.x - 4, point.y);
          ink.lineTo(point.x + 4, point.y);
          ink.moveTo(point.x, point.y - 4);
          ink.lineTo(point.x, point.y + 4);
          ink.stroke();
        }
      });
      // Keep the positioning/copy column quiet, including its responsive footprint.
      const copy = hero.querySelector<HTMLElement>(".hero-copy");
      if (copy) {
        const area = copy.getBoundingClientRect();
        const bounds = canvas.getBoundingClientRect();
        const fade = ink.createLinearGradient(area.right - bounds.left - 25, 0, area.right - bounds.left + 90, 0);
        fade.addColorStop(0, "rgba(255,255,255,0.08)");
        fade.addColorStop(1, "white");
        ink.globalAlpha = 1;
        ink.globalCompositeOperation = "destination-in";
        ink.fillStyle = fade;
        ink.fillRect(0, 0, width, height);
        ink.globalCompositeOperation = "source-over";
      }
      canvas.dataset.ready = "true";
    };
    const observer = new ResizeObserver(resize);
    const scroll = () => {
      if (!enabled()) return;
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= innerHeight) { reset(); return; }
      scrollTarget = Math.max(-48, Math.min(72, -bounds.top * 0.12));
      // Reproject the stationary screen pointer into the scrolled background.
      if (active && clientPointer) {
        if (clientPointer.y < bounds.top || clientPointer.y > bounds.bottom) leave();
        else {
          const fieldBounds = canvas.getBoundingClientRect();
          pointer = { x: clientPointer.x - fieldBounds.left, y: clientPointer.y - fieldBounds.top };
        }
      }
      meteors = [];
      wake();
    };
    const press = () => { cursor.dataset.pressed = "true"; };
    const release = () => { cursor.dataset.pressed = "false"; };
    observer.observe(field);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    hero.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", reset);
    motion.addEventListener("change", reset);
    finePointer.addEventListener("change", reset);
    return () => {
      reset();
      observer.disconnect();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      hero.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("scroll", scroll);
      cursor.remove();
      trailCanvas.remove();
      document.removeEventListener("visibilitychange", reset);
      motion.removeEventListener("change", reset);
      finePointer.removeEventListener("change", reset);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-starfield" aria-hidden="true" data-active="false" />;
}
