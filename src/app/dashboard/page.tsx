'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Doctor } from '@/lib/types';
import { Check, ShieldCheck, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/doctors?status=all'); // A new param to fetch all doctors
        const data = await res.json();
        if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          setDoctors([]);
          console.error("Failed to fetch doctors, API did not return an array:", data);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleApproval = (id: string, newStatus: 'approved' | 'rejected') => {
    // In a real app, this would be a PATCH request to an API
    setDoctors(doctors.map(doc => doc.id === id ? { ...doc, status: newStatus } : doc));
    toast({
        title: newStatus === 'approved' ? 'تمت الموافقة على الطبيب' : 'تم رفض الطبيب',
        description: `تم تحديث حالة الطبيب بنجاح.`,
    });
  };

  const pendingDoctors = Array.isArray(doctors) ? doctors.filter(doc => doc.status === 'pending') : [];

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
                {isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                ) : pendingDoctors.length > 0 ? (
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
