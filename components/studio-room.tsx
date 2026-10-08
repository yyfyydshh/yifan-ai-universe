"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronsLeftRight, Monitor, MousePointer2, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { projects } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import { StudioProjects, studioTools } from "./studio-projects";
import "./studio-room.css";

// Transparent interaction rectangles use the centre and dimensions of the
// objects painted into the room. The artwork itself never moves on interaction.
const placements: Record<string, { x:number; y:number; width:number; height:number; tooltip?:string }> = {
  "docs-system": { x:25.1, y:17.1, width:5.7, height:8.4, tooltip:"right" },
  "regulatory-risk": { x:88.2, y:14.9, width:12.1, height:12.8, tooltip:"left" },
  "global-opinion": { x:14, y:38.4, width:8.6, height:16.2, tooltip:"right" },
  "sales-copilot": { x:50.5, y:41.2, width:8, height:6.5 },
  "tender-cleaner": { x:20.1, y:61, width:15.5, height:13 },
  "hot-news-brief": { x:62.9, y:40, width:7.2, height:7.5, tooltip:"left" },
  humanizer: { x:52.4, y:72.8, width:15.2, height:8.8 },
};

export function StudioRoom() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [windowOpen, setWindowOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const windowTrigger = useRef<HTMLButtonElement | null>(null);
  const pointerType = useRef<string>("mouse");
  const selectedProject = projects.find(project => project.slug === selectedSlug);
  const selectedTool = selectedSlug ? studioTools[selectedSlug] : null;

  useEffect(() => {
    if (!windowOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [windowOpen]);

  const openComputer = (event: MouseEvent<HTMLButtonElement>) => {
    windowTrigger.current = event.currentTarget;
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    setWindowOpen(true);
  };
  const closeComputer = () => dialogRef.current?.close();
  const restoreFocus = () => {
    setWindowOpen(false);
    windowTrigger.current?.focus({ preventScroll:true });
  };

  return <>
    <section className="studio-room" aria-labelledby="studio-room-title" style={{"--studio-day-image":`url("${publicPath("/world/studio-room-integrated.webp")}")`,"--studio-night-image":`url("${publicPath("/world/studio-room-night-v2.webp")}")`} as CSSProperties}>
      <header className="studio-room-heading">
        <Link href="/" className="studio-room-back"><ArrowLeft size={16} aria-hidden="true"/>回到世界</Link>
        <h1 id="studio-room-title">我的工作室</h1>
        <p>每件小物，都是一个认真做过的项目。</p>
      </header>
      <div className="studio-room-scroll" role="region" aria-label="木屋工作室，左右滑动可以看完整个房间" tabIndex={0}>
        <div className="studio-room-canvas">
          <Image className="studio-room-background" src={publicPath("/world/studio-room-integrated.webp")} alt="木屋工作室。地球仪、电话、收音机、文档、规则夹、整理机、笔记本和电脑自然摆在书架与桌面上，窗外可以看见浮空岛。" width={1536} height={1024} sizes="(max-width:900px) 780px, 100vw" unoptimized priority/>
          <Image className="studio-room-background studio-room-background-night" src={publicPath("/world/studio-room-night-v2.webp")} alt="" width={1536} height={1024} sizes="(max-width:900px) 780px, 100vw" loading="eager" unoptimized/>
          <div className="studio-room-objects" aria-label="七件项目工具">
            {projects.map(project => {
              const tool = studioTools[project.slug];
              const place = placements[project.slug];
              return <Link key={project.slug} href={`/work/${project.slug}`} className="studio-room-object" data-selected={selectedSlug===project.slug} data-tooltip={place.tooltip ?? "top"}
                style={{ "--object-x":`${place.x}%`, "--object-y":`${place.y}%`, "--object-width":`${place.width}%`, "--object-height":`${place.height}%` } as CSSProperties}
                aria-label={`${tool.label}：${project.shortTitle}`} aria-describedby={`room-tip-${project.slug}`}
                onPointerDown={event => { pointerType.current = event.pointerType; }}
                onClick={event => {
                  // Touch first selects an object. Its large preview button opens the project.
                  if (event.detail > 0 && pointerType.current !== "mouse") { event.preventDefault(); setSelectedSlug(project.slug); }
                }}>
                <span className="studio-room-tooltip" id={`room-tip-${project.slug}`} role="tooltip"><b>{project.shortTitle}</b><span>{tool.action}</span><small>点击进入项目 <ArrowRight size={14} aria-hidden="true"/></small></span>
              </Link>;
            })}
            <button type="button" className="studio-room-object studio-room-computer" style={{"--object-x":"86.5%","--object-y":"41%","--object-width":"14.5%","--object-height":"19.2%"} as CSSProperties} onClick={openComputer} aria-label="打开工作室电脑，查看全部项目" aria-haspopup="dialog" aria-expanded={windowOpen}>
              <span className="studio-room-object-label"><i aria-hidden="true"/>我的电脑</span>
              <span className="studio-room-tooltip" role="tooltip"><b>项目都在电脑里</b><span>打开项目窗口，直接找到你想看的作品。</span><small>打开电脑 <ArrowRight size={14} aria-hidden="true"/></small></span>
            </button>
          </div>
        </div>
      </div>
      <div className="studio-room-help"><span className="studio-mouse-help"><MousePointer2 size={16} aria-hidden="true"/>悬停看看，点击进入项目</span><span className="studio-touch-help"><ChevronsLeftRight size={18} aria-hidden="true"/>左右滑动房间，点物件看介绍</span><button type="button" onClick={openComputer} aria-haspopup="dialog"><Monitor size={18} aria-hidden="true"/>打开电脑 · 全部项目</button></div>
      <section className="studio-room-selection" data-selected={Boolean(selectedProject)} aria-label="选中物件介绍" aria-live="polite">
        {selectedProject && selectedTool ? <><span className="studio-room-selection-number" aria-hidden="true">{selectedProject.index}</span><div><small>{selectedTool.label}</small><h2>{selectedProject.shortTitle}</h2><p>{selectedTool.action}</p></div><Link href={`/work/${selectedProject.slug}`}>进入项目<ArrowRight size={18} aria-hidden="true"/></Link></> : <><MousePointer2 size={25} aria-hidden="true"/><div><h2>先选一件小工具</h2><p>点一下物件，看看它解决了什么问题。</p></div></>}
      </section>
    </section>
    <dialog ref={dialogRef} className="studio-os-window" aria-labelledby="studio-window-title" onClose={restoreFocus}>
      <div className="studio-os-titlebar"><span className="studio-os-app-icon"><Monitor size={21} aria-hidden="true"/></span><div><h2 id="studio-window-title">工作室电脑</h2><p>想法、工具与认真做过的项目</p></div><button type="button" onClick={closeComputer} aria-label="关闭电脑窗口"><X size={22} aria-hidden="true"/></button></div>
      <div className="studio-os-scroll"><StudioProjects/></div>
      <footer className="studio-os-status"><span><i aria-hidden="true"/>7 个项目，随时可以打开</span><button type="button" onClick={closeComputer}>回到房间 <ArrowRight size={15} aria-hidden="true"/></button></footer>
    </dialog>
  </>;
}
