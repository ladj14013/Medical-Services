'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Printer } from 'lucide-react';
import AppointmentView from '@/components/dashboard/doctor/appointment-view';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import PrintableList from '@/components/dashboard/doctor/printable-list';
import type { Appointment, Doctor, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

// Helper function to fetch multiple users
async function fetchPatients(patientIds: string[]): Promise<User[]> {
    const uniquePatientIds = [...new Set(patientIds)];
    const patientPromises = uniquePatientIds.map(id => fetch(`/api/users/${id}`).then(res => res.json()));
    const patients = await Promise.all(patientPromises);
    return patients.filter(p => p && !p.message); // Filter out any errors or not found
}

export default function DoctorDashboardPage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] =useState<Appointment[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [printDate, setPrintDate] = useState<Date | undefined>(new Date());
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const userJson = sessionStorage.getItem('loggedInUser');
      const userRole = sessionStorage.getItem('userRole');

      if (!userJson || userRole !== 'doctor') {
        router.push('/login?role=doctor');
        return;
      }
      
      const loggedInDoctor: Doctor = JSON.parse(userJson);

      try {
        const [doctorRes, appointmentsRes] = await Promise.all([
          fetch(`/api/doctors/${loggedInDoctor.id}`),
          fetch(`/api/appointments?doctorId=${loggedInDoctor.id}`),
        ]);
        
        if (!doctorRes.ok) throw new Error('Doctor not found');

        const doctorData = await doctorRes.json();
        const appointmentsData: Appointment[] = await appointmentsRes.json();
        
        if (doctorData.status !== 'approved') {
             router.push('/login?role=doctor');
             return;
        }

        setDoctor(doctorData);
        setAppointments(appointmentsData);

        if (appointmentsData.length > 0) {
            const patientIds = appointmentsData.map(apt => apt.patientId);
            const fetchedPatients = await fetchPatients(patientIds);
            setPatients(fetchedPatients);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        router.push('/login?role=doctor');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (isLoading || !doctor) {
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
    
  if (!patients) {
    // This is a fallback if patient data fails, can be improved
     return (
        <AppLayout>
            <div className="p-8">جاري تحميل بيانات المرضى...</div>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 no-print">
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
                    <CardTitle className="text-sm font-medium">الانتقال إلى المنتدى</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/forum">الذهاب إلى المنتدى</Link>
                    </Button>
                     <p className="text-xs text-muted-foreground mt-2">تواصل وناقش مع زملائك.</p>
                </CardContent>
            </Card>
        </div>

        <AppointmentView initialAppointments={upcomingAppointments} patients={patients} />
        
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
                                    {apt.time} - {apt.patientName}
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
        patients={patients}
      />
    </AppLayout>
  );
}
