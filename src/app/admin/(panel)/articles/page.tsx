import Link from "next/link";
import { EmptyState, AdminPageHeader, NewButton, StatusBadge } from "@/components/admin/PageHeader";
import { listArticles } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Articles" };

export default async function ArticlesAdminPage() {
  const articles = await listArticles();
  return (
    <>
      <AdminPageHeader title="Articles" description={`${articles.length} article(s)`} action={<NewButton href="/admin/articles/nouveau">Nouvel article</NewButton>} />
      {articles.length === 0 ? (
        <EmptyState>Aucun article pour le moment.</EmptyState>
      ) : (
        <div className="overflow-x-auto border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="eyebrow border-b border-line text-stone">
              <tr>
                <th className="p-4 font-normal">Titre</th>
                <th className="p-4 font-normal">Catégorie</th>
                <th className="p-4 font-normal">Statut</th>
                <th className="p-4 font-normal">Publication</th>
                <th className="p-4 font-normal"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0 hover:bg-mist">
                  <td className="p-4">
                    <Link href={`/admin/articles/${a.id}`} className="font-medium hover:underline">
                      {a.title}
                    </Link>
                    <p className="font-mono text-xs text-stone">/blog/{a.slug}</p>
                  </td>
                  <td className="p-4 text-stone">{a.category?.name ?? "—"}</td>
                  <td className="p-4">
                    <StatusBadge status={a.status} publishedAt={a.published_at} />
                  </td>
                  <td className="p-4 text-stone">{a.published_at ? formatDate(a.published_at) : "—"}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/articles/${a.id}`} className="underline underline-offset-4">
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
