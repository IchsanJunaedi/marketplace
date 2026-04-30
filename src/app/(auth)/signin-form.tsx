"use client";

import { useActionState } from "react";

import { signInAction, type SignInState } from "./actions";

const initial: SignInState = {};

export function SignInForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo ?? "/account"} />

      <label className="flex flex-col gap-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          minLength={8}
          className="px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface"
        />
      </label>

      {state.error ? (
        <p
          role="alert"
          className="font-body-sm text-body-sm text-error bg-error-container px-3 py-2 rounded"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-on-primary font-medium py-2.5 rounded hover:opacity-90 disabled:opacity-60 transition"
      >
        {pending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
