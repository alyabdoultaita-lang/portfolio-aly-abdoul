import Link from "next/link";
import type { ReactNode } from "react";

export function AdminPageHeader({ title, description, action, back }: { title: string; description?: string; action?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-ink pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {back && (
          <Link href={back.href} className="eyebrow text-stone hover:text-ink">
            ← {back.label}
          </Link>
        )}
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-1 text-stone">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function NewButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center justify-center bg-ink px-5 text-sm font-medium text-paper hover:bg-graphite">
      + {children}
    </Link>
  );
}

export function StatusBadge({ status, publishedAt }: { status: string; publishedAt?: string | null }) {
  const scheduled = status === "published" && publishedAt && new Date(publishedAt) > new Date();
  const label = status === "draft" ? "Brouillon" : scheduled ? "Programmé" : "Publié";
  return (
    <span
      className={
        status === "draft"
          ? "eyebrow border border-line px-2 py-0.5 text-stone"
          : scheduled
            ? "eyebrow border border-ink px-2 py-0.5"
            : "eyebrow bg-ink px-2 py-0.5 text-paper"
      }
    >
      {label}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="border border-dashed border-line bg-paper p-10 text-center text-stone">{children}</p>;
}
