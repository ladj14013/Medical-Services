'use client';

import { useState } from 'react';
import { addDays, format, isBefore } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
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
import type { Doctor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import AiSuggestionsDialog from './ai-suggestions-dialog';

interface BookingClientProps {
  doctor: Doctor;
}

export default function BookingClient({ doctor }: BookingClientProps) {
  const [date, setDate] = useState<Date | undefined>(
    new Date(Date.now() + 86400000)
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isAiDialogOpen, setAiDialogOpen] = useState(false);

  const { toast } = useToast();

  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  const availableTimes = doctor.availability[formattedDate] || [];

  const handleBooking = () => {
    if (!date || !selectedTime) {
      toast({
        title: 'Incomplete Selection',
        description: 'Please select a date and time.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate a booked slot to trigger AI
    if (selectedTime === '10:00 AM' || selectedTime === '02:00 PM') {
      toast({
        title: 'Booking Failed',
        description:
          'This time slot is no longer available. We are looking for alternatives.',
        variant: 'destructive',
      });
      setAiDialogOpen(true);
    } else {
      toast({
        title: 'Appointment Booked!',
        description: `Your appointment with ${
          doctor.name
        } on ${format(date, 'PPP')} at ${selectedTime} is confirmed.`,
      });
      // Here you would typically update the backend
      setSelectedTime('');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>1. Select a Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
                    disabled={(day) => isBefore(day, new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>2. Select a Time</Label>
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
                    No available times for this date.
                  </p>
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={handleBooking}
            disabled={!date || !selectedTime}
            className="w-full text-lg py-6"
          >
            Confirm Booking
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
