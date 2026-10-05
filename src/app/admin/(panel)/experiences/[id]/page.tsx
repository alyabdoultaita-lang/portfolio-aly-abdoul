import { notFound } from "next/navigation";
import { deleteExperience, saveExperience } from "@/app/admin/actions/experiences";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { AdminPageHeader } from "@/components/admin/PageHeader";
import { getExperience } from "@/lib/data/admin";

export const metadata = { title: "Modifier l'expérience" };

export default async function EditExperiencePage({ params }: PageProps<"/admin/experiences/[id]">) {
  const { id } = await params;
  const experience = await getExperience(id);
  if (!experience) notFound();
  return (
    <>
      <AdminPageHeader
        title={experience.role}
        description={experience.company}
        back={{ href: "/admin/experiences", label: "Expériences" }}
        action={<DeleteButton action={deleteExperience.bind(null, experience.id)} />}
      />
      <ExperienceForm experience={experience} action={saveExperience.bind(null, experience.id)} />
    </>
  );
}
