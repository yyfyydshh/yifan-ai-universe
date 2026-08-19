import Link from "next/link";
import { CapabilitySystem } from "@/components/capability-system";
import { buildPageMetadata, publicPath } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "关于我｜杨逸凡",
  description: "杨逸凡：AI Skill / Agent 工作流搭建、Vibe Coding 交付与 AI 应用产品运营。",
  pathname: "/profile",
});

const capabilities = [
  ["产品意识与业务拆解", "从用户需求、业务目标与实际使用链路出发判断问题；结合反馈、服务记录和业务数据识别核心矛盾，再拆成可落地的需求、方案与验收标准。"],
  ["AI 产品与 Agent 设计", "熟悉 Prompt、上下文设计、Tool Use / Function Calling、MCP 与 Skill / Agent 编排；会为具体场景明确输入输出、执行边界、异常处理与质量标准。"],
  ["原型验证与项目推进", "借助 Codex、ChatGPT 等工具完成页面、工作流、数据处理、API 验证与功能 Demo；同步推进流程梳理、测试跟踪和跨产品、研发、运营、客户的信息协作。"],
  ["数据验证与质量控制", "围绕产品目标设计指标和验证方式，持续审视数据、失败案例、异常场景与用户反馈；重视证据、准确性、稳定性、异常处理和验收结果。"],
  ["结果导向与能力沉淀", "不止完成一次需求，更把可复用的方法抽象为模板、标准、Skill 或工具，让业务理解、用户洞察、数据分析和 AI 能力转化为团队可持续使用的产品能力。"],
] as const;

export default function ProfilePage() {
  return (
    <main className="page-shell profile-page">
      <header className="profile-hero"><div><p className="section-label">PROFILE / ARCHIVE</p><h1>杨逸凡</h1><p>2 年+ SaaS 技术支持、产品运营与团队管理经验。以产品意识理解业务，以 AI 能力加速验证；把一线问题推进为可落地方案，并沉淀为可运行、可验证、可复用的产品能力。</p></div><div className="profile-contact"><a href="mailto:1693416144@qq.com">1693416144@qq.com</a><span>深圳</span><a href={publicPath("/resume/杨逸凡_AI工作流方向_简历.pdf")} target="_blank">下载简历 PDF ↗</a></div></header>
      <CapabilitySystem capabilities={capabilities} />
      <section className="profile-record"><div><h2>教育背景</h2><p>湖南工学院｜物联网工程｜本科</p><span>2020.10—2024.06 · 专业排名前 20%</span></div><div><h2>证书</h2><p>大学英语四级｜全国计算机二级｜普通话二级甲等</p></div></section>
      <div className="page-actions"><Link href="/career">查看完整职业轨迹 →</Link><Link href="/work">进入项目宇宙 →</Link></div>
    </main>
  );
}
