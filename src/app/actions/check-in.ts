"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function checkInToday(): Promise<
  { success: true } | { success: false; error: "no_session" | "auth" }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "auth" };
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: sessions, error: fetchError } = await supabase
    .from("sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("scheduled_date", today)
    .limit(1);

  if (fetchError || !sessions?.length) {
    return { success: false, error: "no_session" };
  }

  const { error: updateError } = await supabase
    .from("sessions")
    .update({ checked_in: true, checked_in_at: new Date().toISOString() })
    .eq("id", sessions[0].id);

  if (updateError) {
    return { success: false, error: "no_session" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
