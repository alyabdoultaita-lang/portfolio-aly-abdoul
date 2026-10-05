import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteArticle, saveArticle } from "@/app/admin/actions/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminPageHeader, StatusBadge } from "@/components/admin/PageHeader";
import { getArticle, listCategories } from "@/lib/data/admin";

export const metadata = { title: "Modifier l'article" };

export default async function EditArticlePage({ params, searchParams }: PageProps<"/admin/articles/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const [article, categories] = await Promise.all([getArticle(id), listCategories()]);
  if (!article) notFound();

  return (
    <>
      <AdminPageHeader
        title={article.title}
        back={{ href: "/admin/articles", label: "Articles" }}
        action={
          <div className="flex items-center gap-4">
            <StatusBadge status={article.status} publishedAt={article.published_at} />
            {article.status === "published" && (
              <Link href={`/blog/${article.slug}`} target="_blank" className="text-sm underline underline-offset-4">
                Voir ↗
              </Link>
            )}
            <DeleteButton action={deleteArticle.bind(null, article.id)} confirmText="Supprimer définitivement cet article ?" />
          </div>
        }
      />
      {sp.created && <p role="status" className="mb-6 bg-ink px-4 py-3 text-sm text-paper">✓ Article créé.</p>}
      <ArticleForm article={article} categories={categories} action={saveArticle.bind(null, article.id)} />
    </>
  );
}
