"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, Moon, Sun } from "lucide-react";
import { publicPath } from "@/lib/site-config";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWorldStore } from "@/lib/world-store";
import { WorldPanels } from "./world-panels";
import { WorldTransition } from "./world-transition";

export function WorldHeader() {
  const pathname=usePathname();
  const immersive=pathname==="/"||pathname==="/work"||pathname==="/writing";
  const theme = useWorldStore(s => s.theme);
  const setPanel = useWorldStore(s => s.setPanel);
  useEffect(() => {
    try { if(localStorage.getItem("yifan-world-theme") === "night") useWorldStore.getState().setTheme("night"); } catch { /* Storage is optional. */ }
    const apply = () => {
      const value=useWorldStore.getState().theme;
      document.documentElement.dataset.theme=value;
      try { localStorage.setItem("yifan-world-theme",value); } catch { /* Private browsing can disable storage. */ }
    };
    apply(); return useWorldStore.subscribe(apply);
  }, []);
  return <>
    <a className="skip-link" href="#site-main">跳到主要内容</a>
    {pathname!=="/" && <header className={`world-header ${immersive?"world-header--immersive":""} ${pathname === "/work" || pathname === "/writing" ? "world-header--studio" : ""}`}>
      <Link className="world-brand" href="/" aria-label="杨逸凡的世界首页"><Image src={publicPath("/site-icon.png")} width={32} height={32} alt="" unoptimized/><span>杨逸凡的世界</span></Link>
      <nav aria-label="主导航"><button aria-label="区域目录" onClick={() => setPanel("directory")} className="directory-trigger"><Menu size={20}/><span>区域目录</span></button><button className="profile-trigger" onClick={() => setPanel("profile")}>快速了解我</button><button className="icon-button theme-toggle" aria-label={theme === "day" ? "切换到夜晚" : "切换到白天"} onClick={() => useWorldStore.getState().setTheme(theme === "day" ? "night" : "day")}>{theme === "day" ? <Sun size={26}/> : <Moon size={24}/>}</button></nav>
    </header>}<WorldPanels /><WorldTransition/>
  </>;
}
