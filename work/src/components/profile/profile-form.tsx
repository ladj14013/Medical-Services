'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/lib/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'يجب أن يتكون الاسم من حرفين على الأقل.'),
  email: z.string().email('عنوان بريد إلكتروني غير صالح.'),
  phoneNumber: z.string().optional(),
  medicalHistory: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      medicalHistory: user.medicalHistory || '',
    },
  });

  function onSubmit(data: ProfileFormValues) {
    // In a real app, you would send this to an API endpoint to update the user
    console.log(data);
    toast({
      title: 'تم تحديث الملف الشخصي',
      description: 'تم حفظ معلوماتك الشخصية.',
    });
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
            <CardDescription>قم بتحديث بياناتك الشخصية هنا. التاريخ الطبي لا يمكن تعديله إلا من قبل الأطباء.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                            <Input placeholder="اسمك" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>عنوان البريد الإلكتروني</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                            <Input placeholder="رقم هاتفك" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>التاريخ الطبي</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Textarea
                                placeholder="لا يوجد تاريخ طبي مسجل."
                                className="resize-none pr-10 bg-muted/50"
                                {...field}
                                readOnly
                            />
                             <Lock className="absolute top-3 right-3 h-4 w-4 text-muted-foreground" />
                        </div>
                    </FormControl>
                     <FormDescription>
                        هذا الحقل يمكن تعديله فقط من قبل مقدمي الرعاية الصحية المعتمدين.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">حفظ التغييرات</Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
