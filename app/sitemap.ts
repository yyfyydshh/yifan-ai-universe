import type { MetadataRoute } from "next";
import { notes, projects } from "@/lib/site-data";
import { absoluteUrl } from "@/lib/site-config";
import { getNoteHref } from "@/lib/content-index";
import { zones } from "@/lib/world-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = ["/", ...zones.map(zone => zone.route), "/career", "/notes", "/profile"];
  return [
    ...coreRoutes.map(pathname => ({ url: absoluteUrl(pathname), changeFrequency: "monthly" as const, priority: pathname === "/" ? 1 : 0.8 })),
    ...projects.map(project => ({ url: absoluteUrl(`/work/${project.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...notes.map(note => ({ url: absoluteUrl(getNoteHref(note)), changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
