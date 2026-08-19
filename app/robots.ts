import type { MetadataRoute } from "next";
import { absoluteUrl, publicPath } from "@/lib/site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: publicPath("/"), disallow: [publicPath("/lab")] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
