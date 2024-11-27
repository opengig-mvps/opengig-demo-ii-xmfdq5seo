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

    const reminders = await prisma.reminder.findMany({
      where: { userId: userId },
      select: {
        id: true,
        message: true,
        frequency: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminders fetched successfully!',
      data: reminders,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}