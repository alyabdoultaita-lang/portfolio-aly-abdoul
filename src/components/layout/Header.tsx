"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, siteConfig } from "@/config/site";
import { cn, pad } from "@/lib/utils";

/**
 * En-tête fixe en `mix-blend-difference` : il reste lisible sur les sections
 * claires comme sombres. Sur mobile, menu plein écran à grande typographie.
 */
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
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

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
          "fixed inset-x-0 top-0 z-50 text-white mix-blend-difference transition-[padding] duration-500",
          scrolled ? "py-3" : "py-5 sm:py-6",
        )}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Link href="/" onClick={() => setOpen(false)} className="group flex items-baseline gap-3" aria-label={`${siteConfig.name} — accueil`}>
            <span className="text-lg font-bold tracking-tighter">{siteConfig.shortName}</span>
            <span className="eyebrow hidden opacity-70 transition-opacity group-hover:opacity-100 md:inline">
              Responsable Digital
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn("link-underline py-1", isActive(item.href) && "bg-[length:100%_1px]")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="inline-flex min-h-10 items-center border border-white px-4 transition-colors hover:bg-white hover:text-black"
                >
                  Me contacter
                </Link>
              </li>
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="relative z-[60] flex min-h-11 min-w-11 items-center justify-end gap-3 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="eyebrow">{open ? "Fermer" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500",
                  open && "translate-y-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500",
                  open && "-translate-y-1.5 -rotate-45",
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
          "fixed inset-0 z-40 flex flex-col bg-ink text-paper transition-[clip-path] duration-700 ease-in-out-quart lg:hidden",
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <nav aria-label="Navigation mobile" className="container-x flex flex-1 flex-col justify-center pt-20">
          <ul className="space-y-1">
            {[...mainNav, { href: "/contact", label: "Contact" }].map((item, i) => (
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
                  <span className="font-mono text-xs text-smoke">{pad(i + 1)}</span>
                  <span className={cn(isActive(item.href) && "font-serif font-normal italic")}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-x eyebrow flex justify-between border-t border-ash py-6 text-smoke">
          <span>Burkina Faso</span>
          <span>{siteConfig.coordinates}</span>
        </div>
      </div>
    </>
  );
}
