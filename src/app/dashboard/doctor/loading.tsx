import AppLayout from '@/components/app-layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function DoctorDashboardLoading() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Skeleton className="h-40 w-full rounded-lg" />
             <Skeleton className="h-40 w-full rounded-lg" />
             <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      </div>
    </AppLayout>
  );
}
