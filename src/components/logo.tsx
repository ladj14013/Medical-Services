import { Stethoscope } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary">
      <Stethoscope className="h-8 w-8" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        Medical Services
      </span>
    </div>
  );
}
