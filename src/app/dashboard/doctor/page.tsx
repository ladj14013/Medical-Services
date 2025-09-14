'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Printer } from 'lucide-react';
import AppointmentView from '@/components/dashboard/doctor/appointment-view';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import PrintableList from '@/components/dashboard/doctor/printable-list';
import type { Appointment, Doctor, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DoctorDashboardPage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patient, setPatient] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [printDate, setPrintDate] = useState<Date | undefined>(new Date());
  
  // For this prototype, we'll assume Dr. Reed (id: '1') is logged in.
  const loggedInDoctorId = '1';

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [doctorRes, appointmentsRes, patientRes] = await Promise.all([
          fetch(`/api/doctors/${loggedInDoctorId}`),
          fetch(`/api/appointments?doctorId=${loggedInDoctorId}`),
          fetch('/api/users/user1') // Fetching the default patient user
        ]);
        
        if (!doctorRes.ok) throw new Error('Doctor not found');

        const doctorData = await doctorRes.json();
        const appointmentsData = await appointmentsRes.json();
        const patientData = await patientRes.json();

        if (doctorData.status !== 'approved') throw new Error('Doctor not approved');

        setDoctor(doctorData);
        setAppointments(appointmentsData);
        setPatient(patientData);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Handle not found or not approved cases
        notFound();
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading || !doctor || !patient) {
    return (
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 sm:p-8">
          <div className="flex items-center justify-between space-y-2">
            <Skeleton className="h-9 w-64" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               <Skeleton className="h-40 w-full rounded-lg" />
               <Skeleton className="h-40 w-full rounded-lg" />
               <Skeleton className="h-40 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        </div>
      </AppLayout>
    );
  }
  
  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'upcoming'
  );
  
  const todaysAppointments = upcomingAppointments.filter(apt => apt.date === todayFormatted);
  
  const appointmentsForPrintDate = printDate ? appointments.filter(
    (apt) => apt.date === format(printDate, 'yyyy-MM-dd')
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

        <AppointmentView initialAppointments={upcomingAppointments} patient={patient} />
        
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
                                    {apt.time} - {patient.name}
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
        patient={patient}
      />
    </AppLayout>
  );
}
