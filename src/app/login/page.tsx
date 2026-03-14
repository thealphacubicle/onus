"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  // Sign up goes directly to dashboard; sign in goes to redirect param or dashboard
  const getRedirectAfterAuth = (isSignUp: boolean) => {
    if (isSignUp) return "/dashboard";
    return redirectParam ?? "/dashboard";
  };

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });
        if (signUpError) throw signUpError;
        router.push(getRedirectAfterAuth(true));
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(getRedirectAfterAuth(false));
        router.refresh();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred";
      if (message.includes("Invalid login credentials")) {
        setError("Invalid email or password.");
      } else if (message.includes("Email not confirmed")) {
        setError("Please confirm your email before signing in.");
      } else if (message.includes("already registered")) {
        setError("This email is already registered. Sign in instead.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

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
          {isSignUp ? "Create an account" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-[rgba(240,239,232,0.6)]">
          {isSignUp
            ? "Enter your details to get started."
            : "Enter your credentials to continue."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg border border-[#f07070]/50 bg-[#f07070]/10 px-4 py-3 text-sm text-[#f07070]">
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[rgba(240,239,232,0.8)]"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="mt-1 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#1a1a1d] px-4 py-2.5 text-[#f0efe8] placeholder:text-[rgba(240,239,232,0.45)] focus:border-[#c8f060] focus:outline-none focus:ring-1 focus:ring-[#c8f060]"
                placeholder="Alex Chen"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[rgba(240,239,232,0.8)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#1a1a1d] px-4 py-2.5 text-[#f0efe8] placeholder:text-[rgba(240,239,232,0.45)] focus:border-[#c8f060] focus:outline-none focus:ring-1 focus:ring-[#c8f060]"
              placeholder="alex@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[rgba(240,239,232,0.8)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#1a1a1d] px-4 py-2.5 text-[#f0efe8] placeholder:text-[rgba(240,239,232,0.45)] focus:border-[#c8f060] focus:outline-none focus:ring-1 focus:ring-[#c8f060]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#c8f060] py-3 font-medium text-[#0e0e10] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[rgba(240,239,232,0.6)]">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="font-medium text-[#c8f060] hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center">
          <div className="text-[rgba(240,239,232,0.6)]">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
