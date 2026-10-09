"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ChevronsLeftRight, LibraryBig, Mail, MousePointer2, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { getNoteHref, type Note } from "@/lib/content-index";
import { publicPath } from "@/lib/site-config";
import { writingPublication, writingSourceUrl } from "@/lib/writing-room-data";
import "./studio-room.css";
import "./writing-room.css";

type Place = "collection" | "shelf" | "letter";
const places = [
  { id: "collection" as const, label: "桌上文集", action: "翻开文集", description: "收在这里的每一篇文字", icon: BookOpen, x: 69, y: 65, width: 22, height: 13 },
  { id: "shelf" as const, label: "主题书架", action: "看看书架", description: "沿着一个主题，慢慢读", icon: LibraryBig, x: 12, y: 53, width: 20, height: 35 },
  { id: "letter" as const, label: "一封来信", action: "公众号", description: "文字最初发表的地方", icon: Mail, x: 88.5, y: 69, width: 11, height: 9 },
];

export function WritingRoom({ articles }: { articles: Note[] }) {
  const [place, setPlace] = useState<Place>("collection");
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const pointerTypeRef = useRef("mouse");
  const selectedItem = places.find(item => item.id === selectedPlace);
  const themes = [...new Set(articles.map(article => article.theme))];
  const visibleArticles = place === "shelf" && theme ? articles.filter(article => article.theme === theme) : articles;
  const publicationUrl = writingSourceUrl(writingPublication.url);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);

  function openPlace(next: Place, event: MouseEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget;
    setPlace(next);
    setTheme(null);
    dialogRef.current?.showModal();
    setIsOpen(true);
  }

  function restoreRoom() {
    setIsOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  return <>
    <section className="studio-room writing-room" aria-labelledby="writing-room-title" style={{
      "--studio-day-image": `url("${publicPath("/world/writing-room-day-v3.webp")}")`,
      "--studio-night-image": `url("${publicPath("/world/writing-room-night-v3.webp")}")`,
    } as CSSProperties}>
      <header className="studio-room-heading">
        <Link href="/" className="studio-room-back"><ArrowLeft size={16} aria-hidden="true" />回到世界</Link>
        <h1 id="writing-room-title">写作小屋</h1>
        <p>在这里，慢慢读一会儿。</p>
      </header>
      <div className="studio-room-scroll" role="region" aria-label="写作小屋，左右滑动可以看完整个房间" tabIndex={0}>
        <div className="studio-room-canvas">
          <Image className="studio-room-background writing-room-art" src={publicPath("/world/writing-room-day-v3.webp")} alt="卡通写作小屋：左侧书架，圆窗下摆着靠垫的阅读长凳，以及桌上的文集、信封和台灯。" width={1536} height={1024} sizes="(max-width: 900px) 780px, 100vw" priority unoptimized />
          <Image className="studio-room-background studio-room-background-night writing-room-art--night" src={publicPath("/world/writing-room-night-v3.webp")} alt="" width={1536} height={1024} sizes="(max-width: 900px) 780px, 100vw" loading="eager" unoptimized />
          <div className="studio-room-objects" aria-label="小屋里的阅读入口">
            {places.map(item => <button key={item.id} type="button" className={`studio-room-object writing-room-object${item.id === "collection" ? " studio-room-computer" : ""}`} data-selected={selectedPlace === item.id} data-tooltip={item.id === "shelf" ? "right" : item.id === "letter" ? "left" : "top"} style={{ "--object-x": `${item.x}%`, "--object-y": `${item.y}%`, "--object-width": `${item.width}%`, "--object-height": `${item.height}%` } as CSSProperties} aria-label={`${item.label}：${item.action}`} aria-describedby={`writing-tooltip-${item.id}`} aria-haspopup="dialog" aria-controls="writing-book" aria-expanded={isOpen && place === item.id} onPointerDown={event => { pointerTypeRef.current = event.pointerType; }} onClick={event => {
              if (item.id !== "collection" && event.detail > 0 && pointerTypeRef.current !== "mouse") {
                setSelectedPlace(item.id);
                return;
              }
              openPlace(item.id, event);
            }}>
              {item.id === "collection" && <span className="studio-room-object-label"><i aria-hidden="true" />我的文集</span>}
              <span className="studio-room-tooltip" id={`writing-tooltip-${item.id}`} role="tooltip"><b>{item.label}</b><span>{item.description}</span><small>{item.action}<ArrowRight size={14} aria-hidden="true" /></small></span>
            </button>)}
          </div>
        </div>
      </div>
      <div className="studio-room-help">
        <span className="studio-mouse-help"><MousePointer2 size={16} aria-hidden="true" />悬停看看，点击打开内容</span>
        <span className="studio-touch-help"><ChevronsLeftRight size={18} aria-hidden="true" />左右滑动房间，点物件看介绍</span>
        <button type="button" onClick={event => openPlace("collection", event)} aria-haspopup="dialog" aria-controls="writing-book" aria-expanded={isOpen}><BookOpen size={18} aria-hidden="true" />翻开文集 · 全部文章</button>
      </div>
      <section className="studio-room-selection writing-room-selection" data-selected={Boolean(selectedItem)} aria-label="选中物件介绍" aria-live="polite">
        {selectedItem ? <>
          <span className="studio-room-selection-number"><selectedItem.icon size={20} aria-hidden="true" /></span>
          <div><small>小屋里的阅读入口</small><h2>{selectedItem.label}</h2><p>{selectedItem.description}</p></div>
          <button type="button" onClick={event => openPlace(selectedItem.id, event)} aria-haspopup="dialog" aria-controls="writing-book">{selectedItem.action}<ArrowRight size={16} aria-hidden="true" /></button>
        </> : <><MousePointer2 size={24} aria-hidden="true" /><div><h2>先选一件小物</h2><p>点书架或信封看介绍，也可以直接翻开文集。</p></div></>}
      </section>
    </section>

    <dialog ref={dialogRef} id="writing-book" className="studio-os-window writing-book" aria-labelledby="writing-book-title" onClose={restoreRoom}>
        <header className="studio-os-titlebar">
          <span className="studio-os-app-icon"><BookOpen size={21} aria-hidden="true" /></span>
          <div><h2 id="writing-book-title">小屋文集</h2><p>生活、想象与慢慢写下的文字</p></div>
          <button type="button" autoFocus aria-label="合上文集，回到小屋" onClick={() => dialogRef.current?.close()}><X size={21} aria-hidden="true" /></button>
        </header>
        <div className="studio-os-scroll">
          <nav className="writing-book-nav" aria-label="文集目录">
            {places.map(item => <button key={item.id} type="button" aria-pressed={place === item.id} onClick={() => { setPlace(item.id); setTheme(null); }}><item.icon size={16} aria-hidden="true" />{item.id === "collection" ? "所有文章" : item.id === "shelf" ? "按主题读" : "关于公众号"}</button>)}
          </nav>
          <section className="writing-book-paper" aria-label={place === "letter" ? "公众号信息" : "作品列表"}>
            {place === "letter" ? <div className="writing-letter">
              <Mail size={32} strokeWidth={1.25} aria-hidden="true" /><p className="writing-paper-kicker">文字的另一处入口</p><h3>{writingPublication.name ?? "在公众号，继续读"}</h3>
              <p>{writingPublication.name ? `这里收录发表在「${writingPublication.name}」的文字。` : "这里会放上公众号的名字，以及文章最初发表的地方。"}</p>
              {publicationUrl ? <a className="paper-button paper-button--primary" href={publicationUrl} target="_blank" rel="noopener noreferrer">前往公众号</a> : <p className="writing-pending">公众号信息待补充</p>}
              <span className="writing-letter-signature">写作小屋</span>
            </div> : <>
              <div className="writing-paper-heading"><div><p className="writing-paper-kicker">{place === "shelf" ? "沿着主题翻阅" : "收在小屋里的文字"}</p><h3>{place === "shelf" ? "主题书架" : "文章目录"}</h3></div><span>{articles.length ? `${visibleArticles.length} 篇` : "待上架"}</span></div>
              {place === "shelf" && themes.length > 0 && <nav className="writing-theme-filter" aria-label="文章主题"><button type="button" aria-pressed={theme === null} onClick={() => setTheme(null)}>全部</button>{themes.map(name => <button type="button" key={name} aria-pressed={theme === name} onClick={() => setTheme(name)}>{name}</button>)}</nav>}
              {visibleArticles.length ? <ol className="writing-article-list">{visibleArticles.map((article, index) => {
                const source = writingSourceUrl(article.source?.url);
                return <li key={article.slug}><span className="writing-article-number">{String(index + 1).padStart(2, "0")}</span><article><p className="writing-article-meta">{article.theme} · {article.readingTime}{article.publishedAt && ` · ${article.publishedAt}`}</p><h4><Link href={getNoteHref(article)}>{article.title}</Link></h4><p>{article.summary}</p><div className="writing-article-links"><Link href={getNoteHref(article)}>在小屋阅读</Link>{source && <a href={source} target="_blank" rel="noopener noreferrer">{article.source?.label ?? "查看原文"}</a>}</div></article></li>;
              })}</ol> : <div className="writing-empty"><BookOpen size={48} strokeWidth={1} aria-hidden="true" /><h4>{place === "shelf" ? "书架，等文字慢慢住进来" : "第一篇，留给即将到来的作品"}</h4><p>{place === "shelf" ? "文章上架后，可以沿着不同的主题翻阅。" : "公众号作品正在整理，之后会一篇篇收进这里。"}</p><span>先坐一会儿，新的故事还在路上。</span></div>}
            </>}
          </section>
        </div>
        <footer className="studio-os-status"><span><i aria-hidden="true" />{articles.length ? `${articles.length} 篇文字，随时可以翻阅` : "公众号作品，正在整理中"}</span><button type="button" onClick={() => dialogRef.current?.close()}>回到房间<ArrowRight size={15} aria-hidden="true" /></button></footer>
    </dialog>
  </>;
}
