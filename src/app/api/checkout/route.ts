import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { getSnap } from '@/lib/midtrans';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { addressId, shippingCourier, shippingService, shippingCost } = body;

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    let subtotal = 0;
    const orderItems = cart.items.map((item) => {
      const itemTotal = Number(item.product.price) * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.product.id,
        productName: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
      };
    });

    const total = subtotal + Number(shippingCost || 0);

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    
    const parameter = {
      transaction_details: {
        order_id: orderNumber,
        gross_amount: Math.round(Number(total)),
      },
      customer_details: {
        first_name: user?.name?.split(' ')[0] || 'Customer',
        last_name: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email,
        phone: user?.phone || '',
      },
      item_details: cart.items.map((item) => ({
        id: item.productId,
        price: Math.round(Number(item.product.price)),
        quantity: item.quantity,
        name: item.product.name.substring(0, 50),
      })).concat(shippingCost ? [{
        id: 'SHIPPING',
        price: Math.round(Number(shippingCost)),
        quantity: 1,
        name: `Shipping - ${shippingCourier} ${shippingService}`.substring(0, 50)
      }] : []),
    };

    const snapTransaction = await getSnap().createTransaction(parameter);

    const order = await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.product.name}`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          addressId,
          subtotal,
          shippingCost: Number(shippingCost || 0),
          total,
          shippingCourier,
          shippingService,
          status: 'PENDING_PAYMENT',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          items: {
            create: orderItems,
          },
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      token: snapTransaction.token,
      redirect_url: snapTransaction.redirect_url
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}