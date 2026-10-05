import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { JsonLd } from "@/components/ui/JsonLd";
import { SmartImage } from "@/components/ui/SmartImage";
import { siteConfig } from "@/config/site";
import { getArticleBySlug, getArticles, getRelatedArticles } from "@/lib/data/public";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { delay, formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const { items } = await getArticles({ pageSize: 50 });
  return items.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  // L'image Open Graph est générée par ./opengraph-image.tsx
  return pageMetadata({
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || article.subtitle || article.title,
    path: `/blog/${article.slug}`,
    type: "article",
    publishedTime: article.published_at,
    modifiedTime: article.updated_at,
    tags: article.tags?.map((t) => t.name),
  });
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article);
  const url = `${siteConfig.url}/blog/${article.slug}`;

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(article),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: article.title, path: `/blog/${article.slug}` },
          ]),
        ]}
      />

      <article>
        <header className="container-x pt-32 sm:pt-40">
          <nav aria-label="Fil d'Ariane" className="eyebrow fade-up flex flex-wrap justify-between gap-2 border-b border-ink pb-4 text-stone">
            <span>
              <Link href="/blog" className="link-underline">
                Blog
              </Link>
              {article.category && (
                <>
                  {" / "}
                  <Link href={`/blog?categorie=${article.category.slug}`} className="link-underline text-ink">
                    {article.category.name}
                  </Link>
                </>
              )}
            </span>
            <span>{article.reading_time} min de lecture</span>
          </nav>

          <div className="mx-auto max-w-5xl">
            <h1 className="mt-12 text-[clamp(2.4rem,6.5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              <span className="line-mask">
                <span style={delay(80)}>{article.title}</span>
              </span>
            </h1>
            {article.subtitle && (
              <p className="fade-up mt-8 font-serif text-2xl italic leading-tight text-graphite sm:text-3xl" style={delay(300)}>
                {article.subtitle}
              </p>
            )}
            <div className="eyebrow fade-up mt-10 flex flex-wrap gap-x-8 gap-y-2 text-stone" style={delay(400)}>
              <span>
                Par <span className="text-ink">{article.author}</span>
              </span>
              <time dateTime={article.published_at ?? undefined}>{formatDate(article.published_at)}</time>
            </div>
          </div>
        </header>

        {article.cover_url && (
          <figure className="container-x mt-12">
            <div className="unveil relative aspect-[16/9] overflow-hidden bg-mist" style={delay(250)}>
              <SmartImage src={article.cover_url} alt={article.cover_alt ?? ""} fill priority sizes="100vw" className="object-cover grayscale" />
            </div>
            {article.cover_alt && <figcaption className="eyebrow mt-3 text-stone">{article.cover_alt}</figcaption>}
          </figure>
        )}

        <div className="container-x py-16 sm:py-24">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-12">
            <aside className="order-2 lg:order-1 lg:col-span-3">
              <div className="space-y-8 lg:sticky lg:top-28">
                <ShareButtons url={url} title={article.title} />
                {article.tags && article.tags.length > 0 && (
                  <div>
                    <p className="eyebrow text-stone">Tags</p>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                      {article.tags.map((t) => (
                        <li key={t.id}>
                          <Link href={`/blog?tag=${t.slug}`} className="link-underline">
                            #{t.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
            <div
              className="prose-editorial order-1 lg:order-2 lg:col-span-9"
              dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
            />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <aside className="border-t border-ink bg-mist py-20 sm:py-28" aria-labelledby="related-title">
          <div className="container-x">
            <h2 id="related-title" className="display-md">
              À lire <em className="font-serif font-normal">aussi</em>.
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
