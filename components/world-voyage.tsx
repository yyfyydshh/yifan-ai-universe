"use client";

import { ArrowLeft, ArrowRight, Compass, Pause, Play, Send, X } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { zones } from "@/lib/world-data";
import { useWorldStore } from "@/lib/world-store";
import { useSceneTravel } from "./world-transition";
import "./world-voyage.css";

const subscribeVisibility = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const hiddenSnapshot = () => document.visibilityState === "hidden";
const subscribeMotion = (notify: () => void) => {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const reducedSnapshot = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const subscribeDialogs = (notify: () => void) => {
  const observer = new MutationObserver(notify);
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
  return () => observer.disconnect();
};
const dialogSnapshot = () => document.querySelector("dialog[open]") !== null;
const serverSnapshot = () => false;

export function WorldVoyage({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(false);
  const [station, setStation] = useState(0);
  const [automatic, setAutomatic] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const restoreFocus = useRef(false);
  const id = useId();
  const camera = useWorldStore(state => state.camera);
  const panel = useWorldStore(state => state.panel);
  const preview = useWorldStore(state => state.preview);
  const hidden = useSyncExternalStore(subscribeVisibility, hiddenSnapshot, serverSnapshot);
  const reducedMotion = useSyncExternalStore(subscribeMotion, reducedSnapshot, serverSnapshot);
  const dialogOpen = useSyncExternalStore(subscribeDialogs, dialogSnapshot, serverSnapshot);
  const { travelTo } = useSceneTravel();
  const paused = hidden || dialogOpen || panel !== null || preview !== null || reducedMotion;
  const zone = zones[station];
  const lastStation = station === zones.length - 1;

  useEffect(() => {
    if (active) titleRef.current?.focus({ preventScroll: true });
    else if (restoreFocus.current) {
      startRef.current?.focus({ preventScroll: true });
      restoreFocus.current = false;
    }
  }, [active]);

  useEffect(() => {
    if (!active || !automatic || paused || lastStation) return;
    const timeout = window.setTimeout(() => {
      // Recheck the live environment when a throttled background timer resumes.
      if (hiddenSnapshot() || reducedSnapshot() || dialogSnapshot()) return;
      const next = station + 1;
      setStation(next);
      camera("focus", 1.2, zones[next].id);
      if (next === zones.length - 1) setAutomatic(false);
    }, 6_000);
    return () => window.clearTimeout(timeout);
  }, [active, automatic, camera, lastStation, paused, station]);

  const start = () => {
    setStation(0);
    setAutomatic(false);
    setActive(true);
    camera("focus", 1.2, zones[0].id);
  };
  const visit = (next: number) => {
    setAutomatic(false);
    setStation(next);
    camera("focus", 1.2, zones[next].id);
  };
  const end = () => {
    restoreFocus.current = true;
    setAutomatic(false);
    setActive(false);
    camera("center");
  };
  const enter = () => {
    setAutomatic(false);
    travelTo(zone.route, zone.title, zone.id);
  };

  return <section className={`world-voyage${compact ? " world-voyage--compact" : ""}`} aria-label="环岛漫游" data-active={active} data-current-zone={active ? zone.id : undefined} data-automatic={automatic} data-paused={automatic && paused} onKeyDown={event => {
    if (event.key === "Escape" && active) { event.preventDefault(); end(); }
  }}>
    {!active ? <button ref={startRef} type="button" className="voyage-launch" aria-expanded={false} aria-controls={`${id}-route`} onClick={start}><Send size={22} aria-hidden="true"/><span>带我逛一圈</span><ArrowRight size={17} aria-hidden="true"/></button> : <div id={`${id}-route`} className="voyage-paper">
      <header className="voyage-heading"><span><Compass size={19} aria-hidden="true"/>环岛漫游</span><button type="button" className="voyage-end" onClick={end} aria-label="结束漫游，回到中心"><X size={18} aria-hidden="true"/><span>结束漫游</span></button></header>
      <div className="voyage-place" aria-live="polite" aria-atomic="true"><p className="voyage-progress">第 <b>{station + 1}</b> / {zones.length} 站{zone.status === "coming" && <span>内容待更新</span>}</p><h2 ref={titleRef} tabIndex={-1}>{zone.title}</h2><p className="voyage-description">{zone.description}</p></div>
      <div className="voyage-route" aria-hidden="true">{zones.map((item, index) => <i key={item.id} data-current={index === station} data-visited={index < station}/>)}</div>
      <div className="voyage-controls"><button type="button" onClick={() => visit(station - 1)} disabled={station === 0} aria-label="上一站"><ArrowLeft size={18} aria-hidden="true"/><span>上站</span></button><button type="button" className="voyage-enter" onClick={enter}>走进这里<ArrowRight size={17} aria-hidden="true"/></button><button type="button" onClick={() => visit(station + 1)} disabled={lastStation} aria-label="下一站"><span>下站</span><ArrowRight size={18} aria-hidden="true"/></button></div>
      <div className="voyage-auto"><button type="button" disabled={reducedMotion || lastStation} aria-pressed={automatic} onClick={() => setAutomatic(!automatic)}>{automatic ? <Pause size={15} aria-hidden="true"/> : <Play size={15} aria-hidden="true"/>}{automatic ? "暂停自动漫游" : "自动漫游"}</button><span role="status">{reducedMotion ? "减少动态效果已开启，可手动换站" : lastStation ? "七个角落，已经逛完啦" : automatic && paused ? "漫游已暂停，回来后继续" : automatic ? "每 6 秒，去下一个角落" : "随时停下，也能直接走进去"}</span></div>
    </div>}
  </section>;
}
