"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-charcoal/10 bg-ivory p-8 shadow-lg shadow-charcoal/5">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="mt-2 text-center text-xs uppercase tracking-widest2 text-charcoal/45">
        Admin Sign In
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/50">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-4 py-2.5 text-sm text-charcoal focus:border-terracotta focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/50">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-4 py-2.5 text-sm text-charcoal focus:border-terracotta focus:outline-none"
          />
        </div>

        {error ? (
          <p className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-forest to-forest-dark px-6 py-3 text-sm font-semibold text-ivory shadow-sm shadow-forest/30 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-white px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
