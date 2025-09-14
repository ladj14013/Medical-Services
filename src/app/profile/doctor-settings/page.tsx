'use client';

import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { doctors } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useState } from 'react';
import type { Doctor } from '@/lib/types';
import { X, ImagePlus } from 'lucide-react';
import { Label } from '@/components/ui/label';

// For this prototype, we'll assume Dr. Reed (id: '1') is logged in.
const loggedInDoctorId = '1';

const settingsSchema = z.object({
  dailyAppointmentLimit: z.coerce
    .number()
    .min(1, 'الحد الأدنى هو موعد واحد في اليوم.')
    .max(50, 'الحد الأقصى هو 50 موعدًا في اليوم.'),
  profilePictureUrl: z.string().url('يجب أن يكون عنوان URL صالحًا.').optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function DoctorSettingsPage() {
  const { toast } = useToast();
  // This would come from auth in a real app
  const [doctor, setDoctor] = useState(doctors.find((doc) => doc.id === loggedInDoctorId));
  const [newPromoImageUrl, setNewPromoImageUrl] = useState('');

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      dailyAppointmentLimit: doctor?.dailyAppointmentLimit || 10,
      profilePictureUrl: '',
    },
  });

  function onSubmit(data: SettingsFormValues) {
    // In a real app, you would update the doctor's data in the database
    console.log(data);
    if (data.profilePictureUrl && doctor) {
        // This is a simulation. In a real app, you'd upload the image
        // and update the imageId with the new URL's ID.
        // For now, we are not changing the actual image.
    }
    toast({
      title: 'تم تحديث الإعدادات',
      description: 'تم تحديث إعدادات ملفك الشخصي بنجاح.',
    });
  }

  const handleAddPromoImage = () => {
    if (newPromoImageUrl.trim() && doctor) {
        const newImage = {
            id: `promo-${Date.now()}`,
            url: newPromoImageUrl,
            hint: 'clinic office' // default hint
        };
        const updatedDoctor: Doctor = {
            ...doctor,
            promotionalImages: [...(doctor.promotionalImages || []), newImage]
        }
        setDoctor(updatedDoctor);
        setNewPromoImageUrl('');
        toast({ title: 'تمت إضافة الصورة الترويجية' });
    }
  }

  const handleRemovePromoImage = (idToRemove: string) => {
    if (doctor) {
       const updatedDoctor: Doctor = {
            ...doctor,
            promotionalImages: doctor.promotionalImages?.filter(img => img.id !== idToRemove)
        }
        setDoctor(updatedDoctor);
        toast({ title: 'تمت إزالة الصورة الترويجية', variant: 'destructive' });
    }
  }

  if (!doctor) {
    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 sm:p-8">
                <p>لم يتم العثور على الطبيب.</p>
            </div>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-6 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            إعدادات الملف الشخصي للطبيب
          </h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>إدارة المواعيد</CardTitle>
                <CardDescription>
                    قم بتعيين الحد الأقصى لعدد المواعيد التي يمكنك استقبالها يوميًا.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-sm">
                        <FormField
                            control={form.control}
                            name="dailyAppointmentLimit"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>الحد الأقصى للمواعيد اليومية</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">حفظ الإعدادات</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Separator />

         <Card>
            <CardHeader>
                <CardTitle>إدارة الصور</CardTitle>
                <CardDescription>
                    قم بتحديث صورتك الشخصية وأضف صورًا ترويجية لعيادتك.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-sm">
                        <FormField
                            control={form.control}
                            name="profilePictureUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>تغيير الصورة الشخصية</FormLabel>
                                <FormControl>
                                    <Input placeholder="الصق رابط الصورة الشخصية الجديدة هنا" {...field} />
                                </FormControl>
                                 <FormDescription>
                                     في هذا النموذج المبدئي، يرجى لصق رابط مباشر للصورة.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">تحديث الصورة الشخصية</Button>
                    </form>
                </Form>
                
                <Separator />

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
                        أضف صورًا لغرفة الانتظار، أو غرف الفحص، أو المعدات لجذب المزيد من المرضى.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
