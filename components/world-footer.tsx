"use client";

import { usePathname } from "next/navigation";

export function WorldFooter() {
  const pathname = usePathname();
  if (pathname === "/work" || pathname === "/writing") return null;
  return <footer className="world-footer"><span>杨逸凡的世界 · 保持好奇，持续探索。</span><a href="mailto:1693416144@qq.com">1693416144@qq.com</a><span>© 2026</span></footer>;
}
