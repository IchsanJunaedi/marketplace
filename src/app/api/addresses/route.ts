import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        ...body,
      },
    });

    return NextResponse.json(address);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}