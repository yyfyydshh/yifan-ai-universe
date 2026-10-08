/* eslint-disable @next/next/no-img-element -- A small unoptimized site mark. */
"use client";

import { useEffect, useRef } from "react";
import { useWorldStore } from "@/lib/world-store";
import { publicPath } from "@/lib/site-config";
import "../public/world/archipelago.css";

type IslandRuntime = Window & { mountIslandWorld?: (root: HTMLElement) => () => void };
let runtime: Promise<void> | undefined;
function loadRuntime() {
  return runtime ??= (async () => {
    for (const path of ["terrain-transition.js", "island-disassembly.js"]) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = publicPath(`/world/${path}`);
        script.onload = () => resolve();
        script.onerror = () => { script.remove(); runtime = undefined; reject(new Error("世界加载失败")); };
        document.head.append(script);
      });
    }
  })();
}

const zones = [
  ["work", "工作室", "AI 工作流 · 产品实验"],
  ["writing", "写作小屋", "文字与生活"],
  ["thoughts", "思考山丘", "技术观点 · 方法复盘"],
  ["music", "声音房", "待更新"],
  ["games", "游戏桌", "待更新"],
  ["films", "放映室", "待更新"],
  ["stuff", "杂物间", "待更新"],
];

export function ArchipelagoHome() {
  const root = useRef<HTMLElement>(null);
  const theme = useWorldStore(s => s.theme);
  useEffect(() => {
    let disposed = false, cleanup: (() => void) | undefined;
    loadRuntime().then(() => {
      if (!disposed && root.current) cleanup = (window as IslandRuntime).mountIslandWorld?.(root.current);
    }).catch(() => root.current?.setAttribute("data-failed", "true"));
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return <main ref={root} className="island-home" data-theme={theme} data-base={publicPath("/").replace(/\/$/, "")} aria-label="杨逸凡的浮空创作世界">
    <header className="site-header">
      <a className="wordmark" href={publicPath("/")} aria-label="杨逸凡的世界首页" title="回到首页"><img src={publicPath("/site-icon.png")} alt="" width="44" height="44" /></a>
      <nav className="nav" aria-label="主导航">
        <button id="directory-open" aria-haspopup="dialog">区域目录</button>
        <button onClick={() => useWorldStore.getState().setPanel("profile")}>快速了解我</button>
        <button id="home" className="home">回到起点</button>
        <button className="theme-control" aria-label={theme === "day" ? "切换到夜晚" : "切换到白天"} onClick={() => useWorldStore.getState().setTheme(theme === "day" ? "night" : "day")}>{theme === "day" ? "☀" : "☾"}</button>
        <button id="breeze" aria-label="暂停漂浮" aria-pressed="false" title="暂停漂浮">〰</button>
      </nav>
    </header>
    <section id="journey" className="scroll-world" aria-label="滚动展开群岛">
      <div className="stage">
        <div className="sky" aria-hidden="true" style={{backgroundImage: `url('${publicPath('/world/sky-v3.webp')}')`}}><div className="sky-night" style={{backgroundImage: `url('${publicPath('/world/sky-night-v3.webp')}')`}} /></div>
        <div className="hero-copy"><p className="eyebrow">你好，欢迎来坐坐</p><h1>杨逸凡<br />的世界</h1><p>我做过的，写过的，想过的，<br />以及还没做完的，都在这里。</p><p className="signature">保持好奇，持续探索。</p></div>
        <canvas id="terrain" className="world-art terrain" aria-hidden="true" />
        <svg id="scene" className="world-art" viewBox="-25 -25 1360 1270" role="group" aria-label="悬停了解岛屿，点击走近；也可用 Tab 键选择" />
        <svg className="breeze-layer" aria-hidden="true" />
        <div className="scene-caption"><p>我的小小世界</p><h2>选一座岛，<br />一起走近看看。</h2></div>
        <aside id="island-hover" className="island-hover" role="tooltip" hidden>
          <strong id="hover-title" />
          <p id="hover-detail" />
          <span>点击岛屿，走近看看 →</span>
        </aside>
        <section id="island-preview" className="island-preview" aria-label="当前岛屿" hidden>
          <button id="unfocus" className="back-islands">← 看看整个世界</button>
          <p id="preview-status" className="eyebrow" />
          <h2 id="preview-title" />
          <p id="preview-description" />
          <p id="reaction-caption" className="reaction-caption" aria-live="polite" />
          <a id="enter-island" className="enter-island" href={publicPath("/work")}>进入工作室 ↗</a>
          <nav className="island-switcher" aria-label="切换岛屿">{zones.map(([id, title]) => <button key={id} data-select-zone={id} aria-label={`走近${title}`}>{title}</button>)}</nav>
        </section>
        <div className="scroll-cue"><span className="scroll-mouse" aria-hidden="true">↓</span><span id="scroll-hint">向下滚动，让小岛慢慢展开</span></div>
        <p id="loading" className="loading-note" role="status">正在打开这个世界…</p>
        <p id="character-speech" className="character-speech" aria-live="polite" />
      </div>
    </section>
    <div className="scroll-progress" aria-hidden="true"><span /></div>
    <dialog id="directory" aria-labelledby="directory-heading">
      <div className="dialog-head"><h2 id="directory-heading">去一个喜欢的角落</h2><button id="directory-close" aria-label="关闭区域目录">×</button></div>
      <nav className="dialog-links" aria-label="区域目录">{zones.map(([id, title, detail]) => <a href={publicPath(`/${id}`)} key={id}><span>{title}</span><small>{detail} ↗</small></a>)}</nav>
    </dialog>
    <nav className="island-fallback" aria-label="直接访问区域">{zones.map(([id, title]) => <a href={publicPath(`/${id}`)} key={id}>{title}</a>)}</nav>
  </main>;
}
