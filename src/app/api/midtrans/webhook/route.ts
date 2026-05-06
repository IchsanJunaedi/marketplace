import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCoreApi } from '@/lib/midtrans';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // CoreApi verifies the signature automatically when we use .notification()
    const notification = await getCoreApi().transaction.notification(body);

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let newStatus = undefined;

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        newStatus = 'PENDING_PAYMENT';
      } else if (fraudStatus == 'accept') {
        newStatus = 'PAID';
      }
    } else if (transactionStatus == 'settlement') {
      newStatus = 'PAID';
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      newStatus = 'CANCELLED';
    } else if (transactionStatus == 'pending') {
      newStatus = 'PENDING_PAYMENT';
    }

    if (newStatus) {
      await prisma.order.updateMany({
        where: { orderNumber: orderId },
        data: { status: newStatus as any },
      });

      // If cancelled, restore stock
      if (newStatus === 'CANCELLED') {
        const order = await prisma.order.findFirst({
          where: { orderNumber: orderId },
          include: { items: true },
        });
        
        if (order) {
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}