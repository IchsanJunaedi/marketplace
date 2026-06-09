import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCoreApi } from '@/lib/midtrans';
import { OrderStatus, NotificationType } from '@/generated/prisma/client';
import { createNotification } from '@/lib/notifications';
import { sendStatusUpdateEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // CoreApi verifies the signature automatically when we use .notification()
    const notification = await getCoreApi().transaction.notification(body);

    const orderId = notification.order_id as string;
    const transactionStatus = notification.transaction_status as string;
    const fraudStatus = notification.fraud_status as string;

    let newStatus: OrderStatus | undefined = undefined;

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        newStatus = OrderStatus.PENDING_PAYMENT;
      } else if (fraudStatus == 'accept') {
        newStatus = OrderStatus.PAID;
      }
    } else if (transactionStatus == 'settlement') {
      newStatus = OrderStatus.PAID;
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      newStatus = OrderStatus.CANCELLED;
    } else if (transactionStatus == 'pending') {
      newStatus = OrderStatus.PENDING_PAYMENT;
    }

    if (newStatus) {
      const order = await prisma.order.findFirst({
        where: { orderNumber: orderId },
        include: { items: true, user: { select: { id: true, email: true } } },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: newStatus },
        });

        // Restore stock on cancellation
        if (newStatus === OrderStatus.CANCELLED) {
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }

        // Notify user
        await createNotification({
          userId: order.userId,
          type:
            newStatus === OrderStatus.PAID
              ? NotificationType.PAYMENT_RECEIVED
              : NotificationType.SYSTEM,
          title: `Order Status Updated: ${newStatus}`,
          body: `Your order #${order.orderNumber} is now ${newStatus.toLowerCase().replace('_', ' ')}.`,
          link: `/account/orders/${order.id}`,
        });

        if (order.user.email) {
          await sendStatusUpdateEmail(order.user.email, order.orderNumber, newStatus);
        }
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}