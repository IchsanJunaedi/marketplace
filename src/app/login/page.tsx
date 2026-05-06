import { redirect } from "next/navigation";

// /login → redirect to the actual sign-in page, forwarding callbackUrl
export default async function LoginRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const destination = callbackUrl
    ? `/auth/signin?redirectTo=${encodeURIComponent(callbackUrl)}`
    : "/auth/signin";
  redirect(destination);
}
