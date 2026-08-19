"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  match: string[];
};

const nav: NavItem[] = [
  { href: "/", label: "首页", match: ["/"] },
  { href: "/work", label: "作品", match: ["/work", "/lab"] },
  { href: "/career", label: "经历", match: ["/career"] },
  { href: "/notes", label: "思考", match: ["/notes"] },
  { href: "/profile", label: "关于我", match: ["/profile"] },
];

function isCurrent(pathname: string, item: NavItem) {
  return item.match.some(prefix => prefix === "/" ? pathname === "/" : pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const frame = requestAnimationFrame(() => firstMobileLinkRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const openContact = () => {
    setMenuOpen(false);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="杨逸凡首页">
          <span>YY</span><b>杨逸凡</b>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {nav.map(item => {
            const current = isCurrent(pathname, item);
            return (
              <Link key={item.href} href={item.href} aria-current={current ? "page" : undefined}>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button className="contact-link" type="button" onClick={openContact}>
          联系我 <span aria-hidden="true">＋</span>
        </button>

        <button
          className="mobile-nav-trigger"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-site-nav"
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          <span>导航</span>
        </button>

        <div id="mobile-site-nav" className="mobile-nav-panel" hidden={!menuOpen}>
          <nav aria-label="移动端主导航">
            {nav.map((item, index) => {
              const current = isCurrent(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <button type="button" onClick={openContact}>联系我 <span aria-hidden="true">＋</span></button>
        </div>
      </header>

      <dialog className="contact-dialog" ref={dialogRef} aria-labelledby="contact-title">
        <button className="contact-dialog-close" type="button" aria-label="关闭联系面板" onClick={() => dialogRef.current?.close()}>
          <X size={22} aria-hidden="true" />
        </button>
        <div className="contact-dialog-copy">
          <p className="section-label">CONTACT / 建立联系</p>
          <h2 id="contact-title">聊聊项目、岗位，或一次值得验证的 AI 想法。</h2>
          <p>扫码添加微信，或通过邮箱与电话直接联系我。</p>
          <div className="contact-dialog-links">
            <a href="mailto:1693416144@qq.com"><span>邮箱</span><b>1693416144@qq.com</b></a>
            <a href="tel:+8613028495851"><span>电话</span><b>130 2849 5851</b></a>
          </div>
        </div>
        <figure className="contact-qr">
          <Image src="/contact/wechat-qr-yang-yifan.jpg" alt="杨逸凡的微信二维码" width={624} height={624} priority={false} unoptimized />
          <figcaption>微信扫码添加</figcaption>
        </figure>
      </dialog>
    </>
  );
}
