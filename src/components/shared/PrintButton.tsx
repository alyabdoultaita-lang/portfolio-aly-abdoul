"use client";

import { PrintIcon } from "@/components/ui/Icons";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-12 items-center justify-center gap-3 border border-ink px-6 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
    >
      Imprimer / PDF <PrintIcon className="size-4" />
    </button>
  );
}
