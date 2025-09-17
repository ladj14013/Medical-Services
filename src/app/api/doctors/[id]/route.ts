
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
    // Exclude password from the SELECT statement
    const [rows] = await connection.query("SELECT id, name, specialization, licenseNumber, email, phoneNumber, location, bio, imageId, status, availability, promotionalImages, connections FROM doctors WHERE id = ?", [params.id]);
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
    const body = await request.json();
    const { status, bio, dailyAppointmentLimit, promotionalImages } = body;
    
    const connection = await db();

    const fieldsToUpdate: { [key: string]: any } = {};
    if (status && ['approved', 'rejected'].includes(status)) {
      fieldsToUpdate.status = status;
    }
    if (bio !== undefined) {
      fieldsToUpdate.bio = bio;
    }
    if (dailyAppointmentLimit !== undefined) {
      // In a real app, we might want to store this in a separate settings table
      // For now, let's assume it's a field we can add to the doctors table.
      // Since it's not in the schema, this will be a conceptual update for now
      console.log(`Updating dailyAppointmentLimit for doctor ${params.id}: ${dailyAppointmentLimit}`);
    }
    if (promotionalImages !== undefined) {
       fieldsToUpdate.promotionalImages = JSON.stringify(promotionalImages);
    }
    
    if (Object.keys(fieldsToUpdate).length === 0) {
      return NextResponse.json({ message: 'لا توجد حقول للتحديث' }, { status: 400 });
    }

    const queryParts = Object.keys(fieldsToUpdate).map(key => `${key} = ?`);
    const queryValues = [...Object.values(fieldsToUpdate), params.id];

    const query = `UPDATE doctors SET ${queryParts.join(', ')} WHERE id = ?`;
    
    await connection.query(query, queryValues);

    return NextResponse.json({ message: 'تم تحديث ملف الطبيب بنجاح' });

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
