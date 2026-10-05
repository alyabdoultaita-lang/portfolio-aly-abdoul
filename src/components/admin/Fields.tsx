"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useFieldError } from "./ActionForm";

const control =
  "w-full border border-line bg-paper px-3 py-2.5 text-[0.95rem] outline-none transition-colors focus:border-ink aria-invalid:border-ink aria-invalid:bg-paper";

interface WrapperProps {
  name: string;
  label: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

function FieldWrapper({ name, label, hint, className, children }: WrapperProps) {
  const error = useFieldError(name);
  return (
    <div className={className}>
      <label htmlFor={name} className="eyebrow mb-2 block text-stone">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-stone">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs font-semibold">
          ↳ {error}
        </p>
      )}
    </div>
  );
}

type Base = { name: string; label: string; hint?: ReactNode; className?: string };

export function TextField({ name, label, hint, className, ...props }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const error = useFieldError(name);
  return (
    <FieldWrapper name={name} label={label} hint={hint} className={className}>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={control}
        {...props}
      />
    </FieldWrapper>
  );
}

export function TextArea({ name, label, hint, className, rows = 4, ...props }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const error = useFieldError(name);
  return (
    <FieldWrapper name={name} label={label} hint={hint} className={className}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(control, "resize-y leading-relaxed")}
        {...props}
      />
    </FieldWrapper>
  );
}

/** Liste « une valeur par ligne » (responsabilités, résultats…). */
export function ListField({ defaultValue, ...props }: Base & { defaultValue?: string[]; rows?: number }) {
  return <TextArea {...props} defaultValue={(defaultValue ?? []).join("\n")} hint={props.hint ?? "Une entrée par ligne."} />;
}

export function SelectField({
  name,
  label,
  hint,
  className,
  options,
  ...props
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <FieldWrapper name={name} label={label} hint={hint} className={className}>
      <select id={name} name={name} className={cn(control, "min-h-11")} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export function CheckboxField({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 size-4 accent-ink" />
      <span>
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-stone">{hint}</span>}
      </span>
    </label>
  );
}

/** Bloc de formulaire avec titre. */
export function Fieldset({ legend, children, className }: { legend: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cn("border border-line bg-paper p-5 sm:p-6", className)}>
      <legend className="eyebrow bg-ink px-2 py-1 text-paper">{legend}</legend>
      <div className="mt-2 grid gap-5">{children}</div>
    </fieldset>
  );
}
