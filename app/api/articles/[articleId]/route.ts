import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { articleId: string } }
) {
  try {
    const articleId = parseInt(params.articleId, 10);
    if (isNaN(articleId)) {
      return NextResponse.json({ success: false, message: 'Invalid article ID' }, { status: 400 });
    }

    const article = await prisma.article.findFirst({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        topic: true,
        content: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!article) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Article fetched successfully!',
      data: {
        id: article.id,
        title: article.title,
        topic: article.topic,
        content: article.content,
        summary: article.summary,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}