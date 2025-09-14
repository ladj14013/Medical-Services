// src/app/api/forum/posts/route.ts
import { NextResponse } from 'next/server';
import { forumPosts } from '@/lib/data';

export async function GET() {
  // Simulate network latency
  await new Promise(res => setTimeout(res, 500));
  return NextResponse.json(forumPosts);
}
