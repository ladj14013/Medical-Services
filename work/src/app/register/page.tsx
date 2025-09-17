'use client';

import { useRouter } from 'next/navigation';
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

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd create a user account here.
    // For this prototype, we'll just simulate a successful registration.
    
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userRole', 'patient');
    
    toast({
      title: 'تم إنشاء الحساب بنجاح',
      description: 'مرحباً بك! سيتم توجيهك إلى لوحة التحكم.',
    });
    // This is where you would set the auth state.
    // For now, we redirect to the authenticated part of the app.
    router.push('/dashboard/patient');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">إنشاء حساب مريض</CardTitle>
          <CardDescription>
            أدخل معلوماتك أدناه لإنشاء حساب.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                type="text"
                placeholder="اسمك الكامل"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="رقم هاتفك"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
              />
            </div>
            <Button type="submit" className="w-full">
              إنشاء حساب
            </Button>
            <div className="text-center">
                <Button variant="link" size="sm" asChild>
                    <Link href="/login">
                        هل لديك حساب بالفعل؟ تسجيل الدخول
                    </Link>
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
