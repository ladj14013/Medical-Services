'use client';

import AppLayout from '@/components/app-layout';
import { appointments, doctors, currentUser } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import data from '@/lib/placeholder-images.json';
import { Briefcase, CalendarDays, Clock, MessageSquare, Users, Printer } from 'lucide-react';
import AppointmentView from '@/components/dashboard/doctor/appointment-view';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import PrintableList from '@/components/dashboard/doctor/printable-list';

export default function DoctorDashboardPage() {
  // For this prototype, we'll assume Dr. Reed (id: '1') is logged in.
  const loggedInDoctorId = '1';
  const doctor = doctors.find((doc) => doc.id === loggedInDoctorId && doc.status === 'approved');

  if (!doctor) {
    // Or redirect to a "not authorized" page
    notFound();
  }

  const [printDate, setPrintDate] = useState<Date | undefined>(new Date());

  const doctorImage = data.placeholderImages.find((img) => img.id === doctor.imageId);
  
  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');

  const upcomingAppointments = appointments.filter(
    (apt) => apt.doctorId === doctor.id && apt.status === 'upcoming'
  );
  
  const todaysAppointments = upcomingAppointments.filter(apt => apt.date === todayFormatted);
  
  const appointmentsForPrintDate = printDate ? appointments.filter(
    (apt) => apt.doctorId === doctor.id && apt.date === format(printDate, 'yyyy-MM-dd')
  ) : [];

  const handlePrint = () => {
    window.print();
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-4 sm:p-8 printable-content">
        <div className="flex items-center justify-between space-y-2 no-print">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              مرحباً بعودتك، {doctor.name}
            </h1>
             <p className="text-muted-foreground">
                ({doctor.specialization}) - إليك ملخص يومك.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 no-print">
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
        </div>

        <AppointmentView appointments={upcomingAppointments} />
        
        <Card className="no-print">
            <CardHeader>
                <CardTitle className="font-headline">طباعة قائمة المرضى</CardTitle>
                <p className="text-muted-foreground">حدد تاريخًا لطباعة قائمة المرضى لهذا اليوم.</p>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6 items-start">
                 <Calendar
                    mode="single"
                    selected={printDate}
                    onSelect={setPrintDate}
                    className="rounded-md border"
                  />
                  <div className="flex-1">
                     <h3 className="text-lg font-semibold mb-2">
                        المواعيد لـ: {printDate ? format(printDate, 'PPP') : '...'}
                     </h3>
                     {appointmentsForPrintDate.length > 0 ? (
                        <div className="space-y-2">
                            {appointmentsForPrintDate.map(apt => (
                                <div key={apt.id} className="text-sm p-2 bg-muted/50 rounded-md">
                                    {apt.time} - {currentUser.name}
                                </div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-sm text-muted-foreground">لا توجد مواعيد في هذا التاريخ.</p>
                     )}
                     <Button onClick={handlePrint} className="mt-4" disabled={appointmentsForPrintDate.length === 0}>
                        <Printer className="ml-2 h-4 w-4"/>
                        طباعة
                     </Button>
                  </div>
            </CardContent>
        </Card>

      </div>
      <PrintableList 
        appointments={appointmentsForPrintDate}
        doctor={doctor}
        date={printDate}
        patient={currentUser}
      />
    </AppLayout>
  );
}
