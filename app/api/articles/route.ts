import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic');
    const keyword = url.searchParams.get('keyword');

    const articles = await prisma.article.findMany({
      where: {
        AND: [
          topic ? { topic: topic } : {},
          keyword
            ? {
                OR: [
                  { title: { contains: keyword, mode: 'insensitive' } },
                  { summary: { contains: keyword, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      select: {
        id: true,
        title: true,
        summary: true,
        topic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Articles fetched successfully!',
      data: articles,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}