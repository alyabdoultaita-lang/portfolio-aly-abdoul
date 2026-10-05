import Link from "next/link";
import { AdminPageHeader, NewButton, StatusBadge } from "@/components/admin/PageHeader";
import { getDashboardStats, listArticles, listMessages } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [stats, articles, messages] = await Promise.all([getDashboardStats(), listArticles(), listMessages()]);

  const cards = [
    { label: "Articles", value: stats.articles, detail: `${stats.published} publiés · ${stats.scheduled} programmés · ${stats.drafts} brouillons`, href: "/admin/articles" },
    { label: "Projets", value: stats.projects, detail: "Portfolio", href: "/admin/projets" },
    { label: "Messages", value: stats.messages, detail: `${stats.unread} non lu${stats.unread > 1 ? "s" : ""}`, href: "/admin/messages" },
    { label: "Expériences", value: stats.experiences, detail: `${stats.skills} compétences · ${stats.certifications} certifications`, href: "/admin/experiences" },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Vue d'ensemble de votre contenu." action={<NewButton href="/admin/articles/nouveau">Nouvel article</NewButton>} />

      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group bg-paper p-6 transition-colors hover:bg-ink hover:text-paper">
            <p className="eyebrow text-stone group-hover:text-smoke">{c.label}</p>
            <p className="mt-3 text-6xl font-semibold tracking-tighter">{c.value}</p>
            <p className="mt-2 text-sm text-stone group-hover:text-smoke">{c.detail}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="border border-line bg-paper">
          <h2 className="eyebrow flex justify-between border-b border-line p-4 text-stone">
            Derniers articles <Link href="/admin/articles" className="text-ink underline">Tout voir</Link>
          </h2>
          <ul>
            {articles.slice(0, 6).map((a) => (
              <li key={a.id} className="border-b border-line last:border-0">
                <Link href={`/admin/articles/${a.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist">
                  <span className="truncate font-medium">{a.title}</span>
                  <StatusBadge status={a.status} publishedAt={a.published_at} />
                </Link>
              </li>
            ))}
            {articles.length === 0 && <li className="p-4 text-stone">Aucun article.</li>}
          </ul>
        </section>

        <section className="border border-line bg-paper">
          <h2 className="eyebrow flex justify-between border-b border-line p-4 text-stone">
            Derniers messages <Link href="/admin/messages" className="text-ink underline">Tout voir</Link>
          </h2>
          <ul>
            {messages.slice(0, 6).map((m) => (
              <li key={m.id} className="border-b border-line last:border-0">
                <Link href={`/admin/messages#${m.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist">
                  <span className="truncate">
                    {!m.is_read && <span className="mr-2 inline-block size-2 rounded-full bg-ink" aria-label="Non lu" />}
                    <span className="font-medium">{m.name}</span> <span className="text-stone">— {m.subject ?? m.message.slice(0, 40)}</span>
                  </span>
                  <span className="eyebrow shrink-0 text-stone">{formatDate(m.created_at)}</span>
                </Link>
              </li>
            ))}
            {messages.length === 0 && <li className="p-4 text-stone">Aucun message.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
