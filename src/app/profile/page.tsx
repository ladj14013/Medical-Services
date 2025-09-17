'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import ProfileForm from '@/components/profile/profile-form';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Button } from '@/components/ui/card';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      const userJson = sessionStorage.getItem('loggedInUser');
      const userRole = sessionStorage.getItem('userRole');

      if (!userJson || userRole !== 'patient') {
        router.push('/login?role=patient');
        return;
      }

      const loggedInUser: User = JSON.parse(userJson);

      try {
        const res = await fetch(`/api/users/${loggedInUser.id}`);
        if (!res.ok) {
            throw new Error('فشل تحميل بيانات الملف الشخصي');
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast({
            title: 'خطأ',
            description: (error as Error).message,
            variant: 'destructive',
        })
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [router, toast]);

  if (isLoading) {
    return (
        <AppLayout>
          <div className="flex-1 space-y-4 p-4 sm:p-8">
             <div className="flex items-center justify-between space-y-2">
              <h1 className="text-3xl font-bold tracking-tight font-headline">
                ملف المريض
              </h1>
            </div>
            <div className="space-y-4">
                 <Skeleton className="h-12 w-1/4" />
                 <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </AppLayout>
      );
  }

  if (!user) {
    return (
        <AppLayout>
          <div className="flex-1 space-y-4 p-4 sm:p-8">
             <Card className="text-center p-10">
                <CardContent>
                    <p className="text-muted-foreground">لم نتمكن من تحميل ملفك الشخصي. الرجاء تسجيل الدخول مرة أخرى.</p>
                    <Button asChild className="mt-4">
                        <Link href="/login?role=patient">تسجيل الدخول</Link>
                    </Button>
                </CardContent>
             </Card>
          </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            ملف المريض
          </h1>
        </div>
        <ProfileForm user={user} />
      </div>
    </AppLayout>
  );
}
