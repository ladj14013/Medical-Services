// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { format } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const doctorId = searchParams.get('doctorId');

  try {
    const connection = await db();
    let query = "SELECT * FROM appointments";
    const params: string[] = [];

    if (doctorId) {
      query += " WHERE doctorId = ?";
      params.push(doctorId);
    } else if (userId) {
      // In a real app with a users table and appointments linked to users,
      // you would filter by userId. For this prototype, we'll return
      // appointments for some doctors to simulate a user's appointments.
      query += " WHERE doctorId IN (?, ?)";
      params.push('1', '3'); // Placeholder to return appointments for Dr. Reed and Dr. Sharma
    }
    
    const [rows] = await connection.query(query, params);

    // Format the date correctly before sending it to the client
    const appointments = (rows as any[]).map(apt => ({
      ...apt,
      date: format(new Date(apt.date), 'yyyy-MM-dd'),
    }));
    
    return NextResponse.json(appointments);

  } catch (error) {
    console.error('DATABASE ERROR fetching appointments:', error);
    return NextResponse.json({ message: 'فشل الاتصال بقاعدة البيانات' }, { status: 500 });
  }
}
