// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import type { Doctor } from '@/lib/types';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const connection = db();
    let query = "SELECT * FROM doctors WHERE status = 'approved'";
    
    if (status === 'all') {
      query = "SELECT * FROM doctors";
    }
    
    const [rows] = await connection.query(query);
    
    // In a real app, you'd have more robust JSON parsing for fields like availability, promotionalImages, etc.
    // For now, we'll assume they are stored as JSON strings in the DB and parse them.
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
    const { name, specialization, licenseNumber, email, location, bio, imageId } = await request.json();

    if (!name || !specialization || !licenseNumber || !email) {
      return NextResponse.json({ message: 'البيانات المطلوبة غير مكتملة' }, { status: 400 });
    }

    const connection = db();

    const newDoctor = {
      id: uuidv4(),
      name,
      specialization,
      licenseNumber,
      email,
      location: location || 'غير محدد',
      bio: bio || 'نبذة تعريفية قيد التحديث.',
      imageId: imageId || `doctor-${Math.floor(Math.random() * 6) + 1}`, // Placeholder
      status: 'pending',
      availability: JSON.stringify({}), // Default empty availability
      promotionalImages: JSON.stringify([]),
      connections: JSON.stringify([]),
    };

    const query = `
      INSERT INTO doctors (id, name, specialization, licenseNumber, email, location, bio, imageId, status, availability, promotionalImages, connections) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await connection.query(query, [
      newDoctor.id,
      newDoctor.name,
      newDoctor.specialization,
      newDoctor.licenseNumber,
      newDoctor.email,
      newDoctor.location,
      newDoctor.bio,
      newDoctor.imageId,
      newDoctor.status,
      newDoctor.availability,
      newDoctor.promotionalImages,
      newDoctor.connections,
    ]);

    // We don't return the full doctor object here for security, just a success response.
    // The password should be handled separately and hashed.
    return NextResponse.json({ message: 'تم استلام طلب تسجيل الطبيب بنجاح' }, { status: 201 });

  } catch (error) {
    console.error('DATABASE ERROR creating doctor:', error);
    // Check for duplicate entry error
    if ((error as any).code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' }, { status: 409 });
    }
    return NextResponse.json({ message: 'فشل إنشاء حساب الطبيب في قاعدة البيانات' }, { status: 500 });
  }
}
