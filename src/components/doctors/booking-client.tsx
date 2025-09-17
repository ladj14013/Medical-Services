'use client';

import { useState, useEffect } from 'react';
import { addDays, format, isBefore, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Doctor, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import AiSuggestionsDialog from './ai-suggestions-dialog';
import { useRouter } from 'next/navigation';

interface BookingClientProps {
  doctor: Doctor;
}

export default function BookingClient({ doctor }: BookingClientProps) {
  const [date, setDate] = useState<Date | undefined>(
    new Date(Date.now() + 86400000)
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiDialogOpen, setAiDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const userJson = sessionStorage.getItem('loggedInUser');
    const userRole = sessionStorage.getItem('userRole');
    if (userJson && userRole === 'patient') {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  const availableTimes = doctor.availability[formattedDate] || ['09:00 ص', '10:00 ص', '11:00 ص', '02:00 م', '03:00 م', '04:00 م'];

  const handleBooking = async () => {
    if (!currentUser) {
      toast({
        title: 'يرجى تسجيل الدخول',
        description: 'يجب عليك تسجيل الدخول كمريض لتتمكن من حجز موعد.',
        variant: 'destructive',
      });
      router.push('/login?role=patient');
      return;
    }

    if (!date || !selectedTime) {
      toast({
        title: 'اختيار غير مكتمل',
        description: 'الرجاء اختيار التاريخ والوقت.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          doctorName: doctor.name,
          doctorSpecialization: doctor.specialization,
          patientId: currentUser.id,
          patientName: currentUser.name,
          date: format(date, 'yyyy-MM-dd'),
          time: selectedTime,
          reason: 'فحص أولي',
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast({
            title: 'فشل الحجز',
            description: responseData.message || 'هذا الوقت لم يعد متاحًا. نحن نبحث عن بدائل.',
            variant: 'destructive',
          });
          setAiDialogOpen(true);
        } else {
          throw new Error(responseData.message || 'فشل حجز الموعد.');
        }
      } else {
        toast({
          title: 'تم حجز الموعد!',
          description: `تم تأكيد موعدك مع ${doctor.name} في ${format(date, 'PPP', { locale: ar })} الساعة ${selectedTime}.`,
        });
        setSelectedTime('');
        router.push('/dashboard/patient');
      }

    } catch (error) {
       if (error instanceof Error) {
          toast({
            title: 'خطأ',
            description: error.message,
            variant: 'destructive',
          });
       }
    } finally {
      setIsLoading(false);
    }
  };

  const isDayDisabled = (day: Date): boolean => {
    if (isBefore(day, new Date()) && !isSameDay(day, new Date())) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">احجز موعدًا</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>١. اختر تاريخًا</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: ar }) : <span>اختر تاريخًا</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setSelectedTime('');
                    }}
                    initialFocus
                    disabled={isDayDisabled}
                    locale={ar}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>٢. اختر وقتًا</Label>
              {availableTimes.length > 0 ? (
                <RadioGroup
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                >
                  {availableTimes.map((time) => (
                    <div key={time}>
                      <RadioGroupItem
                        value={time}
                        id={time}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={time}
                        className={cn(
                          'flex items-center justify-center p-2 rounded-md border-2 cursor-pointer transition-colors',
                          selectedTime === time
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-transparent hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        {time}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="flex items-center justify-center h-full p-4 border rounded-md bg-muted/50">
                  <p className="text-muted-foreground">
                    لا توجد أوقات متاحة في هذا التاريخ.
                  </p>
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={handleBooking}
            disabled={!date || !selectedTime || isLoading}
            className="w-full text-lg py-6"
          >
            {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
            {isLoading ? 'جاري الحجز...' : 'تأكيد الحجز'}
          </Button>
        </CardContent>
      </Card>
      <AiSuggestionsDialog
        isOpen={isAiDialogOpen}
        setIsOpen={setAiDialogOpen}
        preferredTimeSlot={selectedTime}
        doctor={doctor}
      />
    </>
  );
}
