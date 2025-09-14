'use client';

import AppLayout from '@/components/app-layout';
import { appointments, doctors } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import data from '@/lib/placeholder-images.json';
import { Briefcase, CalendarDays, Clock, Users } from 'lucide-react';
import AppointmentView from '@/components/dashboard/doctor/appointment-view';
import { format } from 'date-fns';

export default function DoctorDashboardPage() {
  // For this prototype, we'll assume Dr. Reed (id: '1') is logged in.
  const loggedInDoctorId = '1';
  const doctor = doctors.find((doc) => doc.id === loggedInDoctorId && doc.status === 'approved');

  if (!doctor) {
    // Or redirect to a "not authorized" page
    notFound();
  }

  const doctorImage = data.placeholderImages.find((img) => img.id === doctor.imageId);
  
  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');

  const upcomingAppointments = appointments.filter(
    (apt) => apt.doctorId === doctor.id && apt.status === 'upcoming'
  );
  
  const todaysAppointments = upcomingAppointments.filter(apt => apt.date === todayFormatted);


  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              مرحباً بعودتك، {doctor.name}
            </h1>
             <p className="text-muted-foreground">
                إليك ملخص يومك.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">مواعيد اليوم</CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{todaysAppointments.length}</div>
                    <p className="text-xs text-muted-foreground">لديك {todaysAppointments.length} مواعيد اليوم.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي المواعيد القادمة</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                    <p className="text-xs text-muted-foreground">في الأيام القادمة.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">التخصص</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{doctor.specialization}</div>
                     <p className="text-xs text-muted-foreground invisible">Placeholder</p>
                </CardContent>
            </Card>
        </div>

        <AppointmentView appointments={upcomingAppointments} />

      </div>
    </AppLayout>
  );
}
