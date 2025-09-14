'use client';

import AppLayout from '@/components/app-layout';
import AppointmentList from '@/components/dashboard/appointment-list';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/data';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function PatientDashboardPage() {
  // In a real app, this would be part of a global auth context
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) {
    // A more robust solution would use Next.js middleware or a proper auth provider
    // For now, we'll just show a simple message and not render the dashboard.
    // Or redirect to login page.
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
    return null;
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            مواعيــدي
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">مرحباً، {currentUser.name}</span>
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
        <AppointmentList />
      </div>
    </AppLayout>
  );
}
