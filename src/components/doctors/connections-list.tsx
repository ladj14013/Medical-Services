'use client';
import { doctors } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import data from '@/lib/placeholder-images.json';
import { Button } from '../ui/button';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConnectionsList() {
    const { toast } = useToast();
    
    // For this prototype, we'll assume Dr. Reed (id: '1') is logged in.
    const loggedInDoctorId = '1';
    const loggedInDoctor = doctors.find(doc => doc.id === loggedInDoctorId);
    
    if (!loggedInDoctor) return null;

    const connections = doctors.filter(doc => loggedInDoctor.connections?.includes(doc.id));

    const handleStartChat = (doctorName: string) => {
        // In a real app, this would open a chat window.
        toast({
            title: 'بدء محادثة',
            description: `تم فتح نافذة محادثة مع ${doctorName}. (وظيفة غير مطبقة بعد)`,
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>جهات الاتصال</CardTitle>
                <CardDescription>الأطباء الذين تواصلت معهم.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {connections.length > 0 ? (
                    connections.map(doctor => {
                        const doctorImage = data.placeholderImages.find(img => img.id === doctor.imageId);
                        return (
                             <div key={doctor.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        {doctorImage && <AvatarImage src={doctorImage.imageUrl} alt={doctor.name} />}
                                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{doctor.name}</p>
                                        <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleStartChat(doctor.name)}>
                                    <MessageCircle className="h-5 w-5" />
                                </Button>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">ليس لديك أي جهات اتصال بعد.</p>
                )}
            </CardContent>
        </Card>
    )
}
