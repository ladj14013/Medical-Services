
'use client';

import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Doctor } from '@/lib/types';
import { X, ImagePlus, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

const settingsSchema = z.object({
  bio: z.string().min(10, 'يجب أن تكون السيرة الذاتية 10 أحرف على الأقل.').max(500, 'يجب أن تكون السيرة الذاتية 500 حرف كحد أقصى.'),
  dailyAppointmentLimit: z.coerce
    .number()
    .min(1, 'الحد الأدنى هو موعد واحد في اليوم.')
    .max(50, 'الحد الأقصى هو 50 موعدًا في اليوم.'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function DoctorSettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPromoImageUrl, setNewPromoImageUrl] = useState('');

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      bio: '',
      dailyAppointmentLimit: 10,
    },
  });
  
  useEffect(() => {
    async function fetchDoctorData() {
      setIsLoading(true);
      const userJson = sessionStorage.getItem('loggedInUser');
      const userRole = sessionStorage.getItem('userRole');

      if (!userJson || userRole !== 'doctor') {
        router.push('/login?role=doctor');
        return;
      }
      
      const loggedInDoctor: Doctor = JSON.parse(userJson);

      try {
        const res = await fetch(`/api/doctors/${loggedInDoctor.id}`);
        if (!res.ok) throw new Error('Doctor not found');
        
        const doctorData = await res.json();
        setDoctor(doctorData);
        form.reset({
          bio: doctorData.bio || '',
          dailyAppointmentLimit: doctorData.dailyAppointmentLimit || 10,
        });

      } catch (error) {
        console.error("Failed to fetch doctor settings:", error);
        toast({ title: 'خطأ', description: 'فشل في تحميل بيانات الطبيب.', variant: 'destructive'});
        router.push('/dashboard/doctor');
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoctorData();
  }, [router, toast, form]);


  async function onSubmit(data: SettingsFormValues) {
    if (!doctor) return;
    setIsSubmitting(true);
    try {
        const response = await fetch(`/api/doctors/${doctor.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio: data.bio }),
        });

        if (!response.ok) {
            throw new Error('فشل تحديث الملف الشخصي');
        }
        
        setDoctor(prev => prev ? { ...prev, bio: data.bio } : null);
        toast({
          title: 'تم تحديث الإعدادات',
          description: 'تم تحديث سيرتك الذاتية بنجاح.',
        });

    } catch (error) {
        toast({ title: 'خطأ', description: 'فشل حفظ التغييرات.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  }

  const updatePromotionalImages = async (newImages: { id: string; url: string; hint: string }[]) => {
      if (!doctor) return;
      
      try {
          const response = await fetch(`/api/doctors/${doctor.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ promotionalImages: newImages }),
          });
          if (!response.ok) throw new Error('فشل تحديث الصور');
          
          setDoctor(prev => prev ? { ...prev, promotionalImages: newImages } : null);
          
      } catch (error) {
          toast({ title: 'خطأ', description: 'فشل تحديث الصور الترويجية.', variant: 'destructive' });
          // Optionally revert state
          const res = await fetch(`/api/doctors/${doctor.id}`);
          const originalDoctor = await res.json();
          setDoctor(originalDoctor);
      }
  }

  const handleAddPromoImage = () => {
    if (newPromoImageUrl.trim() && doctor) {
        const newImage = {
            id: `promo-${Date.now()}`,
            url: newPromoImageUrl,
            hint: 'clinic office' // default hint
        };
        const updatedImages = [...(doctor.promotionalImages || []), newImage];
        updatePromotionalImages(updatedImages);
        setNewPromoImageUrl('');
        toast({ title: 'تمت إضافة الصورة الترويجية' });
    }
  }

  const handleRemovePromoImage = (idToRemove: string) => {
    if (doctor) {
       const updatedImages = doctor.promotionalImages?.filter(img => img.id !== idToRemove) || [];
       updatePromotionalImages(updatedImages);
       toast({ title: 'تمت إزالة الصورة الترويجية', variant: 'destructive' });
    }
  }

  if (isLoading || !doctor) {
    return (
        <AppLayout>
            <div className="flex-1 space-y-6 p-4 sm:p-8">
                 <div className="flex items-center justify-between space-y-2">
                    <Skeleton className="h-9 w-1/3" />
                </div>
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                </Card>
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-40 w-full" /></CardContent>
                </Card>
            </div>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-6 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            إعدادات الملف الشخصي
          </h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>السيرة الذاتية والبيانات العامة</CardTitle>
                <CardDescription>
                   قم بتحديث سيرتك الذاتية ومعلوماتك الأخرى هنا.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                         <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>السيرة الذاتية</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="أخبر المرضى عنك وعن خبراتك..." rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dailyAppointmentLimit"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>الحد الأقصى للمواعيد اليومية</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="max-w-xs"/>
                                </FormControl>
                                <FormDescription>هذه الميزة قيد التطوير حاليًا.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin"/>}
                            حفظ التغييرات
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Separator />

         <Card>
            <CardHeader>
                <CardTitle>إدارة الصور</CardTitle>
                <CardDescription>
                    أضف صورًا ترويجية لعيادتك لجذب المرضى.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium mb-4">الصور الترويجية</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {doctor.promotionalImages?.map(image => (
                            <div key={image.id} className="relative group">
                                <Image 
                                    src={image.url} 
                                    alt="صورة ترويجية" 
                                    width={200}
                                    height={150}
                                    className="rounded-lg object-cover aspect-[4/3]"
                                />
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemovePromoImage(image.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 max-w-sm items-end">
                        <div className="flex-grow">
                             <Label htmlFor="promo-image-url">رابط الصورة الترويجية الجديدة</Label>
                             <Input 
                                id="promo-image-url"
                                placeholder="الصق رابط الصورة هنا" 
                                value={newPromoImageUrl} 
                                onChange={(e) => setNewPromoImageUrl(e.target.value)}
                             />
                        </div>
                        <Button onClick={handleAddPromoImage} disabled={!newPromoImageUrl.trim()}>
                            <ImagePlus className="ml-2" />
                            إضافة
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 max-w-sm">
                        استخدم صورًا من مواقع مثل Unsplash أو Pexels، أو الصق روابط صور مباشرة.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

