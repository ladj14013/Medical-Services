import AppLayout from '@/components/app-layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-9 w-64" />
        </div>
         <div className="text-center py-10">
            <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
      </div>
    </AppLayout>
  );
}
