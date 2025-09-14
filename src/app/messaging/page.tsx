'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import ConnectionsList from '@/components/doctors/connections-list';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';
import type { Doctor } from '@/lib/types';
import ChatWindow from '@/components/messaging/chat-window';
import { Skeleton } from '@/components/ui/skeleton';

export default function MessagingPage() {
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [loggedInDoctor, setLoggedInDoctor] = useState<Doctor | null>(null);
    const [connections, setConnections] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loggedInDoctorId = '1';

    useEffect(() => {
        async function fetchInitialData() {
            setIsLoading(true);
            try {
                const doctorsRes = await fetch('/api/doctors');
                const allDoctors: Doctor[] = await doctorsRes.json();
                
                const loggedInDoc = allDoctors.find(doc => doc.id === loggedInDoctorId);
                setLoggedInDoctor(loggedInDoc || null);

                if (loggedInDoc) {
                    const doctorConnections = allDoctors.filter(doc => loggedInDoc.connections?.includes(doc.id));
                    setConnections(doctorConnections);

                    const storedDoctorId = sessionStorage.getItem('selectedDoctorId');
                    if (storedDoctorId) {
                        const doctor = doctorConnections.find(doc => doc.id === storedDoctorId);
                        if (doctor) {
                            setSelectedDoctor(doctor);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch messaging data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchInitialData();
    }, []);

    const handleSelectConnection = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        sessionStorage.setItem('selectedDoctorId', doctor.id);
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex-1 p-4 sm:p-8">
                    <Skeleton className="h-10 w-48 mb-6" />
                    <div className="grid gap-6 md:grid-cols-[350px_1fr] h-[calc(100vh-220px)]">
                        <Skeleton className="h-full w-full" />
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>
            </AppLayout>
        );
    }
    
    if (!loggedInDoctor) return <AppLayout><div className="p-8">لم يتم العثور على الطبيب المسجل.</div></AppLayout>;

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
                            connections={connections}
                            onSelectConnection={handleSelectConnection}
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
