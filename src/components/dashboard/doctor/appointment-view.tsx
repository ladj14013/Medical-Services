'use client';

import { useState } from 'react';
import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, X } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { currentUser } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function AppointmentView({ appointments: initialAppointments }: { appointments: Appointment[] }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const { toast } = useToast();

  const handleCancel = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    toast({
      title: 'تم إلغاء الموعد',
      description: 'تم إلغاء الموعد بنجاح. قد يتم إخطار المريض.',
      variant: 'destructive'
    });
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');


  return (
     <Card className='no-print'>
        <CardHeader>
            <CardTitle className='font-headline'>المواعيد القادمة</CardTitle>
            <CardDescription>هذه هي قائمة مرضاك القادمين.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className='flex-1'>
                             <p className="flex items-center gap-2 font-semibold">
                                <User className="w-5 h-5 text-primary" />
                                {currentUser.name} {/* In a real app, this would be the actual patient's name */}
                            </p>
                             <p className="text-sm text-muted-foreground mt-1">
                                السبب: {apt.reason || 'غير محدد'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(apt.date), 'd MMMM yyyy', { locale: ar })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{apt.time}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-center flex-wrap">
                            <Button variant="outline" size="sm">عرض الملف الشخصي للمريض</Button>
                             <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <X className="h-4 w-4 ml-1"/>
                                    إلغاء
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    سيؤدي هذا الإجراء إلى إلغاء الموعد بشكل دائم. سيتم إرسال رسالة اعتذار للمريض.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>تراجع</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleCancel(apt.id)}>
                                    تأكيد الإلغاء
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </Card>
                ))
            ) : (
                <div className="text-center p-10">
                    <p className="text-muted-foreground">لا توجد مواعيد قادمة.</p>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
