// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // In a real app, you'd fetch the user by their ID from a database.
  // For this prototype, we'll always return the same current user if the ID is 'user1'.
  if (params.id === 'user1') {
    return NextResponse.json(currentUser);
  }
  return NextResponse.json({ message: 'User not found' }, { status: 404 });
}
