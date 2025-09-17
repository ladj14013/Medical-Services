
import AppLayout from '@/components/app-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

export default function PostLoading() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-6 p-4 sm:p-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center gap-4 pt-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-48" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>

        <div className="space-y-4">
            <Skeleton className="h-7 w-40" />
             <Card className="bg-muted/50">
                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </CardHeader>
            </Card>
             <Card className="bg-muted/50">
                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </CardHeader>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>

      </div>
    </AppLayout>
  );
}
