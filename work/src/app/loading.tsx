import AppLayout from '@/components/app-layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
