
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import type { Doctor } from '@/lib/types';
import { Send } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface SendMessageDialogProps {
  recipient: Doctor;
}

export default function SendMessageDialog({ recipient }: SendMessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the backend.
      console.log(`Sending message to ${recipient.name}: ${message}`);
      toast({
        title: 'تم إرسال الرسالة',
        description: `تم إرسال رسالتك إلى ${recipient.name} بنجاح.`,
      });
      setMessage('');
      setIsOpen(false);
    }
  };

  // Only show the message card if the logged-in user is a doctor
  if (userRole !== 'doctor') {
    return null;
  }
  
  // Don't show if viewing your own profile
  const loggedInDoctorId = '1'; // This would come from auth
  if (recipient.id === loggedInDoctorId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card>
          <CardContent className="p-4 text-center">
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Send className="ml-2 h-4 w-4" />
                إرسال رسالة
              </Button>
            </DialogTrigger>
          </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إرسال رسالة إلى {recipient.name}</DialogTitle>
          <DialogDescription>
            سيتم إخطار الطبيب برسالتك.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              رسالتك
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSend} disabled={!message.trim()}>إرسال</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
