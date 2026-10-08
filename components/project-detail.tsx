import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import { DemoSlot } from "./demo-slot";
import { ProjectCaseStudyView } from "./project-case-study";
import { ProjectObservatory } from "./project-observatory";
import { ProjectDisclosure, ProjectTour } from "./project-tour";
import { GlobalOpinionDetail } from "./global-opinion-detail";
import { TenderPrinterDetail } from "./tender-printer-detail";
import { HotNewsRadioDetail } from "./hot-news-radio-detail";
import { DocsBookDetail } from "./docs-book-detail";
import { SalesTelephoneDetail } from "./sales-telephone-detail";
import { HumanizerEditorDetail } from "./humanizer-editor-detail";
import { RegulatoryBalanceDetail } from "./regulatory-balance-detail";

export function ProjectDetail({ project }: { project: Project }) {
  if (project.slug === "global-opinion") return <GlobalOpinionDetail project={project} />;
  if (project.slug === "tender-cleaner") return <TenderPrinterDetail project={project} />;
  if (project.slug === "hot-news-brief") return <HotNewsRadioDetail project={project} />;
  if (project.slug === "docs-system") return <DocsBookDetail project={project} />;
  if (project.slug === "sales-copilot") return <SalesTelephoneDetail project={project} />;
  if (project.slug === "humanizer") return <HumanizerEditorDetail project={project} />;
  if (project.slug === "regulatory-risk") return <RegulatoryBalanceDetail project={project} />;
  return (
    <main className="page-shell project-page">
      <div className="project-mast">
        <Link href="/work" className="back-link">← 返回工作室</Link>
        <div className="project-title-row">
          <div className="project-title-copy">
            <p className="section-label">工作室 / {project.category}</p>
            <h1>{project.title}</h1>
            <p className="lead">{project.tagline}</p>
          </div>
          <div className="project-mast-art" aria-hidden="true">
            <Image src={publicPath("/world/workshop-v2.webp")} alt="" width={512} height={512} sizes="(max-width: 48rem) 64px, 160px" />
          </div>
        </div>
      </div>

      <ProjectTour project={project} />

      <ProjectDisclosure title="观看项目演示" caption="打开视频，看看具体任务如何完成">
        <DemoSlot title={project.title} demo={project.demo} />
      </ProjectDisclosure>

      <ProjectDisclosure title="展开完整方法与证据" caption="查看工作流程、技术细节与交付边界">
        <dl className="project-mast-facts" aria-label="项目任务、判断与交付摘要">
          <div><dt>任务入口</dt><dd>{project.mastFacts.input}</dd></div>
          <div><dt>关键判断</dt><dd>{project.mastFacts.judgment}</dd></div>
          <div><dt>交付结果</dt><dd>{project.mastFacts.output}</dd></div>
        </dl>
        {project.caseStudy
          ? <ProjectCaseStudyView caseStudy={project.caseStudy} />
          : <ProjectObservatory project={project} />}
      </ProjectDisclosure>

      <div className="project-actions">
        <a href={project.github} target="_blank" rel="noreferrer">查看 GitHub ↗</a>
        <Link href="/work">回到工作室</Link>
      </div>
    </main>
  );
}
