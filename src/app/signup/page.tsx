"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signUp, type AuthState } from "@/app/actions/auth";
import { ChakraMotif, ChakraSpinner } from "@/components/ui/Chakra";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <ChakraSpinner label="Creating account" />
          Creating account…
        </span>
      ) : (
        "Create account"
      )}
    </button>
  );
}

export default function SignUpPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(signUp, {});

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="pointer-events-none absolute bottom-8 left-8 opacity-[0.06] text-ink">
        <ChakraMotif size={120} stroke="var(--color-ink)" />
      </div>

      <div className="card-static w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Create account</h1>
          <p className="mt-2 text-sm text-slate-civic">
            Register as a citizen to submit development requests to your MP office.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="label-field">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              autoComplete="name"
              className="input-field"
              placeholder="Your full name"
            />
          </div>

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
              autoComplete="new-password"
              minLength={6}
              className="input-field"
              placeholder="At least 6 characters"
            />
          </div>

          {state.error && (
            <p className="rounded-[12px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-slate-civic">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
