// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { Appointment } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const doctorId = searchParams.get('doctorId');
  const view = searchParams.get('view');

  try {
    const connection = await db();
    let query = "SELECT * FROM appointments";
    const params: string[] = [];

    if (view === 'all') {
      // No additional WHERE clause needed, returns all
      query += " ORDER BY date, time";
    } else if (doctorId) {
      query += " WHERE doctorId = ? ORDER BY date, time";
      params.push(doctorId);
    } else if (userId) {
      // In a real app with a users table, this would be a real join.
      // For this prototype, we'll return a sample set for 'user1'.
      query += " WHERE doctorId IN (?, ?) ORDER BY date, time";
      params.push('1', '3'); // Placeholder doctor IDs for the patient's appointments
    } else {
       query += " ORDER BY date, time";
    }
    
    const [rows] = await connection.query(query, params);

    // Format the date correctly before sending it to the client
    const appointments = (rows as any[]).map(apt => ({
      ...apt,
      date: apt.date ? format(new Date(apt.date), 'yyyy-MM-dd') : null,
    }));
    
    return NextResponse.json(appointments);

  } catch (error) {
    console.error('DATABASE ERROR fetching appointments:', error);
    return NextResponse.json({ message: 'فشل الاتصال بقاعدة البيانات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { doctorId, doctorName, doctorSpecialization, date, time, reason } = await request.json();
    
    if (!doctorId || !doctorName || !doctorSpecialization || !date || !time) {
      return NextResponse.json({ message: 'البيانات المطلوبة غير مكتملة' }, { status: 400 });
    }

    const connection = await db();
    
    // In a real app, you would check for availability conflicts here.
    // For now, we assume the slot is available.
    const newAppointment: Appointment = {
      id: uuidv4(),
      doctorId,
      doctorName,
      doctorSpecialization,
      date,
      time,
      status: 'upcoming',
      reason: reason || 'غير محدد',
    };

    const query = `
      INSERT INTO appointments (id, doctorId, doctorName, doctorSpecialization, date, time, status, reason) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await connection.query(query, [
      newAppointment.id,
      newAppointment.doctorId,
      newAppointment.doctorName,
      newAppointment.doctorSpecialization,
      newAppointment.date,
      newAppointment.time,
      newAppointment.status,
      newAppointment.reason,
    ]);

    return NextResponse.json(newAppointment, { status: 201 });

  } catch (error) {
    console.error('DATABASE ERROR creating appointment:', error);
    return NextResponse.json({ message: 'فشل إنشاء الموعد في قاعدة البيانات' }, { status: 500 });
  }
}
