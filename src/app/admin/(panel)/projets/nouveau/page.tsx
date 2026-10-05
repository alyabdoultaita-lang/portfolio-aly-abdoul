import { saveProject } from "@/app/admin/actions/projects";
import { AdminPageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { listProjectCategories } from "@/lib/data/admin";

export const metadata = { title: "Nouveau projet" };

export default async function NewProjectPage() {
  const categories = await listProjectCategories();
  return (
    <>
      <AdminPageHeader title="Nouveau projet" back={{ href: "/admin/projets", label: "Projets" }} />
      <ProjectForm categories={categories} action={saveProject.bind(null, null)} />
    </>
  );
}
