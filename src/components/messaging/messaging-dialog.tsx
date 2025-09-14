'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ConnectionsList from '../doctors/connections-list';
import ChatWindow from './chat-window';
import type { Doctor } from '@/lib/types';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MessagingDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  loggedInDoctor: Doctor;
}

export default function MessagingDialog({
  isOpen,
  setIsOpen,
  loggedInDoctor,
}: MessagingDialogProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const router = useRouter();

  const handleSelectConnection = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };
  
  const handleBackToList = () => {
    setSelectedDoctor(null);
  }

  const handleOpenFullChat = (doctor: Doctor) => {
    sessionStorage.setItem('selectedDoctorId', doctor.id);
    setIsOpen(false);
    setSelectedDoctor(null);
    router.push('/messaging');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            setSelectedDoctor(null); // Reset on close
        }
    }}>
      <DialogContent className="sm:max-w-[425px] md:max-w-md lg:max-w-lg p-0">
        <DialogHeader className="p-6 pb-0">
           {selectedDoctor && (
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBackToList}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>المحادثة مع {selectedDoctor.name}</DialogTitle>
             </div>
           )}
           {!selectedDoctor && (
             <>
                <DialogTitle>المراسلة</DialogTitle>
                <DialogDescription>
                    اختر محادثة من قائمة جهات الاتصال الخاصة بك.
                </DialogDescription>
            </>
           )}
        </DialogHeader>
        <div className="p-6 h-[60vh] max-h-[60vh]">
          {selectedDoctor ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 min-h-0">
                 <ChatWindow recipient={selectedDoctor} sender={loggedInDoctor} />
              </div>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => handleOpenFullChat(selectedDoctor)}
              >
                عرض في وضع ملء الشاشة
              </Button>
            </div>
          ) : (
            <ConnectionsList
              onSelectConnection={handleSelectConnection}
              inDialog={true}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
