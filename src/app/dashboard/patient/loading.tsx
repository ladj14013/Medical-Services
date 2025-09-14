import AppLayout from '@/components/app-layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientDashboardLoading() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
