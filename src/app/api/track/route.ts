import { clientEventTypes, type EventType } from "@/lib/analytics";
import { recordEvent } from "@/lib/analytics-server";

/**
 * Reçoit les événements de visite envoyés par le navigateur (navigator.sendBeacon).
 * Répond toujours 204 : rien n'est renvoyé au visiteur.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    if (text.length > 2000) return new Response(null, { status: 204 });
    const body = JSON.parse(text) as { type?: unknown; path?: unknown; referrer?: unknown; target?: unknown };
    if (typeof body.type === "string" && clientEventTypes.includes(body.type as EventType)) {
      await recordEvent(request.headers, { ...body, type: body.type as EventType });
    }
  } catch {
    // Corps invalide : ignoré.
  }
  return new Response(null, { status: 204 });
}
