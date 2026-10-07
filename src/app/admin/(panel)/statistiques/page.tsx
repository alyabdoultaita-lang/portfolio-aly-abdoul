import Link from "next/link";
import { RankedList, StatTile, VisitsChart, fmt } from "@/components/admin/AnalyticsCharts";
import { AdminPageHeader } from "@/components/admin/PageHeader";
import { getAnalytics } from "@/lib/data/admin";
import { cn } from "@/lib/utils";

export const metadata = { title: "Statistiques" };

const periods = [
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "90 jours" },
  { days: 365, label: "12 mois" },
];

const pageNames: Record<string, string> = {
  "/": "Accueil",
  "/a-propos": "À propos",
  "/experience": "Expérience",
  "/competences": "Compétences",
  "/portfolio": "Portfolio",
  "/blog": "Blog",
  "/cv": "CV",
  "/contact": "Contact",
};

function pageLabel(path: string) {
  if (pageNames[path]) return pageNames[path];
  const [, section, slug] = path.split("/");
  if (section === "blog" && slug) return `Article : ${slug.replace(/-/g, " ")}`;
  if (section === "portfolio" && slug) return `Projet : ${slug.replace(/-/g, " ")}`;
  return path;
}

const deviceNames: Record<string, string> = { mobile: "Mobile", tablet: "Tablette", desktop: "Ordinateur" };
const regions = new Intl.DisplayNames(["fr"], { type: "region" });
const countryLabel = (code: string) => {
  try {
    return regions.of(code) ?? code;
  } catch {
    return code;
  }
};

export default async function StatsPage({ searchParams }: PageProps<"/admin/statistiques">) {
  const sp = await searchParams;
  const days = periods.find((p) => String(p.days) === sp.p)?.days ?? 30;
  const data = await getAnalytics(days);

  const tabs = (
    <nav aria-label="Période" className="flex flex-wrap gap-px border border-line bg-line">
      {periods.map((p) => (
        <Link
          key={p.days}
          href={`/admin/statistiques?p=${p.days}`}
          aria-current={p.days === days ? "page" : undefined}
          className={cn("min-h-10 px-4 py-2 text-sm", p.days === days ? "bg-ink text-paper" : "bg-paper hover:bg-mist")}
        >
          {p.label}
        </Link>
      ))}
    </nav>
  );

  if (!data.ready) {
    return (
      <>
        <AdminPageHeader title="Statistiques" description="Visites, téléchargements du CV et contacts." />
        <div className="border border-ink bg-paper p-6">
          <h2 className="text-xl font-semibold">Une étape à faire dans Supabase</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-stone">
            <li>Ouvrez Supabase › SQL Editor › New query.</li>
            <li>
              Collez le contenu de <code className="bg-mist px-1">supabase/migrations/0003_analytics.sql</code> puis cliquez Run.
            </li>
            <li>Rechargez cette page : les statistiques commencent à se remplir dès la première visite.</li>
          </ol>
        </div>
      </>
    );
  }

  const { summary: s, previous } = data;
  const contactClicks = s.counts.email_click + s.counts.phone_click;

  return (
    <>
      <AdminPageHeader
        title="Statistiques"
        description="Mesure sans cookie : vos propres visites depuis ce navigateur ne sont pas comptées."
        action={tabs}
      />

      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
        <StatTile label="Pages vues" value={s.views} previous={previous.pageview} />
        <StatTile label="Visiteurs" value={s.visitors} detail="Visiteurs uniques, comptés par jour" />
        <StatTile label="Téléchargements du CV" value={s.counts.cv_download} previous={previous.cv_download} />
        <StatTile label="Messages reçus" value={s.counts.contact_message} previous={previous.contact_message} />
        <StatTile label="Clics e-mail / téléphone" value={contactClicks} detail={`${fmt(s.counts.email_click)} e-mail · ${fmt(s.counts.phone_click)} téléphone`} />
        <StatTile label="Clics vers LinkedIn" value={s.counts.linkedin_click} detail={`${fmt(s.counts.outbound_click)} autres liens externes`} />
      </div>

      <section className="mt-10 border border-line bg-paper p-4 pt-10 sm:p-6 sm:pt-12">
        <h2 className="eyebrow -mt-6 mb-8 text-stone sm:-mt-6">{days > 90 ? "Pages vues par semaine" : "Pages vues par jour"}</h2>
        <VisitsChart days={s.days} />
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <RankedList title="Pages les plus vues" items={s.pages} label={pageLabel} />
        <RankedList title="D'où viennent les visiteurs" items={s.sources} showPercent />
        <RankedList title="Appareils" items={s.devices} label={(k) => deviceNames[k] ?? k} showPercent />
        <RankedList title="Pays" items={s.countries} label={countryLabel} showPercent />
        <RankedList title="Liens cliqués (e-mail, LinkedIn, sites externes)" items={s.links} />
      </div>

      {data.truncated && <p className="mt-6 text-sm text-stone">Période très chargée : seuls les 50 000 premiers événements sont pris en compte.</p>}
    </>
  );
}
