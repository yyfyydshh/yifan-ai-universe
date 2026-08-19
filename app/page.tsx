import Link from "next/link";
import { ProjectUniverse } from "@/components/project-universe";
import { SpaceField } from "@/components/space-field";
import { MetricReveal } from "@/components/metric-reveal";
import { metrics } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "杨逸凡｜AI Capability Universe",
  description: "把模糊的业务问题转化为可运行、可验证、可复用的 AI Skill、Agent 工作流与应用能力。",
  pathname: "/",
});

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <SpaceField />
        <div className="hero-copy">
          <h1>杨逸凡</h1>
          <p className="hero-role">AI Skill / Agent 工作流搭建<br />Vibe Coding 交付</p>
          <p className="hero-thesis">把模糊的业务问题，<br />变成可运行、可验证、可复用的 AI 能力。</p>
          <ol className="hero-capability-rail" aria-label="能力交付闭环">
            <li>需求拆解</li>
            <li>Agent / Skill 编排</li>
            <li>验证与复用</li>
          </ol>
          <div className="hero-actions">
            <Link className="button button--primary" href="/work">进入作品宇宙 <span>→</span></Link>
            <Link className="button button--ghost" href="/career">了解我的路径</Link>
          </div>
        </div>
        <div className="hero-universe">
          <ProjectUniverse
            variant="home"
            ambientAvatarSrc="/media/home/yifan-avatar-v4-ambient.png"
            revealAvatarSrc="/media/home/yifan-avatar-v5-reveal.png"
          />
        </div>
      </section>

      <section className="proof-strip" aria-labelledby="proof-title">
        <div className="proof-heading"><h2 id="proof-title">一些真实的交付证据</h2><Link href="/career">查看经历 →</Link></div>
        <MetricReveal metrics={metrics} />
      </section>

      <section className="home-argument">
        <p>AI 的价值，不在于展示一次惊艳的回答。</p>
        <h2>让 AI 真正进入业务：把复杂问题转化为有证据、可验证、可复用的能力。</h2>
        <div><Link href="/notes/agent-reliability">阅读可靠性文章 →</Link><Link href="/profile">查看能力系统 →</Link></div>
      </section>
    </main>
  );
}
