"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MaterialIcon } from "@/components/ui/material-icon";
import { loginUser, registerUser } from "@/lib/api";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/trips";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await loginUser(email, password);
      } else {
        await registerUser(email, password, fullName);
      }
      router.push(redirectUrl);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-surface-container-low px-4 py-20 pt-24">
        <div className="w-full max-w-md rounded-3xl border border-surface-container-highest bg-surface-container-lowest p-6 shadow-xl sm:p-10">
          <div className="mb-6 text-center">
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-1 font-body-sm text-body-sm text-secondary">
              {mode === "login"
                ? "Sign in to access and manage your saved trips."
                : "Join Roamly to plan, customize, and save trips."}
            </p>
          </div>

          <div className="mb-6 flex border-b border-surface-container-highest">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 pb-3 font-label-md text-label-md font-semibold transition-colors ${
                mode === "login"
                  ? "border-b-2 border-primary-container text-primary-container"
                  : "text-secondary hover:text-on-surface"
              }`}
              type="button"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 pb-3 font-label-md text-label-md font-semibold transition-colors ${
                mode === "register"
                  ? "border-b-2 border-primary-container text-primary-container"
                  : "text-secondary hover:text-on-surface"
              }`}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-2 rounded-xl border border-status-error/20 bg-status-error/10 p-3.5 text-status-error"
            >
              <MaterialIcon className="shrink-0 text-[18px]" name="info" />
              <span className="font-body-sm text-body-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label
                  className="mb-1 block font-label-sm text-label-sm font-medium text-on-surface"
                  htmlFor="fullName"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="h-11 w-full rounded-xl border border-surface-container-highest bg-surface-container-lowest px-3.5 font-body-md text-body-md text-on-surface placeholder:text-secondary focus:border-on-surface focus:outline-none"
                />
              </div>
            )}

            <div>
              <label
                className="mb-1 block font-label-sm text-label-sm font-medium text-on-surface"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-11 w-full rounded-xl border border-surface-container-highest bg-surface-container-lowest px-3.5 font-body-md text-body-md text-on-surface placeholder:text-secondary focus:border-on-surface focus:outline-none"
              />
            </div>

            <div>
              <label
                className="mb-1 block font-label-sm text-label-sm font-medium text-on-surface"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-surface-container-highest bg-surface-container-lowest px-3.5 font-body-md text-body-md text-on-surface placeholder:text-secondary focus:border-on-surface focus:outline-none"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-4 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="font-body-sm text-body-sm text-secondary hover:text-on-surface"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

