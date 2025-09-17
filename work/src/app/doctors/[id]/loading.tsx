import AppLayout from '@/components/app-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function DoctorProfileLoading() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-5 w-1/2 mx-auto mt-2" />
                <Skeleton className="h-5 w-1/2 mx-auto mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6 space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-72 w-full" />
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-1/3" />
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
