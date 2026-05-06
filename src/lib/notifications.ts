import { prisma } from "@/lib/db";
import { NotificationType } from "@/generated/prisma/client";

export async function createNotification({
  userId,
  type,
  title,
  body,
  link,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
}) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        link,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

export async function markAsRead(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return null;
  }
}
