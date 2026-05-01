"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name || null,
      phone: phone || null,
    },
  });

  revalidatePath("/account");
}
