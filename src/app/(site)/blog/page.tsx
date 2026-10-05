import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Pagination } from "@/components/blog/Pagination";
import { PageHero } from "@/components/shared/PageHero";
import { SearchIcon } from "@/components/ui/Icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { getArticles, getBlogCategories, getTags } from "@/lib/data/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ searchParams }: PageProps<"/blog">): Promise<Metadata> {
  const sp = await searchParams;
  const base = pageMetadata({
    title: "Blog",
    description: "Articles sur le marketing digital, les réseaux sociaux, l'analytics, le SEO et l'IA générative, par Abdoul Aly TAITA.",
    path: "/blog",
  });
  // Les pages filtrées / recherches ne sont pas indexées (contenu dupliqué).
  const filtered = Boolean(sp.q || sp.categorie || sp.tag || (sp.page && sp.page !== "1"));
  return filtered ? { ...base, robots: { index: false, follow: true } } : base;
}

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const sp = await searchParams;
  const q = str(sp.q).trim().slice(0, 100);
  const category = str(sp.categorie);
  const tag = str(sp.tag);
  const page = Math.max(1, Number.parseInt(str(sp.page) || "1", 10) || 1);

  const [{ items, total, pageCount }, categories, tags] = await Promise.all([
    getArticles({ page, q: q || undefined, category: category || undefined, tag: tag || undefined }),
    getBlogCategories(),
    getTags(),
  ]);

  const href = (params: Record<string, string | number | undefined>) => {
    const merged = { q, categorie: category, tag, ...params };
    const qs = new URLSearchParams(
      Object.entries(merged)
        .filter(([k, v]) => v !== undefined && v !== "" && !(k === "page" && Number(v) === 1))
        .map(([k, v]) => [k, String(v)]),
    ).toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  const activeTag = tags.find((t) => t.slug === tag);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <PageHero
        index="05"
        eyebrow="Journal"
        title={
          <>
            Le <em className="font-serif font-normal">blog</em>.
          </>
        }
        intro="Analyses, méthodes et retours d'expérience sur le marketing digital en Afrique de l'Ouest et ailleurs."
      />

      <section className="container-x pb-24 sm:pb-36" aria-label="Articles">
        {/* Recherche + filtres */}
        <div className="grid gap-6 border-y border-ink py-6 lg:grid-cols-12 lg:items-center">
          <form action="/blog" role="search" className="relative lg:col-span-4">
            <label htmlFor="blog-search" className="sr-only">
              Rechercher un article
            </label>
            <SearchIcon className="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2" />
            <input
              id="blog-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Rechercher…"
              className="min-h-12 w-full border-b border-line bg-transparent pl-8 text-lg outline-none placeholder:text-stone focus:border-ink"
            />
            {category && <input type="hidden" name="categorie" value={category} />}
          </form>
          <nav aria-label="Catégories" className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:col-span-8 lg:mx-0 lg:flex-wrap lg:justify-end lg:px-0">
            {[{ slug: "", name: "Tout" }, ...categories].map((c) => (
              <Link
                key={c.slug || "all"}
                href={href({ categorie: c.slug || undefined, page: undefined, tag: undefined })}
                aria-current={category === c.slug ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center border px-4 text-sm transition-colors",
                  category === c.slug ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                )}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>

        {(q || activeTag) && (
          <p className="mt-6 text-stone" aria-live="polite">
            {total} résultat{total > 1 ? "s" : ""}
            {q && (
              <>
                {" "}pour « <span className="text-ink">{q}</span> »
              </>
            )}
            {activeTag && (
              <>
                {" "}avec le tag <span className="text-ink">#{activeTag.name}</span>
              </>
            )}{" "}
            — <Link href="/blog" className="link-underline text-ink">réinitialiser</Link>
          </p>
        )}

        {items.length > 0 ? (
          <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((article, i) => (
              <ArticleCard key={article.id} article={article} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="mt-14 text-xl text-stone">Aucun article ne correspond à votre recherche.</p>
        )}

        <Pagination page={page} pageCount={pageCount} buildHref={(p) => href({ page: p })} />

        {tags.length > 0 && (
          <nav aria-label="Tags" className="mt-20 border-t border-line pt-6">
            <p className="eyebrow text-stone">Tags</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {tags.map((t) => (
                <li key={t.id}>
                  <Link href={href({ tag: t.slug, page: undefined, categorie: undefined, q: undefined })} className="link-underline">
                    #{t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>
    </>
  );
}
