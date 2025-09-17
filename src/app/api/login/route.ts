'use server';

import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import bcrypt from 'bcryptjs';
import type {User} from '@/lib/types';
import type {Doctor} from '@/lib/types';

export async function POST(request: Request) {
  try {
    const {email, password, role} = await request.json();

    if (!email || !password) {
      return NextResponse.json({message: 'البريد الإلكتروني وكلمة المرور مطلوبان'}, {status: 400});
    }

    // 1. Handle Admin Login (special case, not in DB)
    if (role === 'admin' || email === 'admin@medical.app') {
      if (email === 'admin@medical.app' && password === 'admin123') {
        const adminUser = {
          id: 'admin',
          name: 'Admin',
          email: 'admin@medical.app',
          role: 'admin',
        };
        return NextResponse.json({user: adminUser, message: 'تم تسجيل دخول المسؤول بنجاح'});
      } else {
        return NextResponse.json({message: 'بيانات اعتماد المسؤول غير صحيحة'}, {status: 401});
      }
    }

    const connection = await db();
    let user: (User & {password: string}) | (Doctor & {password: string}) | null = null;
    let userRole: 'patient' | 'doctor' | null = null;

    // 2. Determine user type and search in the correct table
    if (role === 'doctor') {
        const [doctorRows] = await connection.query("SELECT * FROM doctors WHERE email = ?", [email]);
        if ((doctorRows as any[]).length > 0) {
            const doctorData = (doctorRows as any[])[0];
            if (doctorData.status !== 'approved') {
                 return NextResponse.json({ message: 'حساب الطبيب الخاص بك قيد المراجعة أو مرفوض.' }, { status: 403 });
            }
            user = doctorData as Doctor & {password: string};
            userRole = 'doctor';
        }
    } else { // Default to patient
        const [userRows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
        if ((userRows as any[]).length > 0) {
            user = (userRows as any[])[0] as User & {password: string};
            userRole = 'patient';
        }
    }

    // 3. If user not found in either table
    if (!user || !userRole) {
      return NextResponse.json({message: 'لم يتم العثور على حساب بهذا البريد الإلكتروني'}, {status: 404});
    }

    // 4. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({message: 'كلمة المرور غير صحيحة'}, {status: 401});
    }

    // 5. Successful login, return user data (without password)
    const {password: _, ...userToReturn} = user;
    (userToReturn as any).role = userRole;


    return NextResponse.json({
      user: userToReturn,
      message: 'تم تسجيل الدخول بنجاح',
    });

  } catch (error) {
    console.error('LOGIN API ERROR:', error);
    return NextResponse.json({message: 'حدث خطأ في الخادم أثناء تسجيل الدخول'}, {status: 500});
  }
}
