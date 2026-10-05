"use server";

import { revalidatePath } from "next/cache";
import { adminClient } from "@/lib/auth";

export async function setMessageRead(id: string, isRead: boolean) {
  const supabase = await adminClient();
  const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  const supabase = await adminClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}
