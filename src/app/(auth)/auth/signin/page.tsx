import Link from "next/link";

import { SignInForm } from "../../signin-form";

type SignInPageProps = {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-[28rem] bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
        <header className="mb-6">
          <h1 className="font-h1 text-h1 text-on-surface mb-2">
            Masuk ke EnterpriseStore
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Belum punya akun?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Daftar di sini
            </Link>
          </p>
        </header>

        <SignInForm redirectTo={params.redirectTo} />
      </div>
    </main>
  );
}
