import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "./Icons";

type Variant = "solid" | "outline" | "ghost" | "inverse";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper border-ink hover:bg-paper hover:text-ink",
  outline: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink border-transparent hover:border-ink",
  inverse: "bg-paper text-ink border-paper hover:bg-transparent hover:text-paper",
};

const base =
  "group/btn inline-flex min-h-12 items-center justify-center gap-3 border px-6 text-sm font-semibold tracking-tight transition-colors duration-500 ease-out-expo disabled:pointer-events-none disabled:opacity-50";

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

/** Lien stylé en bouton. Les liens externes / fichiers utilisent <a>. */
export function ButtonLink({ variant = "solid", arrow = false, className, children, href, ...props }: ButtonLinkProps) {
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowIcon className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1" />}
    </>
  );
  const hrefString = typeof href === "string" ? href : "";
  if (/^(https?:|mailto:|tel:)/.test(hrefString) || hrefString.endsWith(".pdf")) {
    const external = /^https?:/.test(hrefString);
    return (
      <a
        href={hrefString}
        className={cn(base, variants[variant], className)}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        {...(props as ComponentProps<"a">)}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props}>
      {content}
    </Link>
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
}

export function Button({ variant = "solid", className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}
