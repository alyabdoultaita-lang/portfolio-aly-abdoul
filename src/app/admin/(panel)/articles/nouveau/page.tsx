import { saveArticle } from "@/app/admin/actions/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { AdminPageHeader } from "@/components/admin/PageHeader";
import { listCategories } from "@/lib/data/admin";

export const metadata = { title: "Nouvel article" };

export default async function NewArticlePage() {
  const categories = await listCategories();
  return (
    <>
      <AdminPageHeader title="Nouvel article" back={{ href: "/admin/articles", label: "Articles" }} />
      <ArticleForm categories={categories} action={saveArticle.bind(null, null)} />
    </>
  );
}
