import Link from "next/link";
import type { Article } from "@/types/content";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatDate , delay } from "@/lib/utils";

export function ArticleCard({ article, priority }: { article: Article; priority?: boolean }) {
  return (
    <article className="group flex flex-col">
      <Link href={`/blog/${article.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[3/2] overflow-hidden bg-mist">
          {article.cover_url && (
            <SmartImage
              src={article.cover_url}
              alt={article.cover_alt ?? ""}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="img-mono object-cover"
            />
          )}
        </div>
        <div className="eyebrow mt-5 flex items-center justify-between text-stone">
          <span>{article.category?.name ?? "Article"}</span>
          <span>{article.reading_time} min</span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight">
          <span className="link-underline">{article.title}</span>
        </h3>
        {article.subtitle && <p className="mt-3 text-stone">{article.subtitle}</p>}
        <time dateTime={article.published_at ?? undefined} className="eyebrow mt-auto pt-5 text-stone">
          {formatDate(article.published_at)}
        </time>
      </Link>
    </article>
  );
}

/** Variante en liste éditoriale (page d'accueil). */
export function ArticleRow({ article, index }: { article: Article; index: number }) {
  return (
    <li className="border-b border-line" data-reveal style={delay(index * 80)}>
      <Link
        href={`/blog/${article.slug}`}
        className="group grid items-baseline gap-2 py-7 transition-[padding] duration-500 ease-out-expo hover:pl-3 sm:grid-cols-12 sm:gap-6"
      >
        <time dateTime={article.published_at ?? undefined} className="eyebrow text-stone sm:col-span-2">
          {formatDate(article.published_at)}
        </time>
        <h3 className="text-2xl font-semibold leading-tight tracking-tight sm:col-span-7 sm:text-3xl">
          {article.title}
        </h3>
        <span className="eyebrow text-stone sm:col-span-2">{article.category?.name}</span>
        <span className="eyebrow hidden text-right sm:col-span-1 sm:block">{article.reading_time} min</span>
      </Link>
    </li>
  );
}
