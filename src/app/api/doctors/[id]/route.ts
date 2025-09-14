// src/app/api/doctors/[id]/route.ts
import { NextResponse } from 'next/server';
import { doctors } from '@/lib/data';

// Simulate a database delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await delay(200);
  const doctor = doctors.find(doc => doc.id === params.id);

  if (!doctor) {
    return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
  }

  return NextResponse.json(doctor);
}
