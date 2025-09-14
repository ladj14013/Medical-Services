// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { doctors } from '@/lib/data';
import type { Doctor } from '@/lib/types';

// Simulate a database delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  await delay(500);

  if (status === 'all') {
    return NextResponse.json(doctors);
  }

  const approvedDoctors: Doctor[] = doctors.filter(doc => doc.status === 'approved');
  return NextResponse.json(approvedDoctors);
}
