import { getArticleBySlug } from "@/lib/data/public";
import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "Article du blog d'Abdoul Aly TAITA";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return renderOgImage({
    eyebrow: article?.category?.name ?? "Blog",
    title: article?.title ?? "Blog",
    footer: article ? `${article.reading_time} min de lecture` : undefined,
  });
}
