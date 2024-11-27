import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { keyword } = await request.json();
    
    if (!keyword) {
      return NextResponse.json({ success: false, message: 'Keyword is required' }, { status: 400 });
    }

    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { summary: { contains: keyword, mode: 'insensitive' } },
          { topic: { contains: keyword, mode: 'insensitive' } },
        ],
      },
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
      message: 'Search results fetched successfully!',
      data: articles,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error searching articles:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}