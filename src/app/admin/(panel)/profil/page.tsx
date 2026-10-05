import { saveProfile } from "@/app/admin/actions/profile";
import { AdminPageHeader } from "@/components/admin/PageHeader";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { getAdminProfile } from "@/lib/data/admin";

export const metadata = { title: "Profil" };

export default async function ProfileAdminPage() {
  const profile = await getAdminProfile();
  return (
    <>
      <AdminPageHeader title="Profil" description="Informations affichées sur l'ensemble du site." />
      <ProfileForm profile={profile} action={saveProfile.bind(null, profile?.id ?? null)} />
    </>
  );
}
