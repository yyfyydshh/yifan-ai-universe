import Link from "next/link";
import { CareerTrajectory } from "@/components/career-trajectory";
import { careerFoundation } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "职业轨迹｜杨逸凡",
  description: "从一线 SaaS 技术支持、系统排查与团队交付，走向 AI Skill、Agent 工作流和场景建设。",
  pathname: "/career",
});

export default function CareerPage() {
  return (
    <main className="page-shell career-page">
      <header className="page-intro">
        <p className="section-label">CAREER EVOLUTION</p>
        <h1>职业轨迹</h1>
        <p>从一线客户问题、系统排查与团队交付，逐步走向 AI 场景建设。</p>
        <dl className="career-overview" aria-label="职业概览">
          {careerFoundation.overview.map(item => (
            <div key={item.value}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </header>
      <CareerTrajectory />
      <section className="career-foundation" aria-labelledby="career-foundation-title">
        <div>
          <p>FOUNDATION</p>
          <h2 id="career-foundation-title">教育与基础证明</h2>
        </div>
        <dl>
          <div>
            <dt>教育经历</dt>
            <dd>
              <strong>{careerFoundation.education.school}</strong>
              <span>{careerFoundation.education.degree}</span>
              <span>{careerFoundation.education.period}｜{careerFoundation.education.result}</span>
            </dd>
          </div>
          <div>
            <dt>证书</dt>
            <dd>{careerFoundation.certificates.join("｜")}</dd>
          </div>
        </dl>
      </section>
      <div className="page-actions"><Link href="/work">看这些能力如何落在项目里 →</Link></div>
    </main>
  );
}
