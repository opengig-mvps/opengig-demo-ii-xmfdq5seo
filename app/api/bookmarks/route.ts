import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type BookmarkRequestBody = {
  userId: number;
  articleId: number;
};

export async function POST(request: Request) {
  try {
    const body: BookmarkRequestBody = await request.json();

    const userId = parseInt(String(body.userId), 10);
    const articleId = parseInt(String(body.articleId), 10);

    if (isNaN(userId) || isNaN(articleId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or article ID' }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        articleId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Article bookmarked successfully!',
      data: {
        id: bookmark.id,
        userId: bookmark.userId,
        articleId: bookmark.articleId,
        createdAt: bookmark.createdAt.toISOString(),
        updatedAt: bookmark.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error bookmarking article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}