"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Observateur unique pour toutes les animations au scroll.
 * Les composants serveur ajoutent simplement `data-reveal` (et éventuellement
 * `style={{ "--delay": "120ms" }}`) : aucun JS n'est envoyé par élément.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observeAll = () =>
      document.querySelectorAll("[data-reveal]:not([data-visible])").forEach((el) => io.observe(el));
    observeAll();

    // Contenus ajoutés après coup (filtres, pagination…)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
