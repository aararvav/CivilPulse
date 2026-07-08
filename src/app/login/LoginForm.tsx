"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { signIn, type AuthState } from "@/app/actions/auth";
import { ChakraMotif, ChakraSpinner } from "@/components/ui/Chakra";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <ChakraSpinner label="Signing in" />
          Signing in…
        </span>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction] = useFormState<AuthState, FormData>(signIn, {});

  const urlError = searchParams.get("error");
  const error = state.error ?? (urlError ? "Sign in failed. Please try again." : "");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="pointer-events-none absolute bottom-8 right-8 opacity-[0.06] text-ink">
        <ChakraMotif size={120} stroke="var(--color-ink)" />
      </div>

      <div className="card-static w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mt-2 text-sm text-slate-civic">
            Access CivicPulse to submit or review development requests.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          {searchParams.get("redirect") && (
            <input type="hidden" name="redirect" value={searchParams.get("redirect")!} />
          )}

          <div>
            <label htmlFor="email" className="label-field">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label-field">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              minLength={6}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-[12px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-slate-civic">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
