import { deleteSkill, saveSkill } from "@/app/admin/actions/skills";
import { AdminPageHeader } from "@/components/admin/PageHeader";
import { SkillForm, SkillRow } from "@/components/admin/SkillEditor";
import { skillCategories } from "@/config/site";
import { listSkills } from "@/lib/data/admin";

export const metadata = { title: "Compétences" };

export default async function SkillsAdminPage() {
  const skills = await listSkills();
  const categories = [...new Set([...skillCategories, ...skills.map((s) => s.category)])];
  const grouped = categories
    .map((c) => [c, skills.filter((s) => s.category === c)] as const)
    .filter(([, items]) => items.length > 0);

  return (
    <>
      <AdminPageHeader title="Compétences" description={`${skills.length} compétence(s) — ★ = affichée sur l'accueil.`} />

      <section className="mb-10 border border-ink bg-paper p-5">
        <h2 className="eyebrow mb-4 text-stone">Ajouter une compétence</h2>
        <SkillForm categories={categories} action={saveSkill.bind(null, null)} />
      </section>

      <div className="space-y-8">
        {grouped.map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-2 text-xl font-semibold tracking-tight">{category}</h2>
            <ul className="divide-y divide-line border border-line bg-paper">
              {items.map((s) => (
                <SkillRow key={s.id} skill={s} categories={categories} action={saveSkill.bind(null, s.id)} deleteAction={deleteSkill.bind(null, s.id)} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
