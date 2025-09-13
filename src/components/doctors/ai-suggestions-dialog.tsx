'use client';
import { useState, useEffect, use } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { suggestAlternateAppointments } from '@/ai/flows/suggest-alternate-appointments';
import { Doctor } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AiSuggestionsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  preferredTimeSlot: string;
  doctor: Doctor;
}

export default function AiSuggestionsDialog({
  isOpen,
  setIsOpen,
  preferredTimeSlot,
  doctor,
}: AiSuggestionsDialogProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        setSuggestions([]);
        try {
          const result = await suggestAlternateAppointments({
            preferredDoctorSpecialization: doctor.specialization,
            preferredTimeSlot,
            userPreferences: 'Same location if possible.',
            unavailableDoctors: [doctor.id],
          });
          setSuggestions(result.alternateSuggestions);
        } catch (error) {
          console.error('AI suggestion error:', error);
          setSuggestions(['We could not find any alternatives at this moment.']);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSuggestions();
    }
  }, [isOpen, preferredTimeSlot, doctor]);
  
  const handleSelectSuggestion = (suggestion: string) => {
    setIsOpen(false);
    toast({
      title: 'Appointment Booked!',
      description: `Your appointment for: "${suggestion}" has been confirmed.`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alternate Appointments</DialogTitle>
          <DialogDescription>
            The selected time is unavailable. Here are some AI-powered
            suggestions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ul className="space-y-2 list-disc list-inside">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer" onClick={() => handleSelectSuggestion(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
