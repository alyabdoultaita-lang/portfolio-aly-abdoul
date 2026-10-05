"use client";

import { useState } from "react";

/** Partage social via liens natifs (aucun script tiers chargé). */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  return (
    <div>
      <p className="eyebrow text-stone">Partager</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Partager sur ${l.label}`}
              className="inline-flex min-h-10 items-center border border-line px-3 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-10 items-center border border-line px-3 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <span aria-live="polite">{copied ? "Lien copié ✓" : "Copier le lien"}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
