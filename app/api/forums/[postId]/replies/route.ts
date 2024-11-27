import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReplyRequestBody = {
  content: string;
};

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = parseInt(params.postId, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ success: false, message: 'Invalid post ID' }, { status: 400 });
    }

    const replies = await prisma.forumReply.findMany({
      where: { postId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Replies fetched successfully!',
      data: replies,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = parseInt(params.postId, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ success: false, message: 'Invalid post ID' }, { status: 400 });
    }

    const body: ReplyRequestBody = await request.json();
    const content = String(body.content);

    if (!content) {
      return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });
    }

    const reply = await prisma.forumReply.create({
      data: {
        content,
        postId,
        userId: 1, // Assuming a userId is available in the context
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reply created successfully!',
      data: {
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating reply:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}