import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) return { error: "You must be logged in to leave a review." };

  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") as string;
  const productId = formData.get("productId") as string;

  if (!rating || rating < 1 || rating > 5) return { error: "Invalid rating." };

  try {
    // Check if user already reviewed
    const existing = await prisma.review.findFirst({
      where: { userId: session.user.id, productId },
    });

    if (existing) return { error: "You have already reviewed this product." };

    // Check if user bought the product
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        order: {
          userId: session.user.id,
          status: "DELIVERED",
        },
        productId,
      },
    });

    if (!orderItem) return { error: "You can only review products you have purchased and received." };

    await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        comment,
      },
    });

    revalidatePath(`/products/${productId}`); // This might need slug instead
    return { success: true };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { error: "Something went wrong." };
  }
}
