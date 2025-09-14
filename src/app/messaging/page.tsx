'use client';
import { useState } from 'react';
import AppLayout from '@/components/app-layout';
import ConnectionsList from '@/components/doctors/connections-list';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';
import type { Doctor } from '@/lib/types';
import ChatWindow from '@/components/messaging/chat-window';
import { doctors } from '@/lib/data';

export default function MessagingPage() {
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    // For this prototype, we'll assume Dr. Reed (id: '1') is logged in.
    const loggedInDoctorId = '1';
    const loggedInDoctor = doctors.find(doc => doc.id === loggedInDoctorId);
    if (!loggedInDoctor) return null; // Or show an error state

    return (
        <AppLayout>
            <div className="flex-1 p-4 sm:p-8">
                <div className="flex items-center justify-between space-y-2 mb-6">
                    <div>
                         <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                           <Send className="h-8 w-8" /> المراسلة
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            تواصل مع زملائك الأطباء.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[350px_1fr] h-[calc(100vh-220px)]">
                    <div className="md:col-span-1">
                        <ConnectionsList 
                            onSelectConnection={setSelectedDoctor}
                            selectedConnectionId={selectedDoctor?.id}
                        />
                    </div>
                    <div className="md:col-span-1">
                         {selectedDoctor ? (
                            <ChatWindow recipient={selectedDoctor} sender={loggedInDoctor} />
                         ) : (
                            <Card className="h-full flex items-center justify-center border-dashed">
                                <CardContent className="p-6 text-center">
                                    <p className="text-muted-foreground">
                                        حدد جهة اتصال لبدء محادثة.
                                    </p>
                                </CardContent>
                            </Card>
                         )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
