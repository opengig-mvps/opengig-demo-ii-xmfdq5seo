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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        semenReports: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const goals = [
      "Increase sperm count by 10% in 3 months",
      "Improve motility by 5% in 2 months"
    ];

    return NextResponse.json({
      success: true,
      message: 'Personalized health goals retrieved successfully.',
      data: { goals },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error retrieving goals:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}