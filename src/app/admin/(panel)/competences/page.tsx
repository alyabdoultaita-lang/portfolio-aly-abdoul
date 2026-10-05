import { deleteSkill, deleteSkillCategory, saveSkill, saveSkillCategory } from "@/app/admin/actions/skills";
import { AdminPageHeader } from "@/components/admin/PageHeader";
import { SkillCategoryForm, SkillCategoryHeader, SkillForm, SkillRow } from "@/components/admin/SkillEditor";
import { listSkillCategories, listSkills } from "@/lib/data/admin";

export const metadata = { title: "Compétences" };

export default async function SkillsAdminPage() {
  const [skills, categories] = await Promise.all([listSkills(), listSkillCategories()]);
  const unclassified = skills.filter((s) => !s.category_id || !categories.some((c) => c.id === s.category_id));

  return (
    <>
      <AdminPageHeader
        title="Compétences"
        description={`${categories.length} domaine(s) · ${skills.length - unclassified.length} compétence(s) affichée(s) · ★ = aussi sur l'accueil.`}
      />

      <section className="mb-10 border border-ink bg-paper p-5">
        <h2 className="eyebrow mb-4 text-stone">Ajouter une compétence</h2>
        {categories.length > 0 ? (
          <SkillForm categories={categories} action={saveSkill.bind(null, null)} />
        ) : (
          <p className="text-sm text-stone">Créez d&apos;abord un domaine ci-dessous (ou exécutez la migration 0002).</p>
        )}
      </section>

      <div className="space-y-10">
        {categories.map((category, i) => (
          <section key={category.id}>
            <SkillCategoryHeader
              category={category}
              index={i + 1}
              action={saveSkillCategory.bind(null, category.id)}
              deleteAction={deleteSkillCategory.bind(null, category.id)}
            />
            <ul className="divide-y divide-line border border-line bg-paper">
              {skills
                .filter((s) => s.category_id === category.id)
                .map((s) => (
                  <SkillRow key={s.id} skill={s} categories={categories} action={saveSkill.bind(null, s.id)} deleteAction={deleteSkill.bind(null, s.id)} />
                ))}
              {!skills.some((s) => s.category_id === category.id) && <li className="p-4 text-sm text-stone">Aucune compétence : ce domaine est masqué sur le site.</li>}
            </ul>
          </section>
        ))}

        {unclassified.length > 0 && (
          <section>
            <h2 className="mb-1 text-xl font-semibold tracking-tight">Non classées</h2>
            <p className="mb-2 text-sm text-stone">
              Masquées sur le site. Ouvrez « Modifier » pour les rattacher à un domaine, ou supprimez-les.
            </p>
            <ul className="divide-y divide-line border border-dashed border-line bg-paper">
              {unclassified.map((s) => (
                <SkillRow key={s.id} skill={s} categories={categories} action={saveSkill.bind(null, s.id)} deleteAction={deleteSkill.bind(null, s.id)} />
              ))}
            </ul>
          </section>
        )}

        <section className="border border-dashed border-line p-5">
          <h2 className="eyebrow mb-4 text-stone">Ajouter un domaine</h2>
          <SkillCategoryForm action={saveSkillCategory.bind(null, null)} />
        </section>
      </div>
    </>
  );
}
