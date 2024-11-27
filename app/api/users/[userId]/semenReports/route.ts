import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type SemenReportRequestBody = {
  motility: number;
  morphology: number;
  spermCount: number;
};

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const body: SemenReportRequestBody = await request.json();

    const { motility, morphology, spermCount } = body;
    if (motility === undefined || morphology === undefined || spermCount === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const semenReport = await prisma.semenReport.create({
      data: {
        userId,
        motility,
        morphology,
        spermCount,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Semen report logged successfully!',
      data: {
        id: semenReport.id,
        userId: semenReport.userId,
        motility: semenReport.motility,
        morphology: semenReport.morphology,
        spermCount: semenReport.spermCount,
        createdAt: semenReport.createdAt.toISOString(),
        updatedAt: semenReport.updatedAt.toISOString(),
        reportDate: semenReport.reportDate.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error logging semen report:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}