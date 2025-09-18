// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const connection = await db();
    // Exclude password from the SELECT statement for security
    let query = "SELECT id, name, specialization, licenseNumber, email, phoneNumber, location, bio, imageId, status, availability, promotionalImages, connections, role FROM doctors";
    const params = [];
    
    // Default to approved doctors if no status is specified
    if (status && status !== 'all') {
      query += " WHERE status = ?";
      params.push(status);
    } else if (!status) {
       query += " WHERE status = 'approved'";
    }
    
    const [rows] = await connection.query(query, params);
    
    const doctors = (rows as any[]).map(doc => ({
      ...doc,
      availability: typeof doc.availability === 'string' ? JSON.parse(doc.availability) : doc.availability,
      promotionalImages: typeof doc.promotionalImages === 'string' ? JSON.parse(doc.promotionalImages) : doc.promotionalImages,
      connections: typeof doc.connections === 'string' ? JSON.parse(doc.connections) : doc.connections,
    }));

    return NextResponse.json(doctors);

  } catch (error) {
    console.error('DATABASE ERROR:', error);
    return NextResponse.json({ message: 'فشل الاتصال بقاعدة البيانات' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const { name, specialization, licenseNumber, email, password, location, bio, imageId, phoneNumber } = await request.json();

    if (!name || !specialization || !licenseNumber || !email || !password) {
      return NextResponse.json({ message: 'البيانات المطلوبة غير مكتملة' }, { status: 400 });
    }

    const connection = await db();

    // Check if doctor already exists
    const [existing] = await connection.query("SELECT id FROM doctors WHERE email = ?", [email]);
    if ((existing as any[]).length > 0) {
        return NextResponse.json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' }, { status: 409 });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = {
      id: uuidv4(),
      name,
      specialization,
      licenseNumber,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || 'غير محدد',
      location: location || 'غير محدد',
      bio: bio || 'نبذة تعريفية قيد التحديث.',
      imageId: imageId || `doctor-${Math.floor(Math.random() * 6) + 1}`, // Placeholder
      status: 'pending',
      availability: JSON.stringify({}), // Default empty availability
      promotionalImages: JSON.stringify([]),
      connections: JSON.stringify([]),
      role: 'doctor',
    };

    const query = `
      INSERT INTO doctors (id, name, specialization, licenseNumber, email, password, phoneNumber, location, bio, imageId, status, availability, promotionalImages, connections, role) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await connection.query(query, [
      newDoctor.id,
      newDoctor.name,
      newDoctor.specialization,
      newDoctor.licenseNumber,
      newDoctor.email,
      newDoctor.password,
      newDoctor.phoneNumber,
      newDoctor.location,
      newDoctor.bio,
      newDoctor.imageId,
      newDoctor.status,
      newDoctor.availability,
      newDoctor.promotionalImages,
      newDoctor.connections,
      newDoctor.role,
    ]);

    return NextResponse.json({ message: 'تم استلام طلب تسجيل الطبيب بنجاح' }, { status: 201 });

  } catch (error) {
    console.error('DATABASE ERROR creating doctor:', error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' }, { status: 409 });
    }
    return NextResponse.json({ message: 'فشل إنشاء حساب الطبيب في قاعدة البيانات' }, { status: 500 });
  }
}
