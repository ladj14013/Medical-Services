'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Stethoscope, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RegisterAsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function RegisterAsDialog({
  isOpen,
  setIsOpen,
}: RegisterAsDialogProps) {
  const router = useRouter();

  const handlePatientRegister = () => {
    setIsOpen(false);
    router.push('/register');
  };

  const handleDoctorRegister = () => {
    setIsOpen(false);
    router.push('/register/doctor');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='font-headline'>إنشاء حساب جديد</DialogTitle>
          <DialogDescription>
            اختر نوع الحساب الذي ترغب في إنشائه.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={handlePatientRegister}
          >
            <User className="h-8 w-8" />
            <span className="font-semibold">التسجيل كمريض</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={handleDoctorRegister}
          >
            <Stethoscope className="h-8 w-8" />
            <span className="font-semibold">التسجيل كطبيب</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
