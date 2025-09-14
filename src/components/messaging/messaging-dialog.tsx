'use client';
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

interface MessagingDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MessagingDialog({
  isOpen,
  setIsOpen,
}: MessagingDialogProps) {
  const router = useRouter();

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
          <ConnectionsList
            onSelectConnection={handleSelectConnection}
            inDialog={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
