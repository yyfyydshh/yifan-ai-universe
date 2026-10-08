import type { Metadata } from "next";
import { WorldHeader } from "@/components/world-header";
import { WorldFooter } from "@/components/world-footer";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";
import "./spatial.css";
import "./content-theme.css";
import "./world.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: { default: siteConfig.name, template: "%s" },
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl("/") },
  applicationName: "杨逸凡的世界",
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
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "杨逸凡的世界" }],
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
        <WorldHeader />
        <div id="site-main" tabIndex={-1}>{children}</div>
        <WorldFooter />
      </body>
    </html>
  );
}
