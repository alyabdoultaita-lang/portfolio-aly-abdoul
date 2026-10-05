import { saveExperience } from "@/app/admin/actions/experiences";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { AdminPageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "Nouvelle expérience" };

export default function NewExperiencePage() {
  return (
    <>
      <AdminPageHeader title="Nouvelle expérience" back={{ href: "/admin/experiences", label: "Expériences" }} />
      <ExperienceForm action={saveExperience.bind(null, null)} />
    </>
  );
}
