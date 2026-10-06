"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, siteConfig } from "@/config/site";
import { cn, pad } from "@/lib/utils";

/**
 * En-tête fixe : en haut de page, `mix-blend-difference` (lisible sur les
 * sections claires comme sombres) ; dès qu'on défile, bande noire et texte blanc. Sur mobile, menu plein écran à grande typographie.
 */
/** Liens du header, dans l'ordre affiché sur desktop et dans le menu mobile. */
const headerNav = [{ href: "/", label: "Accueil" }, ...mainNav, { href: "/contact", label: "Contact" }];

/**
 * Seuil à partir duquel le menu horizontal remplace le burger : 56rem (896 px),
 * soit le breakpoint `nav:` défini dans globals.css. Les 8 liens y tiennent sans
 * débordement, y compris sur un portable affiché avec un zoom de 125 à 150 %.
 */
const NAV_MEDIA_QUERY = "(min-width: 56rem)";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const desktop = window.matchMedia(NAV_MEDIA_QUERY);
    const onResize = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Aller au contenu
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 text-white transition-[padding,background-color] duration-500",
          // Haut de page : mix-blend-difference (lisible sur fond clair comme sombre) ;
          // après défilement : bande noire opaque, texte blanc.
          scrolled && !open ? "bg-ink py-3 shadow-[0_1px_0_0_var(--color-ash)]" : "py-5 mix-blend-difference sm:py-6",
        )}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Link href="/" onClick={() => setOpen(false)} className="group flex items-baseline gap-3" aria-label={`${siteConfig.name} — accueil`}>
            <span className="text-lg font-bold tracking-tighter">{siteConfig.shortName}</span>
            <span className="hidden text-[0.7rem] font-medium uppercase tracking-[0.14em] opacity-70 transition-opacity group-hover:opacity-100 md:inline nav:hidden xl:inline">
              Responsable Digital
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden min-w-0 nav:block">
            <ul className="flex items-center gap-5 whitespace-nowrap text-sm font-medium xl:gap-8">
              {headerNav.map((item) =>
                item.href === "/contact" ? (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="inline-flex min-h-10 items-center border border-white px-4 transition-colors hover:bg-white hover:text-black"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn("link-underline py-1", isActive(item.href) && "bg-[length:100%_1px]")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="relative z-[60] flex min-h-11 min-w-11 items-center justify-end gap-3 nav:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="text-[0.7rem] font-medium uppercase tracking-[0.14em]">
              {open ? "Fermer" : "Menu"}
            </span>
            {/* 3 traits de 24 px × 2 px, espacés de 5 px ; se transforment en croix à l'ouverture */}
            <span aria-hidden="true" className="relative block h-4 w-6">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-full bg-current transition-transform duration-500",
                  open && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[7px] h-0.5 w-full bg-current transition-opacity duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-full bg-current transition-transform duration-500",
                  open && "-translate-y-[7px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-ink text-paper transition-[clip-path] duration-700 ease-in-out-quart nav:hidden",
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <nav aria-label="Navigation mobile" className="container-x flex flex-1 flex-col justify-center pt-20">
          <ul className="space-y-1">
            {headerNav.map((item, i) => (
              <li
                key={item.href}
                className={cn(
                  "transition-all duration-700 ease-out-expo",
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-1 text-[clamp(2.4rem,11vw,4rem)] font-semibold leading-none tracking-tighter"
                >
                  <span className="text-xs font-medium tabular-nums text-smoke">{pad(i + 1)}</span>
                  <span className={cn(isActive(item.href) && "underline decoration-2 underline-offset-[0.15em]")}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-x flex justify-between border-t border-ash py-6 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-smoke">
          <span>Burkina Faso</span>
          <span>{siteConfig.name}</span>
        </div>
      </div>
    </>
  );
}
