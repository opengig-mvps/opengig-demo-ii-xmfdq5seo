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
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const semenReports = await prisma.semenReport.findMany({
      where: { userId },
      orderBy: { reportDate: 'desc' },
      take: 2,
    });

    if (semenReports.length < 2) {
      return NextResponse.json({ success: false, message: 'Not enough data to generate insights' }, { status: 400 });
    }

    const [latestReport, previousReport] = semenReports;
    const spermCountTrend = ((latestReport.spermCount - previousReport.spermCount) / previousReport.spermCount) * 100;

    const insights = [
      {
        trend: `Sperm count has ${spermCountTrend > 0 ? 'increased' : 'decreased'} by ${Math.abs(spermCountTrend).toFixed(2)}% over the last month.`,
        areaForImprovement: 'Consider reducing alcohol consumption.'
      }
    ];

    return NextResponse.json({
      success: true,
      message: 'Insights fetched successfully!',
      data: insights
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching insights:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}