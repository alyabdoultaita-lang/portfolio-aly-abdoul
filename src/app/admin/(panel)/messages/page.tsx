import { deleteMessage, setMessageRead } from "@/app/admin/actions/messages";
import { MessageItem } from "@/components/admin/MessageItem";
import { AdminPageHeader, EmptyState } from "@/components/admin/PageHeader";
import { listMessages } from "@/lib/data/admin";

export const metadata = { title: "Messages" };

export default async function MessagesAdminPage() {
  const messages = await listMessages();
  const unread = messages.filter((m) => !m.is_read).length;
  return (
    <>
      <AdminPageHeader title="Messages" description={`${messages.length} message(s) · ${unread} non lu(s)`} />
      {messages.length === 0 ? (
        <EmptyState>Aucun message reçu pour le moment.</EmptyState>
      ) : (
        <ul className="divide-y divide-line border border-line bg-paper">
          {messages.map((m) => (
            <MessageItem
              key={m.id}
              message={m}
              toggleAction={setMessageRead.bind(null, m.id, !m.is_read)}
              deleteAction={deleteMessage.bind(null, m.id)}
            />
          ))}
        </ul>
      )}
    </>
  );
}
