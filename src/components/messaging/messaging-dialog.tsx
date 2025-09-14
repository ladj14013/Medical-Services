'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ConnectionsList from '../doctors/connections-list';
import type { Doctor } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

interface MessagingDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MessagingDialog({
  isOpen,
  setIsOpen,
}: MessagingDialogProps) {
  const router = useRouter();
  const [connections, setConnections] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const loggedInDoctorId = '1';

  useEffect(() => {
    if (isOpen) {
      const fetchConnections = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('/api/doctors');
          const allDoctors: Doctor[] = await res.json();
          const loggedInDoc = allDoctors.find(d => d.id === loggedInDoctorId);
          if (loggedInDoc && loggedInDoc.connections) {
            const doctorConnections = allDoctors.filter(doc => loggedInDoc.connections?.includes(doc.id));
            setConnections(doctorConnections);
          }
        } catch (error) {
          console.error("Failed to fetch connections for dialog:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchConnections();
    }
  }, [isOpen]);

  const handleSelectConnection = (doctor: Doctor) => {
    sessionStorage.setItem('selectedDoctorId', doctor.id);
    setIsOpen(false);
    router.push('/messaging');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-md lg:max-w-sm p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>المراسلة</DialogTitle>
          <DialogDescription>
            اختر محادثة من قائمة جهات الاتصال الخاصة بك لعرضها.
          </DialogDescription>
        </DialogHeader>
        <div className="p-2 h-[60vh] max-h-[60vh]">
          {isLoading ? (
             <div className="space-y-2 p-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <ConnectionsList
                connections={connections}
                onSelectConnection={handleSelectConnection}
                inDialog={true}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
