import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getSitemapEntries } from "@/lib/data/public";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles, projects } = await getSitemapEntries();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1, freq: "weekly" as const },
    { path: "/a-propos", priority: 0.8, freq: "monthly" as const },
    { path: "/experience", priority: 0.8, freq: "monthly" as const },
    { path: "/competences", priority: 0.7, freq: "monthly" as const },
    { path: "/portfolio", priority: 0.9, freq: "weekly" as const },
    { path: "/blog", priority: 0.9, freq: "daily" as const },
    { path: "/cv", priority: 0.7, freq: "monthly" as const },
    { path: "/contact", priority: 0.6, freq: "yearly" as const },
  ].map((r) => ({ url: `${siteConfig.url}${r.path}`, lastModified: now, changeFrequency: r.freq, priority: r.priority }));

  return [
    ...staticRoutes,
    ...projects.map((p) => ({
      url: `${siteConfig.url}/portfolio/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${siteConfig.url}/blog/${a.slug}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
