import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ForumPostRequestBody = {
  content: string;
};

export async function GET() {
  try {
    const forumPosts = await prisma.forumPost.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Forum posts fetched successfully!',
      data: forumPosts,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: ForumPostRequestBody = await request.json();

    const { content } = body;
    if (!content) {
      return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });
    }

    const forumPost = await prisma.forumPost.create({
      data: {
        content,
        userId: 1, // Assuming a default userId for demonstration purposes
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Forum post created successfully!',
      data: {
        id: forumPost.id,
        content: forumPost.content,
        createdAt: forumPost.createdAt.toISOString(),
        updatedAt: forumPost.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating forum post:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}