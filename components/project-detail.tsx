import Link from "next/link";
import type { Project } from "@/lib/site-data";
import { DemoSlot } from "./demo-slot";
import { ProjectCaseStudyView } from "./project-case-study";
import { ProjectIcon } from "./project-icon";
import { ProjectObservatory } from "./project-observatory";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <main className="page-shell project-page">
      <div className="project-mast">
        <Link href="/work" className="back-link">← 返回项目宇宙</Link>
        <div className="project-title-row">
          <div className="project-title-copy">
            <p className="section-label">PROJECT {project.index} / {project.category}</p>
            <h1>{project.title}</h1>
            <p className="lead">{project.tagline}</p>
            <dl className="project-mast-facts" aria-label="项目任务、判断与交付摘要">
              <div><dt>01 / 任务入口</dt><dd>{project.mastFacts.input}</dd></div>
              <div><dt>02 / 关键判断</dt><dd>{project.mastFacts.judgment}</dd></div>
              <div><dt>03 / 交付结果</dt><dd>{project.mastFacts.output}</dd></div>
            </dl>
          </div>
          <aside className="project-meta" aria-label="项目元信息">
            <div className="project-meta-icon"><ProjectIcon name={project.icon} size={28} /></div>
            <p><span>档案类型</span><b>{project.category}</b></p>
            <p><span>呈现方式</span><b>能力案例</b></p>
            <div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <a href={project.github} target="_blank" rel="noreferrer">查看代码与资料 ↗</a>
          </aside>
        </div>
      </div>

      <DemoSlot title={project.title} demo={project.demo} />

      {project.caseStudy
        ? <ProjectCaseStudyView caseStudy={project.caseStudy} />
        : <ProjectObservatory project={project} />}

      <div className="project-actions">
        <a href={project.github} target="_blank" rel="noreferrer">查看 GitHub ↗</a>
        <Link href="/work">继续探索项目</Link>
      </div>
    </main>
  );
}
