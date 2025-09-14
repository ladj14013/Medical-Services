'use client';

import AppLayout from '@/components/app-layout';
import AppointmentList from '@/components/dashboard/appointment-list';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/data';
import { LogOut } from 'lucide-react';

export default function PatientDashboardPage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              مواعيــدي
            </h1>
          </div>
        </div>
        <AppointmentList />
      </div>
    </AppLayout>
  );
}
