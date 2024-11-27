import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const qnaSessions = await prisma.qNASession.findMany({
      select: {
        id: true,
        topic: true,
        scheduledAt: true,
      },
    });

    const sessions = qnaSessions.map((session: any) => ({
      id: session.id,
      topic: session.topic,
      scheduledAt: session.scheduledAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      message: "Q&A sessions fetched successfully!",
      data: sessions,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching Q&A sessions:', error);
    return NextResponse.json({
      success: false,
      message: "Error while fetching Q&A sessions",
    }, { status: 500 });
  }
}