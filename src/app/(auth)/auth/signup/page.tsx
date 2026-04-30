import Link from "next/link";

import { SignUpForm } from "../../signup-form";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-[28rem] bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
        <header className="mb-6">
          <h1 className="font-h1 text-h1 text-on-surface mb-2">
            Buat akun EnterpriseStore
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Sudah punya akun?{" "}
            <Link
              href="/auth/signin"
              className="text-primary hover:underline font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </header>

        <SignUpForm />
      </div>
    </main>
  );
}
