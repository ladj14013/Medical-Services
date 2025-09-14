// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import { appointments } from '@/lib/data';
import type { Appointment } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const doctorId = searchParams.get('doctorId');

  let userAppointments: Appointment[] = [];

  if (userId) {
    // For this prototype, we'll just return all appointments for any user request
    // In a real app, you'd filter by the actual userId
    userAppointments = appointments;
  } else if (doctorId) {
    userAppointments = appointments.filter(apt => apt.doctorId === doctorId);
  }

  return NextResponse.json(userAppointments);
}
