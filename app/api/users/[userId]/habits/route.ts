import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type HabitRequestBody = {
  diet: string;
  sleepDuration: number;
  lifestyleChanges: string;
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

    const body: HabitRequestBody = await request.json();

    const { diet, sleepDuration, lifestyleChanges } = body;
    if (!diet || typeof sleepDuration !== 'number' || !lifestyleChanges) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        diet,
        sleepDuration,
        lifestyleChanges,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Habit logged successfully!',
      data: {
        id: habit.id,
        diet: habit.diet,
        userId: habit.userId,
        logDate: habit.logDate.toISOString(),
        createdAt: habit.createdAt.toISOString(),
        updatedAt: habit.updatedAt.toISOString(),
        sleepDuration: habit.sleepDuration,
        lifestyleChanges: habit.lifestyleChanges,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error logging habit:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}