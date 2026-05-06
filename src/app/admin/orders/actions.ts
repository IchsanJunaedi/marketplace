"use server";

import { prisma } from "@/lib/db";
import { OrderStatus, NotificationType } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications";
import { sendStatusUpdateEmail } from "@/lib/email";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true }
    });

    // Notify the user
    await createNotification({
      userId: order.userId,
      type: status === OrderStatus.PAID ? NotificationType.PAYMENT_RECEIVED 
          : status === OrderStatus.SHIPPED ? NotificationType.ORDER_SHIPPED
          : status === OrderStatus.DELIVERED ? NotificationType.ORDER_DELIVERED
          : NotificationType.SYSTEM,
      title: `Order Status Updated: ${status}`,
      body: `Your order #${order.orderNumber} is now ${status.toLowerCase().replace('_', ' ')}.`,
      link: `/account/orders/${order.id}`,
    });

    // Send email
    if (order.user.email) {
      await sendStatusUpdateEmail(order.user.email, order.orderNumber, status);
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function updateTrackingNumber(orderId: string, trackingNumber: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        trackingNumber,
        status: OrderStatus.SHIPPED // Auto set to SHIPPED when tracking number is added if needed
      },
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update tracking number:", error);
    return { success: false, error: "Failed to update tracking number" };
  }
}
