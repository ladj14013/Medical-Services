// src/app/api/forum/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { forumPosts } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = forumPosts.find(p => p.id === params.id);

  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}
