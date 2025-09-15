// src/app/api/doctors/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { doctors as staticDoctors } from '@/lib/data';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await db();
    const [rows] = await connection.query("SELECT * FROM doctors WHERE id = ?", [params.id]);
    const doctors = (rows as any[]);

    if (doctors.length === 0) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    const doctor = {
      ...doctors[0],
      availability: typeof doctors[0].availability === 'string' ? JSON.parse(doctors[0].availability) : doctors[0].availability,
      promotionalImages: typeof doctors[0].promotionalImages === 'string' ? JSON.parse(doctors[0].promotionalImages) : doctors[0].promotionalImages,
      connections: typeof doctors[0].connections === 'string' ? JSON.parse(doctors[0].connections) : doctors[0].connections,
    };

    return NextResponse.json(doctor);
  } catch (error) {
    console.error(`DATABASE ERROR fetching doctor ${params.id}:`, error);
    return NextResponse.json({ message: 'فشل الاتصال بقاعدة البيانات' }, { status: 500 });
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'حالة غير صالحة' }, { status: 400 });
    }

    const connection = await db();
    const query = "UPDATE doctors SET status = ? WHERE id = ?";
    await connection.query(query, [status, params.id]);

    return NextResponse.json({ message: 'تم تحديث حالة الطبيب بنجاح' });
  } catch (error) {
    console.error(`DATABASE ERROR updating doctor ${params.id}:`, error);
    return NextResponse.json({ message: 'فشل تحديث الطبيب في قاعدة البيانات' }, { status: 500 });
  }
}

// Keep the old GET from static data for generateStaticParams, as it's faster and DB isn't needed for build-time generation.
export async function getStaticDoctor(id: string) {
    const doctor = staticDoctors.find(doc => doc.id === id);
    return doctor;
}
