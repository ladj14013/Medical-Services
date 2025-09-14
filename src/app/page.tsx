import AppLayout from '@/components/app-layout';
import SymptomChecker from '@/components/symptom-checker';

export default function HomePage() {

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 flex items-center justify-center">
         <SymptomChecker />
      </div>
    </AppLayout>
  );
}
