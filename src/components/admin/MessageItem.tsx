"use client";

import { useTransition } from "react";
import type { Message } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "./DeleteButton";

export function MessageItem({
  message,
  toggleAction,
  deleteAction,
}: {
  message: Message;
  toggleAction: () => Promise<void>;
  deleteAction: () => Promise<void>;
}) {
  const [pending, start] = useTransition();
  const subject = message.subject || "Sans objet";

  return (
    <li id={message.id} className="scroll-mt-6">
      <details
        className="group"
        onToggle={(e) => {
          // Marque comme lu à l'ouverture
          if ((e.currentTarget as HTMLDetailsElement).open && !message.is_read) start(() => toggleAction());
        }}
      >
        <summary className="flex cursor-pointer list-none items-center gap-4 p-4 hover:bg-mist">
          <span className={message.is_read ? "size-2 shrink-0" : "size-2 shrink-0 rounded-full bg-ink"} aria-label={message.is_read ? "Lu" : "Non lu"} />
          <span className="min-w-0 flex-1">
            <span className={message.is_read ? "block truncate" : "block truncate font-semibold"}>
              {message.name} — {subject}
            </span>
            <span className="block truncate text-sm text-stone">{message.message}</span>
          </span>
          <span className="eyebrow shrink-0 text-stone">{formatDate(message.created_at)}</span>
        </summary>
        <div className="border-t border-line bg-mist/50 p-5">
          <p className="text-sm text-stone">
            De <strong className="text-ink">{message.name}</strong> &lt;
            <a href={`mailto:${message.email}`} className="underline">
              {message.email}
            </a>
            &gt; — {new Date(message.created_at).toLocaleString("fr-FR")}
          </p>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed">{message.message}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`}
              className="inline-flex min-h-10 items-center bg-ink px-4 text-sm text-paper"
            >
              Répondre par e-mail
            </a>
            <button type="button" disabled={pending} onClick={() => start(() => toggleAction())} className="min-h-10 px-2 text-sm underline underline-offset-4">
              {message.is_read ? "Marquer non lu" : "Marquer lu"}
            </button>
            <DeleteButton action={deleteAction} confirmText="Supprimer ce message ?" />
          </div>
        </div>
      </details>
    </li>
  );
}
