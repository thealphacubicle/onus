import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/history",
  "/rewards",
  "/onboarding",
  "/profile",
  "/add-payment",
];

const ROUTES_REQUIRING_PAYMENT = [
  "/dashboard",
  "/history",
  "/rewards",
  "/profile",
  "/onboarding",
];

function isProtected(pathname: string) {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  if (isProtected(pathname) && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return Response.redirect(redirectUrl);
  }

  // No payment on file: block all protected app routes, redirect to add-payment
  if (
    user &&
    ROUTES_REQUIRING_PAYMENT.some(
      (r) => pathname === r || pathname.startsWith(`${r}/`)
    )
  ) {
    const { data: paymentMethods } = await supabase
      .from("payment_methods")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);
    if (!paymentMethods || paymentMethods.length === 0) {
      return Response.redirect(new URL("/add-payment", request.url));
    }
  }

  // Has payment on file and on add-payment page: redirect to dashboard or onboarding
  if (user && pathname === "/add-payment") {
    const { data: paymentMethods } = await supabase
      .from("payment_methods")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);
    if (paymentMethods && paymentMethods.length > 0) {
      const { data: commitment } = await supabase
        .from("commitments")
        .select("id")
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();
      return Response.redirect(
        new URL(commitment ? "/dashboard" : "/onboarding", request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
