"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/projets", label: "Projets" },
  { href: "/admin/experiences", label: "Expériences" },
  { href: "/admin/competences", label: "Compétences" },
  { href: "/admin/certifications", label: "Formations & certifs" },
  { href: "/admin/profil", label: "Profil" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export function Sidebar({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="bg-ink text-paper lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex items-center justify-between px-5 py-4 lg:py-6">
        <Link href="/admin" className="font-bold tracking-tighter">
          A.A.T <span className="eyebrow ml-1 font-normal text-smoke">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-nav"
          className="eyebrow min-h-11 px-2 lg:hidden"
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      <nav id="admin-nav" aria-label="Administration" className={cn("flex-1 px-3 pb-4 lg:block", open ? "block" : "hidden")}>
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active(item.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-10 items-center justify-between px-3 text-sm transition-colors",
                  active(item.href) ? "bg-paper text-ink" : "text-smoke hover:bg-graphite hover:text-paper",
                )}
              >
                {item.label}
                {item.href === "/admin/messages" && unread > 0 && (
                  <span className={cn("px-1.5 font-mono text-[0.65rem]", active(item.href) ? "bg-ink text-paper" : "bg-paper text-ink")}>
                    {unread}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-ash px-3 pt-4 lg:hidden">
          <AccountBlock email={email} />
        </div>
      </nav>

      <div className="hidden border-t border-ash p-5 lg:block">
        <AccountBlock email={email} />
      </div>
    </aside>
  );
}

function AccountBlock({ email }: { email: string }) {
  return (
    <div className="space-y-3 text-sm">
      <p className="truncate text-smoke" title={email}>
        {email}
      </p>
      <div className="flex gap-4">
        <Link href="/" target="_blank" className="underline underline-offset-4">
          Voir le site ↗
        </Link>
        <form action={signOut}>
          <button type="submit" className="underline underline-offset-4">
            Déconnexion
          </button>
        </form>
      </div>
    </div>
  );
}
