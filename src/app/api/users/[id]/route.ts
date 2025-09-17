// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await db();
    // Exclude password from the SELECT statement for security
    const [rows] = await connection.query(
      "SELECT id, name, email, phoneNumber, medicalHistory, avatarId, role FROM users WHERE id = ?",
      [params.id]
    );
    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error(`DATABASE ERROR fetching user ${params.id}:`, error);
    return NextResponse.json({ message: 'فشل الاتصال بقاعدة البيانات' }, { status: 500 });
  }
}
