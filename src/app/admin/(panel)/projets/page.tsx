import Link from "next/link";
import { deleteProjectCategory, saveProjectCategory } from "@/app/admin/actions/projects";
import { AdminPageHeader, EmptyState, NewButton, StatusBadge } from "@/components/admin/PageHeader";
import { TermManager } from "@/components/admin/TermManager";
import { listProjectCategories, listProjects } from "@/lib/data/admin";

export const metadata = { title: "Projets" };

export default async function ProjectsAdminPage() {
  const [projects, categories] = await Promise.all([listProjects(), listProjectCategories()]);
  return (
    <>
      <AdminPageHeader title="Projets" description={`${projects.length} projet(s)`} action={<NewButton href="/admin/projets/nouveau">Nouveau projet</NewButton>} />
      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div>
          {projects.length === 0 ? (
            <EmptyState>Aucun projet pour le moment.</EmptyState>
          ) : (
            <ul className="divide-y divide-line border border-line bg-paper">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/projets/${p.id}`} className="flex items-center gap-4 p-4 hover:bg-mist">
                    <span className="size-14 shrink-0 bg-mist bg-cover bg-center grayscale" style={p.cover_url ? { backgroundImage: `url("${p.cover_url}")` } : undefined} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{p.title}</span>
                      <span className="text-sm text-stone">
                        {p.category?.name ?? "Sans catégorie"} {p.is_featured && "· ★ Mis en avant"}
                      </span>
                    </span>
                    <StatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <TermManager
          title="Catégories de projets"
          terms={categories}
          addAction={saveProjectCategory}
          deleteActions={Object.fromEntries(categories.map((c) => [c.id, deleteProjectCategory.bind(null, c.id)]))}
        />
      </div>
    </>
  );
}
