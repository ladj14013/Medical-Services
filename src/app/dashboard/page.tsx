'use client';

import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { doctors as allDoctors } from '@/lib/data';
import type { Doctor } from '@/lib/types';
import { Check, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(allDoctors);
  const { toast } = useToast();

  const handleApproval = (id: string, newStatus: 'approved' | 'rejected') => {
    setDoctors(doctors.map(doc => doc.id === id ? { ...doc, status: newStatus } : doc));
    toast({
        title: newStatus === 'approved' ? 'تمت الموافقة على الطبيب' : 'تم رفض الطبيب',
        description: `تم تحديث حالة الطبيب بنجاح.`,
    });
  };

  const pendingDoctors = doctors.filter(doc => doc.status === 'pending');

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            لوحة تحكم المسؤول
          </h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>طلبات تسجيل الأطباء</CardTitle>
                <CardDescription>مراجعة والموافقة على طلبات الأطباء الجدد.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {pendingDoctors.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pendingDoctors.map(doctor => (
                            <Card key={doctor.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="font-headline">{doctor.name}</CardTitle>
                                    <CardDescription>{doctor.specialization}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>رقم الرخصة: {doctor.licenseNumber}</span>
                                    </div>
                                    <p className="text-sm mt-4">{doctor.bio}</p>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleApproval(doctor.id, 'rejected')}>
                                        <X className="ml-1 h-4 w-4" />
                                        رفض
                                    </Button>
                                    <Button size="sm" variant='accent' onClick={() => handleApproval(doctor.id, 'approved')}>
                                        <Check className="ml-1 h-4 w-4" />
                                        موافقة
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">لا توجد طلبات تسجيل معلقة حاليًا.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
