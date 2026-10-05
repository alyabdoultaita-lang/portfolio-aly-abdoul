import Link from "next/link";
import { AdminPageHeader, EmptyState, NewButton } from "@/components/admin/PageHeader";
import { listExperiences } from "@/lib/data/admin";
import { formatPeriod } from "@/lib/utils";

export const metadata = { title: "Expériences" };

export default async function ExperiencesAdminPage() {
  const experiences = await listExperiences();
  return (
    <>
      <AdminPageHeader title="Expériences" description="Timeline professionnelle." action={<NewButton href="/admin/experiences/nouveau">Nouvelle expérience</NewButton>} />
      {experiences.length === 0 ? (
        <EmptyState>Aucune expérience.</EmptyState>
      ) : (
        <ol className="divide-y divide-line border border-line bg-paper">
          {experiences.map((e) => (
            <li key={e.id}>
              <Link href={`/admin/experiences/${e.id}`} className="grid gap-1 p-4 hover:bg-mist sm:grid-cols-[1fr_auto] sm:items-center">
                <span>
                  <span className="font-medium">{e.role}</span> <span className="text-stone">— {e.company}</span>
                  {!e.is_visible && <span className="eyebrow ml-2 border border-line px-1.5 text-stone">Masquée</span>}
                </span>
                <span className="eyebrow text-stone">{formatPeriod(e.start_date, e.end_date, e.is_current)}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
