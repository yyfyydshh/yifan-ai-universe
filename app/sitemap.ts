import type { MetadataRoute } from "next";
import { notes, projects } from "@/lib/site-data";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = ["/", "/work", "/career", "/notes", "/profile"];
  return [
    ...coreRoutes.map(pathname => ({ url: absoluteUrl(pathname), changeFrequency: "monthly" as const, priority: pathname === "/" ? 1 : 0.8 })),
    ...projects.map(project => ({ url: absoluteUrl(`/work/${project.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...notes.map(note => ({ url: absoluteUrl(`/notes/${note.slug}`), changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
