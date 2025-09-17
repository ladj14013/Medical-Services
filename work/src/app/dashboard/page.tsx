'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Doctor } from '@/lib/types';
import { Check, ShieldCheck, X, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
        toast({ title: 'خطأ في تحميل الأطباء', description: data.message || 'حدث خطأ غير متوقع.', variant: 'destructive' });
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      setDoctors([]);
      toast({ title: 'خطأ في الاتصال', description: 'فشل الاتصال بالخادم لجلب بيانات الأطباء.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApproval = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('فشل تحديث حالة الطبيب');
      }
      
      // Update state locally for immediate UI feedback
      setDoctors(doctors.map(doc => doc.id === id ? { ...doc, status: newStatus } : doc));
      
      toast({
          title: newStatus === 'approved' ? 'تمت الموافقة على الطبيب' : 'تم رفض الطبيب',
          description: `تم تحديث حالة الطبيب بنجاح.`,
      });
      // Optional: you can re-fetch all doctors to ensure data consistency
      // fetchDoctors(); 
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث حالة الطبيب في قاعدة البيانات.',
        variant: 'destructive',
      });
    }
  };

  const pendingDoctors = Array.isArray(doctors) ? doctors.filter(doc => doc.status === 'pending') : [];

  return (
    <AppLayout>
      <div className="flex-1 space-y-6 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            لوحة تحكم المسؤول
          </h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>عرض قاعدة البيانات</CardTitle>
            <CardDescription>
              عرض محتويات جداول قاعدة البيانات مباشرة في التطبيق.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              استخدم هذه الميزة لمراقبة البيانات في جدولي الأطباء والمواعيد بسهولة.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/database">
                <Database className="ml-2 h-4 w-4" />
                الانتقال إلى عارض قاعدة البيانات
              </Link>
            </Button>
          </CardFooter>
        </Card>

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
