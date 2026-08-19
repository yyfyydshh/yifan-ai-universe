import type { Metadata } from "next";

const developmentURL = "http://127.0.0.1:3010";
const configuredURL = process.env.SITE_URL?.trim();
const publicBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const resolvedURL = configuredURL || developmentURL;

export const siteConfig = {
  name: "杨逸凡｜AI Capability Universe",
  shortName: "杨逸凡",
  description: "AI Skill / Agent 工作流搭建、Vibe Coding 交付与 AI 应用产品运营作品集。",
  url: new URL(resolvedURL.endsWith("/") ? resolvedURL : `${resolvedURL}/`),
  email: "1693416144@qq.com",
  phone: "13028495851",
};

export function absoluteUrl(pathname = "/") {
  const relativePath = pathname === "/" ? "" : pathname.replace(/^\/+/, "");
  return new URL(relativePath, siteConfig.url).toString();
}

export function publicPath(pathname: string) {
  if (!pathname.startsWith("/")) return pathname;
  return `${publicBasePath}${pathname}`;
}

export function buildPageMetadata({
  title,
  description,
  pathname,
  image = "/opengraph-image",
  type = "website",
}: {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const canonical = absoluteUrl(pathname);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      locale: "zh_CN",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${title} 分享图` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
