import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      select: {
        id: true,
        read: true,
        message: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notifications retrieved successfully.',
      data: notifications,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error retrieving notifications:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}