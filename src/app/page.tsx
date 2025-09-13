import AppLayout from '@/components/app-layout';
import DoctorSearch from '@/components/doctors/doctor-search';
import { doctors } from '@/lib/data';
import type { Doctor } from '@/lib/types';

export default function DoctorSearchPage() {
  // In a real app, you would fetch this data from an API
  const allDoctors: Doctor[] = doctors;

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            ابحث عن طبيبك
          </h1>
        </div>
        <DoctorSearch doctors={allDoctors} />
      </div>
    </AppLayout>
  );
}
