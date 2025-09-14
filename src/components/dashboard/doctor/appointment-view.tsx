'use client';

import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { currentUser } from '@/lib/data'; // Assuming we can get patient name from here

export default function AppointmentView({ appointments }: { appointments: Appointment[] }) {

  return (
     <Card>
        <CardHeader>
            <CardTitle className='font-headline'>المواعيد القادمة</CardTitle>
            <CardDescription>هذه هي قائمة مرضاك القادمين.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             {appointments.length > 0 ? (
                appointments.map((apt) => (
                <Card key={apt.id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className='flex-1'>
                             <p className="flex items-center gap-2 font-semibold">
                                <User className="w-5 h-5 text-primary" />
                                {currentUser.name} {/* In a real app, this would be the actual patient's name */}
                            </p>
                             <p className="text-sm text-muted-foreground mt-1">
                                السبب: فحص روتيني {/* Placeholder */}
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
                        <div className="flex gap-2 self-end sm:self-center">
                            <Button variant="outline">عرض الملف الشخصي للمريض</Button>
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
