'use client';
import AppLayout from '@/components/app-layout';
import ConnectionsList from '@/components/doctors/connections-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';

export default function MessagingPage() {
    // In a real app, you would fetch and display actual chat threads.
    // For this prototype, we'll just show the list of connections.

    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 sm:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                         <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                           <Send className="h-8 w-8" /> المراسلة
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            تواصل مع زملائك الأطباء.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <ConnectionsList />
                    </div>
                    <div className="md:col-span-2">
                         <Card className="h-full flex items-center justify-center">
                            <CardContent className="p-6 text-center">
                                <p className="text-muted-foreground">
                                    حدد جهة اتصال لبدء محادثة.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
