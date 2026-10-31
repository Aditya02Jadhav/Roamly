"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { loginUser, registerUser, type AuthUser } from "@/lib/api";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
};

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await loginUser(email, password);
        onSuccess(res.user);
      } else {
        const res = await registerUser(email, password, fullName);
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-surface-container-highest bg-surface-container-lowest p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-surface-container"
        >
          <MaterialIcon className="text-xl" name="close" />
        </button>

        <div className="flex border-b border-surface-container-highest pb-3">
          <button
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 pb-2 font-label-lg text-label-lg font-bold transition-colors ${
              mode === "login"
                ? "border-b-2 border-primary-container text-primary-container"
                : "text-secondary hover:text-on-surface"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 pb-2 font-label-lg text-label-lg font-bold transition-colors ${
              mode === "register"
                ? "border-b-2 border-primary-container text-primary-container"
                : "text-secondary hover:text-on-surface"
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 font-body-sm text-body-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {mode === "register" && (
            <div>
              <label className="font-label-sm text-label-sm font-semibold text-secondary">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-1 h-11 w-full rounded-xl border border-surface-container-highest bg-surface-container-low px-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="font-label-sm text-label-sm font-semibold text-secondary">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="mt-1 h-11 w-full rounded-xl border border-surface-container-highest bg-surface-container-low px-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:outline-none"
            />
          </div>

          <div>
            <label className="font-label-sm text-label-sm font-semibold text-secondary">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 h-11 w-full rounded-xl border border-surface-container-highest bg-surface-container-low px-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-primary-container font-label-md text-label-md font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "Processing..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center font-body-sm text-[12px] text-secondary">
          {mode === "register"
            ? "New users receive 10 free AI credits to customize travel plans."
            : "Access your saved trips and customized itineraries."}
        </p>
      </div>
    </div>
  );
}

