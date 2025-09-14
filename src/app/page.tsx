import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function HomePage() {

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 flex items-center justify-center">
         <Card className="w-full max-w-2xl text-center">
            <CardHeader>
                <CardTitle className="text-4xl font-bold tracking-tight font-headline">
                    مرحبًا بك في الخدمات الطبية
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground pt-2">
                    بوابتك لحجز المواعيد مع أفضل الأطباء بسهولة.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6">
                    يمكنك البدء بالبحث عن طبيب باستخدام زر البحث في الشريط الجانبي أو استعراض مواعيدك القادمة.
                </p>
                <Button size="lg" variant="accent">
                    <Search className="ml-2 h-5 w-5" />
                    ابدأ البحث الآن
                </Button>
            </CardContent>
         </Card>
      </div>
    </AppLayout>
  );
}
