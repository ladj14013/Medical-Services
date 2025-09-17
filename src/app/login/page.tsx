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
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(searchParams.get('role') || 'patient');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'فشل تسجيل الدخول');
        }

        // Store user info and role in sessionStorage
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userRole', data.user.role);
        sessionStorage.setItem('loggedInUser', JSON.stringify(data.user));

        toast({ title: 'تم تسجيل الدخول بنجاح', description: `مرحباً بعودتك، ${data.user.name}!` });
        
        // Redirect based on role
        switch(data.user.role) {
            case 'admin':
                router.push('/dashboard');
                break;
            case 'doctor':
                router.push('/dashboard/doctor');
                break;
            case 'patient':
                router.push('/dashboard/patient');
                break;
            default:
                router.push('/');
        }

    } catch (error) {
        toast({
            title: 'فشل تسجيل الدخول',
            description: (error as Error).message,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
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
            {role === 'admin' ? 'الرجاء إدخال بيانات اعتماد المسؤول.' : 'أدخل بياناتك للوصول إلى حسابك.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <RadioGroup
                defaultValue={role}
                onValueChange={setRole}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="patient" id="patient" className="sr-only" />
                  <Label
                    htmlFor="patient"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${
                      role === 'patient' ? 'border-primary' : ''
                    }`}
                  >
                    أنا مريض
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="doctor"
                    id="doctor"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="doctor"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${
                      role === 'doctor' ? 'border-primary' : ''
                    }`}
                  >
                   أنا طبيب
                  </Label>
                </div>
            </RadioGroup>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
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
