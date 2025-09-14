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

// For this prototype, we'll assume Dr. Reed (id: '1') is logged in.
const loggedInDoctorId = '1';

const settingsSchema = z.object({
  dailyAppointmentLimit: z.coerce
    .number()
    .min(1, 'الحد الأدنى هو موعد واحد في اليوم.')
    .max(50, 'الحد الأقصى هو 50 موعدًا في اليوم.'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function DoctorSettingsPage() {
  const { toast } = useToast();
  // This would come from auth in a real app
  const doctor = doctors.find((doc) => doc.id === loggedInDoctorId);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      dailyAppointmentLimit: doctor?.dailyAppointmentLimit || 10,
    },
  });

  function onSubmit(data: SettingsFormValues) {
    // In a real app, you would update the doctor's data in the database
    console.log(data);
    toast({
      title: 'تم تحديث الإعدادات',
      description: `تم تحديث الحد الأقصى للمواعيد اليومية إلى ${data.dailyAppointmentLimit}.`,
    });
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
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            إعدادات الملف الشخصي للطبيب
          </h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>إدارة المواعيد</CardTitle>
                <CardDescription>
                    قم بتعيين الحد الأقصى لعدد المواعيد التي يمكنك استقبالها يوميًا. سيؤدي هذا إلى حظر الحجوزات الجديدة تلقائيًا في أي يوم يصل إلى هذا الحد.
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
      </div>
    </AppLayout>
  );
}
