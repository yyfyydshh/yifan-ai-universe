import { ProjectUniverse } from "@/components/project-universe";
import { SpaceField } from "@/components/space-field";
import { buildPageMetadata } from "@/lib/site-config";
import { projects } from "@/lib/site-data";

export const metadata = buildPageMetadata({
  title: "项目宇宙｜杨逸凡",
  description: "七个 AI Skill、Agent 工作流与知识工程项目：看问题、判断、系统、可靠性和真实交付。",
  pathname: "/work",
});

export default function WorkPage() {
  return (
    <main className="work-page">
      <SpaceField interactive />
      <header className="work-intro">
        <p className="section-label">PROJECT UNIVERSE</p>
        <h1>项目宇宙</h1>
        <p>点击一个项目，看它解决什么问题、如何工作，以及我如何控制可靠性。</p>
      </header>
      <ProjectUniverse />
      <div className="work-legend">{[...new Set(projects.map(project => project.category))].map(category => <span key={category}>{category} {projects.filter(project => project.category === category).length}</span>)}</div>
    </main>
  );
}
