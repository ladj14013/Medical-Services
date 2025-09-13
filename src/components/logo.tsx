import { Stethoscope } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Stethoscope className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold tracking-tighter text-foreground font-headline">
        الخدمات الطبية
      </h1>
    </div>
  );
}
