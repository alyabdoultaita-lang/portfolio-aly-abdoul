import { deleteCertification, saveCertification } from "@/app/admin/actions/certifications";
import { CertificationForm, CertificationRow } from "@/components/admin/CertificationEditor";
import { AdminPageHeader, EmptyState } from "@/components/admin/PageHeader";
import { listCertifications } from "@/lib/data/admin";

export const metadata = { title: "Formations & certifications" };

export default async function CertificationsAdminPage() {
  const certifications = await listCertifications();
  return (
    <>
      <AdminPageHeader title="Formations & certifications" description="Affichées sur les pages À propos et CV." />
      <section className="mb-10 border border-ink bg-paper p-5">
        <h2 className="eyebrow mb-4 text-stone">Ajouter une formation ou une certification</h2>
        <CertificationForm action={saveCertification.bind(null, null)} />
      </section>
      {certifications.length === 0 ? (
        <EmptyState>Aucune formation ni certification.</EmptyState>
      ) : (
        <ul className="divide-y divide-line border border-line bg-paper">
          {certifications.map((c) => (
            <CertificationRow key={c.id} certification={c} action={saveCertification.bind(null, c.id)} deleteAction={deleteCertification.bind(null, c.id)} />
          ))}
        </ul>
      )}
    </>
  );
}
