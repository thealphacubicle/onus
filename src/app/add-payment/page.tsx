import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AddCardForm } from "@/components/profile/AddCardForm";

const ALLOWED_REDIRECTS = ["/dashboard", "/history", "/rewards", "/profile", "/onboarding"];

export default async function AddPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/add-payment");
  }

  // Check if user already has payment method
  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  const { data: commitment } = await supabase
    .from("commitments")
    .select("id")
    .eq("user_id", user.id)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  const defaultRedirect = commitment ? "/dashboard" : "/onboarding";
  const safeRedirect =
    redirectTo && ALLOWED_REDIRECTS.includes(redirectTo) ? redirectTo : defaultRedirect;

  if (paymentMethods && paymentMethods.length > 0) {
    redirect(safeRedirect);
  }

  const redirectAfterAdd = safeRedirect;

  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <header className="border-b border-[rgba(255,255,255,0.07)] bg-[#131315]">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="font-semibold text-[#f0efe8]">
            Onus
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-semibold text-[#f0efe8]">
          Add a payment method
        </h1>
        <p className="mt-2 text-sm text-[rgba(240,239,232,0.6)]">
          We need a card on file to charge your subscription and any penalties.
          You can&apos;t use Onus without one.
        </p>

        <div className="mt-8 rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
          <p className="mb-4 text-xs text-[rgba(240,239,232,0.45)]">
            Enter the last 4 digits and expiry. Full card numbers are never
            stored.
          </p>
          <AddCardForm redirectOnSuccess={redirectAfterAdd} />
        </div>
      </main>
    </div>
  );
}
