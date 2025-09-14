'use client';

import { useState, useEffect } from 'react';
import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/appointments?userId=user1'); // Using placeholder userId
        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        toast({
          title: 'خطأ',
          description: 'فشل في تحميل المواعيد.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [toast]);

  const handleCancel = (id: string) => {
    // In a real app, this would be a DELETE or PATCH request to the API
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      )
    );
    toast({
      title: 'تم إلغاء الموعد',
      description: 'تم إلغاء موعدك بنجاح.',
    });
  };

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'upcoming'
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/4 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((apt) => (
          <Card key={apt.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-headline">
                    {apt.doctorName}
                  </CardTitle>
                  <p className="flex items-center gap-2 text-muted-foreground pt-1">
                    <Stethoscope className="w-4 h-4" />
                    {apt.doctorSpecialization}
                  </p>
                </div>
                <Badge variant="secondary">قادم</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{format(new Date(apt.date), 'd MMMM yyyy', { locale: ar })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{apt.time}</span>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" asChild>
                    <Link href={`/doctors/${apt.doctorId}`}>إعادة الجدولة</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleCancel(apt.id)}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="text-center p-10">
          <p className="text-muted-foreground">ليس لديك مواعيد قادمة.</p>
        </Card>
      )}
    </div>
  );
}
