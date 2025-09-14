// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { doctors } from '@/lib/data';
import type { Doctor } from '@/lib/types';

// Simulate a database delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET() {
  // In a real application, you would fetch this data from a database.
  // For now, we're reading from the static data file.
  
  // Simulate network latency
  await delay(500);

  const approvedDoctors: Doctor[] = doctors.filter(doc => doc.status === 'approved');

  return NextResponse.json(approvedDoctors);
}
