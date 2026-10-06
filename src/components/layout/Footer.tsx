import Link from "next/link";
import { mainNav, siteConfig } from "@/config/site";
import type { Profile } from "@/types/content";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

export function Footer({ profile }: { profile: Profile }) {
  const socials = [
    { label: "LinkedIn", href: profile.linkedin_url },
    { label: "X / Twitter", href: profile.twitter_url },
    { label: "GitHub", href: profile.github_url },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="container-x pt-20 sm:pt-28">
        <div className="grid gap-12 border-t border-ash pt-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-smoke">Contact</p>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="link-underline mt-4 inline-block break-all text-2xl font-medium tracking-tight sm:text-3xl"
              >
                {profile.email}
              </a>
            )}
            {profile.location && <p className="mt-4 text-smoke">{profile.location}</p>}
          </div>

          <nav aria-label="Plan du site" className="md:col-span-4">
            <p className="eyebrow text-smoke">Navigation</p>
            <ul className="mt-4 grid grid-cols-2 gap-y-2">
              {[{ href: "/", label: "Accueil" }, ...mainNav, { href: "/contact", label: "Contact" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow text-smoke">Réseaux</p>
            <ul className="mt-4 space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2">
                    <span className="link-underline">{s.label}</span>
                    <ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Signature typographique géante */}
      <p
        aria-hidden="true"
        className="mt-16 select-none whitespace-nowrap text-center text-[17.5vw] font-bold leading-[0.75] tracking-[-0.06em] text-graphite"
      >
        TAITA<span className="font-serif font-normal italic">.</span>
      </p>

      <div className="container-x eyebrow flex flex-col gap-2 border-t border-ash py-6 text-smoke sm:flex-row sm:justify-between">
        <span>
          © {new Date().getFullYear()} {siteConfig.name}
        </span>
        <span>{profile.location || "Ouagadougou, Burkina Faso"}</span>
      </div>
    </footer>
  );
}
