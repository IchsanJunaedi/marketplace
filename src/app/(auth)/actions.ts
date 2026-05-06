"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/db";
import { signIn } from "@/auth";

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80),
  password: z.string().min(8).max(100),
});

export type SignUpState = {
  error?: string;
  fieldErrors?: Partial<Record<"email" | "name" | "password", string[]>>;
};

export async function signUp(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data isian.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, name, password } = parsed.data;

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { email, name, passwordHash, role: "CUSTOMER" },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "Email sudah terdaftar." };
    }
    throw err;
  }

  // Auto sign-in after registration; signIn will throw a redirect.
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/account",
  });

  // Unreachable (signIn redirects), but keeps the function shape stable.
  return {};
}

export type SignInState = { error?: string };

export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: (formData.get("redirectTo") as string) || "/account",
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Email atau password salah." };
    }
    throw err;
  }
}

export async function signOutAction() {
  const { signOut } = await import("@/auth");
  await signOut({ redirectTo: "/" });
  redirect("/");
}

export async function signInWithGoogleAction(redirectTo?: string) {
  await signIn("google", { redirectTo: redirectTo || "/account" });
}
