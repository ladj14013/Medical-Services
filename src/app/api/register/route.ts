// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { name, email, password, phoneNumber } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' }, { status: 400 });
    }

    const connection = await db();

    // Check if user already exists
    const [existingUsers] = await connection.query("SELECT id FROM users WHERE email = ?", [email]);
    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || null,
      avatarId: 'user-avatar', // default avatar
      role: 'patient',
    };

    const query = `
      INSERT INTO users (id, name, email, password, phoneNumber, avatarId, role) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await connection.query(query, [
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.phoneNumber,
      newUser.avatarId,
      newUser.role,
    ]);

    // Do not return the password hash
    const { password: _, ...userToReturn } = newUser;

    return NextResponse.json({ user: userToReturn, message: 'تم إنشاء الحساب بنجاح' }, { status: 201 });

  } catch (error) {
    console.error('DATABASE ERROR creating user:', error);
    // Check for duplicate entry error from the database as a fallback
    if ((error as any).code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' }, { status: 409 });
    }
    return NextResponse.json({ message: 'فشل إنشاء حساب المستخدم في قاعدة البيانات' }, { status: 500 });
  }
}
