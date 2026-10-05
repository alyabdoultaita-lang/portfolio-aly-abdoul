import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
  dark?: boolean;
  as?: "h1" | "h2";
  className?: string;
}

/** En-tête de section éditorial : index, filet, grand titre. */
export function SectionHeader({ index, eyebrow, title, aside, dark, as: Tag = "h2", className }: SectionHeaderProps) {
  return (
    <header className={cn("mb-12 sm:mb-16", className)}>
      <div
        className={cn(
          "eyebrow flex items-center justify-between border-t pt-4",
          dark ? "border-ash text-smoke" : "border-ink text-stone",
        )}
        data-reveal="fade"
      >
        <span>
          {index && <span className={dark ? "text-paper" : "text-ink"}>{index} / </span>}
          {eyebrow}
        </span>
        {aside}
      </div>
      <Tag className="display-md mt-6 max-w-5xl" data-reveal>
        {title}
      </Tag>
    </header>
  );
}
