// src/app/api/forum/posts/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ForumPost } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const connection = await db();
    const [rows] = await connection.query("SELECT * FROM forum_posts ORDER BY createdAt DESC");

    // Fetch comments for each post
    const posts = await Promise.all((rows as any[]).map(async (post) => {
        const [comments] = await connection.query("SELECT * FROM forum_comments WHERE postId = ? ORDER BY createdAt ASC", [post.id]);
        return {
            ...post,
            comments: comments || [],
            createdAt: new Date(post.createdAt).toISOString(),
        }
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error('DATABASE ERROR fetching forum posts:', error);
    return NextResponse.json({ message: 'فشل الاتصال بقاعدة البيانات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const { title, content, authorId, authorName, authorSpecialization } = await request.json();

        if (!title || !content || !authorId || !authorName || !authorSpecialization) {
            return NextResponse.json({ message: 'البيانات المطلوبة غير مكتملة' }, { status: 400 });
        }

        const connection = await db();
        const newPost: ForumPost = {
            id: uuidv4(),
            title,
            content,
            authorId,
            authorName,
            authorSpecialization,
            createdAt: new Date().toISOString(),
            comments: [],
        };
        
        const query = `
            INSERT INTO forum_posts (id, title, content, authorId, authorName, authorSpecialization, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(query, [
            newPost.id,
            newPost.title,
            newPost.content,
            newPost.authorId,
            newPost.authorName,
            newPost.authorSpecialization,
            new Date(newPost.createdAt)
        ]);

        return NextResponse.json(newPost, { status: 201 });

    } catch (error) {
        console.error('DATABASE ERROR creating post:', error);
        return NextResponse.json({ message: 'فشل إنشاء المنشور' }, { status: 500 });
    }
}
