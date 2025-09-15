// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
