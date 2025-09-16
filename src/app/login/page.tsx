'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const role = searchParams.get('role') || 'patient';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- Corrected Login Logic ---
    if (role === 'admin') {
      if (email === 'admin@medical.app' && password === 'admin123') {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userRole', 'admin');
        toast({ title: 'تم تسجيل الدخول كمسؤول' });
        router.push('/dashboard');
      } else {
        toast({
          title: 'فشل تسجيل الدخول',
          description: 'بيانات اعتماد المسؤول غير صحيحة.',
          variant: 'destructive',
        });
      }
    } else if (role === 'doctor') {
        // This is a placeholder for real doctor authentication
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userRole', 'doctor');
        toast({ title: 'تم تسجيل الدخول كطبيب' });
        router.push('/dashboard/doctor');
    } else {
        // This is a placeholder for real patient authentication
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userRole', 'patient');
        toast({ title: 'تم تسجيل الدخول كمريض' });
        router.push('/dashboard/patient');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">تسجيل الدخول</CardTitle>
          <CardDescription>
            {role === 'admin' ? 'الرجاء إدخال بيانات اعتماد المسؤول.' : 'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
             <div className="text-center">
                <Button variant="link" size="sm" asChild>
                    <Link href="/register">
                        ليس لديك حساب؟ إنشاء حساب جديد
                    </Link>
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
