"use client";

import { useActionState } from "react";

import { signUp, type SignUpState } from "./actions";
import { GoogleSignInButton } from "./google-signin-button";

const initial: SignUpState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initial);

  return (
    <>
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Nama
        </span>
        <input
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className="px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface"
        />
        {state.fieldErrors?.name ? (
          <span className="font-body-sm text-body-sm text-error">
            {state.fieldErrors.name[0]}
          </span>
        ) : null}
      </label>

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
        {state.fieldErrors?.email ? (
          <span className="font-body-sm text-body-sm text-error">
            {state.fieldErrors.email[0]}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Password (min. 8 karakter)
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={100}
          autoComplete="new-password"
          className="px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface"
        />
        {state.fieldErrors?.password ? (
          <span className="font-body-sm text-body-sm text-error">
            {state.fieldErrors.password[0]}
          </span>
        ) : null}
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
        {pending ? "Memproses..." : "Daftar"}
      </button>
    </form>

    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-4">
        <hr className="flex-1 border-outline-variant" />
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">
          atau
        </span>
        <hr className="flex-1 border-outline-variant" />
      </div>

      <GoogleSignInButton />
    </div>
    </>
  );
}
