'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import type { Appointment, Doctor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function DatabaseViewerPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [doctorsRes, appointmentsRes] = await Promise.all([
          fetch('/api/doctors?status=all'),
          fetch('/api/appointments?view=all')
        ]);
        
        const doctorsData = await doctorsRes.json();
        const appointmentsData = await appointmentsRes.json();
        
        if (Array.isArray(doctorsData)) {
          setDoctors(doctorsData);
        } else {
            setDoctors([]);
            toast({ title: 'خطأ في تحميل الأطباء', variant: 'destructive'});
        }

        if (Array.isArray(appointmentsData)) {
          setAppointments(appointmentsData);
        } else {
            setAppointments([]);
            toast({ title: 'خطأ في تحميل المواعيد', variant: 'destructive'});
        }

      } catch (error) {
        console.error("Failed to fetch database data:", error);
        toast({ title: 'فشل الاتصال بالخادم', variant: 'destructive'});
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const renderLoading = () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
  )

  return (
    <AppLayout>
      <div className="flex-1 space-y-6 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
            <Database />
            عارض قاعدة البيانات
          </h1>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-1">
            <Card>
                <CardHeader>
                    <CardTitle>جدول الأطباء (`doctors`)</CardTitle>
                    <CardDescription>يعرض هذا الجدول جميع الأطباء المسجلين في النظام.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? renderLoading() : (
                        <ScrollArea className="h-[400px] border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>الاسم</TableHead>
                                        <TableHead>التخصص</TableHead>
                                        <TableHead>الموقع</TableHead>
                                        <TableHead>الحالة</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {doctors.map(doctor => (
                                        <TableRow key={doctor.id}>
                                            <TableCell className="font-medium">{doctor.name}</TableCell>
                                            <TableCell>{doctor.specialization}</TableCell>
                                            <TableCell>{doctor.location}</TableCell>
                                            <TableCell>
                                                <Badge variant={doctor.status === 'approved' ? 'default' : (doctor.status === 'pending' ? 'secondary' : 'destructive')}>
                                                    {doctor.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>جدول المواعيد (`appointments`)</CardTitle>
                    <CardDescription>يعرض هذا الجدول جميع المواعيد المحجوزة في النظام.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading ? renderLoading() : (
                        <ScrollArea className="h-[400px] border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>اسم الطبيب</TableHead>
                                        <TableHead>التاريخ</TableHead>
                                        <TableHead>الوقت</TableHead>
                                        <TableHead>الحالة</TableHead>
                                        <TableHead>السبب</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map(apt => (
                                        <TableRow key={apt.id}>
                                            <TableCell className="font-medium">{apt.doctorName}</TableCell>
                                            <TableCell>{apt.date ? format(new Date(apt.date), 'PPP', { locale: ar }) : 'N/A'}</TableCell>
                                            <TableCell>{apt.time}</TableCell>
                                            <TableCell>
                                                <Badge variant={apt.status === 'upcoming' ? 'default' : 'secondary'}>
                                                    {apt.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{apt.reason}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
