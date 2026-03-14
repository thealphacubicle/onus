"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type CardBrand = "visa" | "mastercard" | "amex" | "discover";

export interface AddCardInput {
  last4: string;
  brand: CardBrand;
  expMonth: number;
  expYear: number;
}

export async function addPaymentMethod(
  input: AddCardInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to add a card." };
  }

  const last4 = input.last4.replace(/\D/g, "").slice(-4);
  if (last4.length !== 4) {
    return { error: "Last 4 digits must be exactly 4 digits." };
  }

  const validBrands: CardBrand[] = ["visa", "mastercard", "amex", "discover"];
  if (!validBrands.includes(input.brand)) {
    return { error: "Invalid card brand." };
  }

  const expMonth = Math.max(1, Math.min(12, input.expMonth));
  const expYear =
    input.expYear < 100 ? 2000 + input.expYear : input.expYear;

  const { error } = await supabase.from("payment_methods").insert({
    user_id: user.id,
    last4,
    brand: input.brand,
    exp_month: expMonth,
    exp_year: expYear,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/add-payment");
  return {};
}

export async function deletePaymentMethod(
  id: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("payment_methods")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  return {};
}

export async function deleteAccount(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete account.";
    return { error: message };
  }

  await supabase.auth.signOut();
  redirect("/");
}
