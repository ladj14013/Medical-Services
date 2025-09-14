'use client';

import AppLayout from '@/components/app-layout';
import AppointmentList from '@/components/dashboard/appointment-list';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/data';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function PatientDashboardPage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            مواعيــدي
          </h1>
        </div>
        <AppointmentList />
      </div>
    </AppLayout>
  );
}
