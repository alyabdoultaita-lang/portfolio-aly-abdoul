import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Article, Profile } from "@/types/content";
import { absoluteUrl } from "@/lib/utils";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  tags?: string[];
}

/** Metadata complète d'une page : canonical, Open Graph et carte X/Twitter. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path, siteConfig.url);
  const images = image ? [{ url: absoluteUrl(image, siteConfig.url), width: 1200, height: 630, alt: title }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(images && { images }),
      ...(type === "article" && {
        publishedTime: publishedTime ?? undefined,
        modifiedTime: modifiedTime ?? undefined,
        authors: [siteConfig.name],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images && { images: images.map((i) => i.url) }),
    },
  };
}

// ---------------------------------------------------------------------------
// Données structurées Schema.org (JSON-LD)
// ---------------------------------------------------------------------------

export function personJsonLd(profile: Profile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    jobTitle: profile.headline,
    description: profile.short_bio ?? undefined,
    url: siteConfig.url,
    image: profile.photo_url ? absoluteUrl(profile.photo_url, siteConfig.url) : undefined,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: { "@type": "PostalAddress", addressCountry: "BF", addressLocality: profile.location ?? undefined },
    knowsLanguage: profile.languages,
    sameAs: [profile.linkedin_url, profile.twitter_url, profile.github_url, profile.website_url].filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "fr-FR",
  };
}

export function articleJsonLd(article: Article) {
  const url = absoluteUrl(`/blog/${article.slug}`, siteConfig.url);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.meta_description ?? article.excerpt ?? article.subtitle ?? undefined,
    image: article.cover_url ? absoluteUrl(article.cover_url, siteConfig.url) : undefined,
    datePublished: article.published_at ?? undefined,
    dateModified: article.updated_at ?? article.published_at ?? undefined,
    author: { "@type": "Person", name: article.author, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: article.category?.name,
    keywords: article.tags?.map((t) => t.name).join(", "),
    inLanguage: "fr-FR",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteConfig.url),
    })),
  };
}
