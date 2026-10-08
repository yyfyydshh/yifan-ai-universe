import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { projects } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import "./studio-projects.css";

export const studioTools: Record<string, { asset: string; action: string; label: string }> = {
  "global-opinion": { asset: "studio-globe", label: "舆情观察台", action: "补齐证据，看看报告能否过关" },
  "sales-copilot": { asset: "studio-chat", label: "客户会客桌", action: "听客户怎么说，更新需求与下一步" },
  "docs-system": { asset: "tour-notebook", label: "产品文档手册", action: "翻翻书签，查看中文文档与项目仓库" },
  "regulatory-risk": { asset: "studio-shield", label: "规则检查台", action: "匹配业务与条件，判断规则是否适用" },
  "tender-cleaner": { asset: "studio-scanner", label: "公告打印机", action: "放入公告，打印 29 个字段，点字段找原文" },
  "hot-news-brief": { asset: "studio-radio", label: "新闻收音机", action: "选频道、拨旋钮，点快报查看消息出处" },
  humanizer: { asset: "studio-pen", label: "文字修订本", action: "试着改一段文字，看看事实有没有改变" },
};

/** The computer is a direct-access alternative to exploring the room. */
export function StudioProjects() {
  return <div className="studio-computer-content">
    <div className="studio-computer-path"><FolderOpen size={18} aria-hidden="true"/><span>我的电脑 <i>/</i> 工作室 <i>/</i> 项目</span><b>7 个项目</b></div>
    <section className="studio-table" aria-label="电脑中的项目">
      {projects.map(project => {
        const tool = studioTools[project.slug];
        return <Link className="studio-tool" key={project.slug} href={`/work/${project.slug}`} aria-label={`体验${project.shortTitle}：${tool.action}`}>
          <div className="studio-tool-object"><Image src={publicPath(`/world/${tool.asset}.webp`)} alt="" width={240} height={240} sizes="(max-width: 600px) 96px, 130px" unoptimized/></div>
          <span className="studio-tool-nickname">{tool.label}</span>
          <h3>{project.shortTitle}</h3>
          <p>{tool.action}</p>
          <span className="studio-tool-open">打开项目 <ArrowRight size={15} aria-hidden="true"/></span>
        </Link>;
      })}
    </section>
    <details className="studio-directory"><summary>查看完整项目目录 <span>7 个项目</span></summary><div>{projects.map(project=><Link key={project.slug} href={`/work/${project.slug}`}><span><b>{project.title}</b><small>{project.tagline}</small></span><ArrowRight size={20} aria-hidden="true"/></Link>)}</div></details>
  </div>;
}
