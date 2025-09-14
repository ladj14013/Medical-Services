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

export default function RegisterDoctorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [license, setLicense] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd create a doctor account here.
    toast({
      title: 'تم استلام طلب التسجيل',
      description: 'سيتم مراجعة طلبك. سيتم إعلامك عند الموافقة عليه.',
    });
    // For now, we redirect to the home page.
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">إنشاء حساب طبيب</CardTitle>
          <CardDescription>
            أدخل معلوماتك أدناه للانضمام إلى شبكتنا من الأطباء.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
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
              <Label htmlFor="specialization">التخصص</Label>
              <Input
                id="specialization"
                type="text"
                placeholder="مثال: طب القلب"
                required
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="license">رقم رخصة مزاولة المهنة</Label>
              <Input
                id="license"
                type="text"
                placeholder="رقم الرخصة"
                required
                value={license}
                onChange={(e) => setLicense(e.target.value)}
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
              إرسال طلب التسجيل
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
