'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { currentUser } from '@/lib/data';
import {
  Form,
  FormControl,
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

const profileSchema = z.object({
  name: z.string().min(2, 'يجب أن يتكون الاسم من حرفين على الأقل.'),
  email: z.string().email('عنوان بريد إلكتروني غير صالح.'),
  medicalHistory: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name || '',
      email: currentUser.email || '',
      medicalHistory: currentUser.medicalHistory || '',
    },
  });

  function onSubmit(data: ProfileFormValues) {
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
            <CardDescription>قم بتحديث بياناتك الشخصية وتاريخك الطبي هنا.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="medicalHistory"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>التاريخ الطبي</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="مثال: الحساسية، العمليات الجراحية السابقة ..."
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
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
