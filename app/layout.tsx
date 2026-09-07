import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";
import "./spatial.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: { default: siteConfig.name, template: "%s" },
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl("/") },
  applicationName: "AI Capability Universe",
  authors: [{ name: "杨逸凡" }],
  creator: "杨逸凡",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "杨逸凡 AI Capability Universe" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [absoluteUrl("/opengraph-image")],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer"><span>杨逸凡 · AI Capability Universe</span><a href="mailto:1693416144@qq.com">1693416144@qq.com</a><span>© 2026</span></footer>
      </body>
    </html>
  );
}
