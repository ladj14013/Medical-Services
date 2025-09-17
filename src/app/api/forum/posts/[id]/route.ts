// src/app/api/forum/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ForumComment } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await db();
    const [postRows] = await connection.query("SELECT * FROM forum_posts WHERE id = ?", [params.id]);
    const posts = (postRows as any[]);

    if (posts.length === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    
    const post = posts[0];
    
    const [comments] = await connection.query("SELECT * FROM forum_comments WHERE postId = ? ORDER BY createdAt ASC", [params.id]);

    const fullPost = {
      ...post,
      comments: comments || [],
      createdAt: new Date(post.createdAt).toISOString(),
    }

    return NextResponse.json(fullPost);

  } catch (error) {
    console.error(`DATABASE ERROR fetching post ${params.id}:`, error);
    return NextResponse.json({ message: 'فشل الاتصال بقاعدة البيانات' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const { authorId, authorName, content } = await request.json();

    if (!authorId || !authorName || !content) {
        return NextResponse.json({ message: 'البيانات المطلوبة غير مكتملة' }, { status: 400 });
    }

    const connection = await db();

    const newComment: ForumComment = {
        id: uuidv4(),
        postId,
        authorId,
        authorName,
        content,
        createdAt: new Date().toISOString(),
    };

    const query = `
        INSERT INTO forum_comments (id, postId, authorId, authorName, content, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    await connection.query(query, [
        newComment.id,
        newComment.postId,
        newComment.authorId,
        newComment.authorName,
        newComment.content,
        new Date(newComment.createdAt),
    ]);
    
    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.error(`DATABASE ERROR adding comment to post ${params.id}:`, error);
    return NextResponse.json({ message: 'فشل إضافة التعليق' }, { status: 500 });
  }
}
