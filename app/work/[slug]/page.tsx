import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { projects } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/site-config";

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) return {};
  return buildPageMetadata({
    title: `${project.title}｜杨逸凡`,
    description: project.tagline,
    pathname: `/work/${project.slug}`,
    image: project.demo?.poster,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
