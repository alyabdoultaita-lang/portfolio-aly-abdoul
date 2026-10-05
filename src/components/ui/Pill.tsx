import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Pill({ children, dark, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider",
        dark ? "border-ash text-smoke" : "border-line text-stone",
        className,
      )}
    >
      {children}
    </span>
  );
}
