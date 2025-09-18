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
import type { Doctor, User } from '@/lib/types';
import { Send, UserPlus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface SendMessageDialogProps {
  recipient: Doctor;
}

export default function SendMessageDialog({ recipient }: SendMessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<User | Doctor | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const userJson = sessionStorage.getItem('loggedInUser');
    setUserRole(role);
    if(userJson) {
        setLoggedInUser(JSON.parse(userJson));
    }
  }, []);

  const loggedInDoctor = userRole === 'doctor' ? (loggedInUser as Doctor) : null;
  const areConnected = loggedInDoctor?.connections?.includes(recipient.id);

  const handleSend = () => {
    if (message.trim() && loggedInDoctor) {
      // In a real app, this would send the message to the backend.
      // For now, it just simulates the action.
      console.log(`Sending message to ${recipient.name}: ${message}`);
      
      const title = areConnected ? 'تم إرسال الرسالة' : 'تم إرسال طلب الاتصال';
      const description = areConnected 
        ? `تم إرسال رسالتك إلى ${recipient.name} بنجاح.`
        : `تم إرسال طلب الاتصال الخاص بك إلى ${recipient.name}. سيتم إعلامك عند قبوله.`;

      toast({ title, description });
      setMessage('');
      setIsOpen(false);
    }
  };
  
  if (userRole !== 'doctor' || !loggedInDoctor || recipient.id === loggedInDoctor.id) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card>
          <CardContent className="p-4 text-center">
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                {areConnected ? <Send className="ml-2 h-4 w-4" /> : <UserPlus className="ml-2 h-4 w-4" />}
                {areConnected ? 'إرسال رسالة' : 'إرسال طلب اتصال'}
              </Button>
            </DialogTrigger>
          </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
             {areConnected ? `إرسال رسالة إلى ${recipient.name}` : `إرسال طلب اتصال إلى ${recipient.name}`}
          </DialogTitle>
          <DialogDescription>
            {areConnected 
              ? 'سيتم إخطار الطبيب برسالتك.' 
              : 'إذا قبل الطبيب طلبك، ستتمكنان من التواصل مباشرة.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">
              {areConnected ? 'رسالتك' : 'رسالة الطلب'}
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
