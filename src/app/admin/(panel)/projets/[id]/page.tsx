import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject, saveProject } from "@/app/admin/actions/projects";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminPageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProject, listProjectCategories } from "@/lib/data/admin";

export const metadata = { title: "Modifier le projet" };

export default async function EditProjectPage({ params, searchParams }: PageProps<"/admin/projets/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const [project, categories] = await Promise.all([getProject(id), listProjectCategories()]);
  if (!project) notFound();
  return (
    <>
      <AdminPageHeader
        title={project.title}
        back={{ href: "/admin/projets", label: "Projets" }}
        action={
          <div className="flex items-center gap-4">
            {project.status === "published" && (
              <Link href={`/portfolio/${project.slug}`} target="_blank" className="text-sm underline underline-offset-4">
                Voir ↗
              </Link>
            )}
            <DeleteButton action={deleteProject.bind(null, project.id)} confirmText="Supprimer définitivement ce projet ?" />
          </div>
        }
      />
      {sp.created && <p role="status" className="mb-6 bg-ink px-4 py-3 text-sm text-paper">✓ Projet créé.</p>}
      <ProjectForm project={project} categories={categories} action={saveProject.bind(null, project.id)} />
    </>
  );
}
