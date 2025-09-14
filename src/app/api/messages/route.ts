// src/app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { messages } from '@/lib/data';
import type { Message } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId'); // This would be the logged-in user

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }
  
  // Filter messages where the user is either the sender or recipient
  const userMessages = messages.filter(m => m.recipientId === userId || m.senderId === userId);

  return NextResponse.json(userMessages);
}

export async function POST(request: Request) {
  const newMessage: Message = await request.json();
  // In a real app, you would save this to a database
  messages.push(newMessage);
  return NextResponse.json(newMessage, { status: 201 });
}
