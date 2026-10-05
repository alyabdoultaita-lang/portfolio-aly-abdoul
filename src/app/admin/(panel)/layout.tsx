import { SetupNotice } from "@/components/admin/SetupNotice";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { getUnreadCount } from "@/lib/data/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Toujours rendu à la demande : dépend de la session de l'utilisateur.
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-xl p-6 py-24">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Administration</h1>
        <SetupNotice />
      </main>
    );
  }

  const user = await requireAdmin();
  const unread = await getUnreadCount();

  return (
    <div className="lg:pl-64">
      <Sidebar email={user.email ?? ""} unread={unread} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">{children}</main>
    </div>
  );
}
