import type { ReactNode } from "react";
import type { SkillIconKey } from "@/types/content";

/** Icônes au trait, très discrètes, pour les domaines de compétences. */
const paths: Record<SkillIconKey, ReactNode> = {
  // Boussole : cap stratégique
  strategy: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  // Cible : acquisition
  acquisition: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  // Barres : data & tracking
  data: <path d="M4 20h16M7 16v-4M12 16V8M17 16v-7" />,
  // Fenêtre de navigateur : web
  web: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="1" />
      <path d="M3 8.5h18M6 6.5h.01M8.5 6.5h.01" />
    </>
  ),
  // Réseau : management
  management: (
    <>
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="5.5" cy="17.5" r="2.5" />
      <circle cx="18.5" cy="17.5" r="2.5" />
      <path d="M10.7 8.2 6.8 15.3M13.3 8.2l3.9 7.1M8 17.5h8" />
    </>
  ),
};

export function DomainIcon({ icon, className }: { icon: SkillIconKey | null; className?: string }) {
  if (!icon || !paths[icon]) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className}>
      {paths[icon]}
    </svg>
  );
}
