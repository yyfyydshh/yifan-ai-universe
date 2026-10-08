"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { zones, getZone } from "@/lib/world-data";
import { useWorldStore } from "@/lib/world-store";
import { publicPath } from "@/lib/site-config";
import { WorldDice, WorldNotebook } from "./world-notebook";
import { WorldPostcard } from "./world-postcard";
import { useSceneTravel } from "./world-transition";
import { WorldRegionReaction } from "./world-region-reaction";

export function WorldPanels() {
  const {travelTo}=useSceneTravel();
  const panel = useWorldStore(s => s.panel);
  const preview = useWorldStore(s => s.preview);
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const close = () => { useWorldStore.getState().setPanel(null); useWorldStore.getState().setPreview(null); };
  useEffect(() => { close(); }, [pathname]);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (panel || preview) { if (!node.open) node.showModal(); }
    else if (node.open) node.close();
  }, [panel, preview]);
  const zone = preview ? getZone(preview) : null;
  const title = zone?.title ?? (panel === "directory" ? "想去哪里逛逛？" : panel === "contact" ? "一起聊聊" : panel === "notebook" ? "随手记下的想法" : panel === "dice" ? "在游戏桌边歇一会儿" : panel === "postcard" ? "给今天，留一张明信片" : "你好，我是杨逸凡");
  return <dialog ref={dialog} className={`world-dialog ${zone ? "world-dialog--zone" : ""}`} aria-labelledby="world-dialog-title" onCancel={close} onClose={close} onClick={e => { if (e.target === e.currentTarget) { const r=e.currentTarget.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) close(); } }}>
    <button className="world-close icon-button" aria-label="关闭面板" onClick={close}><X size={22} /></button>
    <h2 id="world-dialog-title">{title}</h2>
    {panel === "notebook" ? <WorldNotebook onClose={close}/> : panel === "dice" ? <WorldDice/> : panel === "postcard" ? <WorldPostcard/> : zone ? <>
      <WorldRegionReaction key={zone.id} zone={zone.id}/>
      <p className="world-status">{zone.status === "open" ? "可以进来看看" : "待更新 · 作品尚未上架"}</p><p>{zone.description}</p>
      <Link className="paper-button paper-button--primary" href={zone.route} onClick={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();close();travelTo(zone.route,zone.title,zone.id);}}>{zone.status === "open" ? `进入${zone.title}` : "查看区域介绍"}<ArrowRight size={18} /></Link>
      {zone.status === "coming" && <Link className="quiet-link" href="/work" onClick={close}>先去工作室看看 <ArrowRight size={16} /></Link>}
    </> : panel === "directory" ? <>
      <p>七个角落，装着我正在做的事。</p>
      <nav className="world-directory" aria-label="区域目录">{zones.map(z => <Link href={z.route} key={z.id} onClick={close} aria-current={pathname.startsWith(z.route) ? "page" : undefined}><span><b>{z.title}</b><small>{z.english}</small></span><span>{z.status === "coming" ? "待更新" : "进入"}<ArrowRight size={17} /></span></Link>)}</nav>
      <div className="dialog-actions"><Link href="/profile" onClick={close}>关于我</Link><Link href="/career" onClick={close}>职业经历</Link><button onClick={() => useWorldStore.getState().setPanel("contact")}>联系我</button></div>
    </> : panel === "contact" ? <div className="world-contact"><p>聊聊项目、岗位，或一次值得验证的 AI 想法。</p><div className="contact-details"><a href="mailto:1693416144@qq.com">1693416144@qq.com</a><a href="tel:+8613028495851">130 2849 5851</a></div><figure><Image src={publicPath("/contact/wechat-qr-yang-yifan.jpg")} width={220} height={220} alt="杨逸凡的微信二维码" unoptimized /><figcaption>微信扫码添加</figcaption></figure></div> : <>
      <div className="quick-profile-intro"><Image src={publicPath("/world/yifan-cartoon-v2.webp")} width={240} height={240} alt="卡通形象：白 T 恤、工装裤的杨逸凡" unoptimized /><div><p>把想法变成作品，也认真过好生活。</p><p>2 年+ SaaS 技术支持、产品运营与团队管理经验。现在，我把一线问题和 AI 工作流连接起来，做可运行、可验证、可复用的工具。</p><span className="world-status">深圳 · AI 工作流与应用实践</span></div></div>
      <div className="profile-paths"><Link href="/work" onClick={close}>看我的 7 个项目<ArrowRight size={18} /></Link><Link href="/career" onClick={close}>了解职业经历<ArrowRight size={18} /></Link><Link href="/profile" onClick={close}>更多关于我<ArrowRight size={18} /></Link></div>
      <div className="dialog-actions"><a className="paper-button paper-button--primary" href={publicPath("/resume/杨逸凡_AI工作流方向_简历.pdf")} target="_blank" rel="noreferrer"><Download size={18} />下载简历</a><button className="paper-button" onClick={() => useWorldStore.getState().setPanel("contact")}>联系我</button></div>
    </>}
  </dialog>;
}
