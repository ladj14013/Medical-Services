'use client';
import { doctors } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import data from '@/lib/placeholder-images.json';
import type { Doctor } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface ConnectionsListProps {
    onSelectConnection: (doctor: Doctor) => void;
    selectedConnectionId?: string;
    inDialog?: boolean;
}

export default function ConnectionsList({ onSelectConnection, selectedConnectionId, inDialog = false }: ConnectionsListProps) {
    // For this prototype, we'll assume Dr. Reed (id: '1') is logged in.
    const loggedInDoctorId = '1';
    const loggedInDoctor = doctors.find(doc => doc.id === loggedInDoctorId);
    
    if (!loggedInDoctor) return null;

    const connections = doctors.filter(doc => loggedInDoctor.connections?.includes(doc.id));
    
    const ListContent = () => (
        <ScrollArea className="h-full">
            <div className="space-y-2">
                {connections.length > 0 ? (
                    connections.map(doctor => {
                        const doctorImage = data.placeholderImages.find(img => img.id === doctor.imageId);
                        return (
                            <button 
                                key={doctor.id} 
                                className={cn(
                                    "flex w-full items-center gap-3 text-right p-3 rounded-lg hover:bg-muted transition-colors",
                                    selectedConnectionId === doctor.id && 'bg-muted'
                                )}
                                onClick={() => onSelectConnection(doctor)}
                            >
                                <Avatar className="h-10 w-10">
                                    {doctorImage && <AvatarImage src={doctorImage.imageUrl} alt={doctor.name} />}
                                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{doctor.name}</p>
                                    <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                                </div>
                            </button>
                        )
                    })
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">ليس لديك أي جهات اتصال بعد.</p>
                )}
            </div>
        </ScrollArea>
    );

    if (inDialog) {
        return <ListContent />;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>جهات الاتصال</CardTitle>
                <CardDescription>الأطباء الذين تواصلت معهم.</CardDescription>
            </CardHeader>
            <CardContent className="p-2 flex-1">
                <ListContent />
            </CardContent>
        </Card>
    )
}
