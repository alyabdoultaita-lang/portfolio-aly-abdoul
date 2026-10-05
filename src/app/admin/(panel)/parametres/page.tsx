import { deleteTerm, saveSettings, saveTerm } from "@/app/admin/actions/settings";
import { AdminPageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { TermManager } from "@/components/admin/TermManager";
import { cvSettings } from "@/content/cv";
import { getAdminSettings, listCategories, listTags } from "@/lib/data/admin";
import type { SiteSettings } from "@/types/content";

export const metadata = { title: "Paramètres" };

export default async function SettingsAdminPage() {
  const [stored, categories, tags] = await Promise.all([getAdminSettings(), listCategories(), listTags()]);
  // Valeurs par défaut = textes issus du CV, à personnaliser.
  const settings: SiteSettings = {
    stats: (stored.stats as SiteSettings["stats"]) ?? [],
    hero: { ...cvSettings.hero, ...(stored.hero as object) },
    contact_cta: { ...cvSettings.contact_cta, ...(stored.contact_cta as object) },
    seo: { ...cvSettings.seo, ...(stored.seo as object) },
  };

  return (
    <>
      <AdminPageHeader title="Paramètres" description="Textes globaux, statistiques, SEO et taxonomies du blog." />
      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <SettingsForm settings={settings} action={saveSettings} />
        <div className="space-y-6">
          <TermManager
            title="Catégories du blog"
            terms={categories}
            addAction={saveTerm.bind(null, "categories")}
            deleteActions={Object.fromEntries(categories.map((c) => [c.id, deleteTerm.bind(null, "categories", c.id)]))}
          />
          <TermManager
            title="Tags du blog"
            terms={tags}
            addAction={saveTerm.bind(null, "tags")}
            deleteActions={Object.fromEntries(tags.map((t) => [t.id, deleteTerm.bind(null, "tags", t.id)]))}
          />
        </div>
      </div>
    </>
  );
}
