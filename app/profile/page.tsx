import Link from "next/link";
import { CapabilitySystem } from "@/components/capability-system";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "关于我｜杨逸凡",
  description: "杨逸凡：AI Skill / Agent 工作流搭建、Vibe Coding 交付与 AI 应用产品运营。",
  pathname: "/profile",
});

const capabilities = [
  ["业务抽象", "把模糊需求拆成输入、步骤、工具、输出和验收标准。"],
  ["Agent 系统", "Prompt 与上下文、Tool Use、子 Skill 编排、任务路由与异常处理。"],
  ["Vibe Coding", "借助 AI 完成 Python / JavaScript 工作流、HTML / MDX 页面、调试与测试。"],
  ["可靠性交付", "证据核验、来源审计、事实 / 假设 / 未知分层、测试用例与人工抽查。"],
  ["复用与赋能", "把个人解决过的问题沉淀为 Skill、模板、教程、案例与知识库。"],
] as const;

export default function ProfilePage() {
  return (
    <main className="page-shell profile-page">
      <header className="profile-hero"><div><p className="section-label">PROFILE / ARCHIVE</p><h1>杨逸凡</h1><p>2 年+ SaaS 技术支持、产品运营与团队管理经验。现在，我把一线业务问题沉淀为可运行、可验证、可复用的 AI 能力。</p></div><div className="profile-contact"><a href="mailto:1693416144@qq.com">1693416144@qq.com</a><span>深圳</span><a href="/resume/杨逸凡_AI工作流方向_简历.pdf" target="_blank">下载简历 PDF ↗</a></div></header>
      <CapabilitySystem capabilities={capabilities} />
      <section className="profile-record"><div><h2>教育背景</h2><p>湖南工学院｜物联网工程｜本科</p><span>2020.10—2024.06 · 专业排名前 20%</span></div><div><h2>证书</h2><p>大学英语四级｜全国计算机二级｜普通话二级甲等</p></div></section>
      <div className="page-actions"><Link href="/career">查看完整职业轨迹 →</Link><Link href="/work">进入项目宇宙 →</Link></div>
    </main>
  );
}
