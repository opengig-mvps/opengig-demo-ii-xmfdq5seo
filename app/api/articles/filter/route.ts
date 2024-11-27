import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        topic: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Filtered articles fetched successfully!",
      data: articles,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}