"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectDemo } from "@/lib/site-data";

type DemoSlotProps = { title: string; compact?: boolean; demo?: ProjectDemo };

export function DemoSlot({ title, compact = false, demo }: DemoSlotProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !demo?.src) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      setReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        video.pause();
        return;
      }
      void video.play().catch(() => undefined);
    };
    const syncPlaying = () => setIsPlaying(!video.paused && !video.ended);

    video.addEventListener("play", syncPlaying);
    video.addEventListener("pause", syncPlaying);
    video.addEventListener("ended", syncPlaying);
    video.addEventListener("canplay", syncPlayback, { once: true });
    mediaQuery.addEventListener("change", syncPlayback);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) syncPlayback();

    return () => {
      video.removeEventListener("play", syncPlaying);
      video.removeEventListener("pause", syncPlaying);
      video.removeEventListener("ended", syncPlaying);
      video.removeEventListener("canplay", syncPlayback);
      mediaQuery.removeEventListener("change", syncPlayback);
    };
  }, [demo?.src]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      void video.play().catch(() => undefined);
      return;
    }
    video.pause();
  };

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => undefined);
  };

  return (
    <section id="project-demo" className={`demo-slot ${compact ? "demo-slot--compact" : ""}`} aria-labelledby="demo-title">
      <div className="demo-status"><span /> {demo?.src ? "项目演示" : "演示预留位 · 共创中"}</div>
      <div className={`demo-frame ${demo?.src ? "demo-frame--media" : "demo-frame--placeholder"}`}>
        {demo?.src ? (
          <video ref={videoRef} controls muted playsInline preload="metadata" poster={demo.poster}>
            <source src={demo.src} />
            {demo.captions ? <track kind="captions" src={demo.captions} srcLang="zh" label="中文" default /> : null}
            当前浏览器无法播放该项目演示。
          </video>
        ) : (
          <div className="demo-placeholder">
            <div className="demo-message demo-message--user">真实任务输入</div>
            <div className="demo-route" aria-hidden="true">
              <i>输入</i><b>→</b><i>判断</i><b>→</b><i>调用</i><b>→</b><i>结果</i>
            </div>
            <div className="demo-message demo-message--agent">这里将播放 {title} 的真实用法演示。</div>
          </div>
        )}
      </div>
      {demo?.src ? (
        <div className="demo-media-toolbar" data-playing={isPlaying}>
          <p aria-live="polite">{isPlaying ? "正在播放 · 静音演示" : reducedMotion ? "已遵循减少动态效果偏好" : "静音演示 · 可从任意位置开始观看"}</p>
          <div>
            <button type="button" onClick={togglePlayback}>{isPlaying ? "暂停" : "播放"}</button>
            <button type="button" onClick={replay}>从头重播</button>
          </div>
        </div>
      ) : null}
      <div className="demo-copy">
        <div>
          <h2 id="demo-title">{demo?.src ? "项目能力演示" : "项目说明视频将在这里发生"}</h2>
          <p>{demo?.src ? demo.description ?? `脱敏机制示例：展示 ${title} 如何处理输入、形成判断并交付可复核结果。` : "后续基于具体 Skill 地址、真实输入样例和需要强调的判断，共创短项目演示。当前仅为结构占位，不代表真实运行结果。"}</p>
        </div>
        <span className="demo-label">VIDEO / INTERACTIVE DEMO</span>
      </div>
    </section>
  );
}
