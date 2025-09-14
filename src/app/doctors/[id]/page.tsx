import AppLayout from '@/components/app-layout';
import BookingClient from '@/components/doctors/booking-client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import data from '@/lib/placeholder-images.json';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Stethoscope, Send, GalleryVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SendMessageDialog from '@/components/doctors/send-message-dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { Doctor } from '@/lib/types';
import { doctors as staticDoctors } from '@/lib/data';

async function getDoctor(id: string): Promise<Doctor | null> {
  try {
    // In a real app, you might use a more robust fetching library like SWR or React Query
    // For server components, a direct fetch is fine.
    // The URL should be absolute for server-side fetching.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const res = await fetch(`${baseUrl}/api/doctors/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch doctor', error);
    return null;
  }
}

export default async function DoctorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const doctor = await getDoctor(params.id);

  if (!doctor) {
    notFound();
  }

  const doctorImage = data.placeholderImages.find(
    (img) => img.id === doctor.imageId
  );

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 text-center">
                 <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-primary/20">
                  {doctorImage && (
                    <AvatarImage
                      src={doctorImage.imageUrl}
                      alt={doctorImage.description}
                      width={128}
                      height={128}
                      data-ai-hint={doctorImage.imageHint}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className='text-4xl'>{doctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold font-headline">{doctor.name}</h1>
                 <p className="flex items-center justify-center gap-2 text-muted-foreground mt-1">
                    <Stethoscope className="w-5 h-5" />
                    {doctor.specialization}
                </p>
                <p className="flex items-center justify-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="w-5 h-5" />
                    {doctor.location}
                </p>
              </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold font-headline">حول</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{doctor.bio}</p>
                </CardContent>
            </Card>
             <SendMessageDialog recipient={doctor} />
          </div>
          <div className="md:col-span-2 space-y-8">
            <BookingClient doctor={doctor} />

            {doctor.promotionalImages && doctor.promotionalImages.length > 0 && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline flex items-center gap-2">
                            <GalleryVertical />
                            معرض الصور
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <Carousel className="w-full max-w-xl mx-auto">
                          <CarouselContent>
                            {doctor.promotionalImages.map((image) => (
                              <CarouselItem key={image.id}>
                                <div className="p-1">
                                  <Card className="overflow-hidden">
                                    <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                                       <Image 
                                            src={image.url}
                                            alt={image.hint}
                                            width={600}
                                            height={400}
                                            className="object-cover w-full h-full"
                                            data-ai-hint={image.hint}
                                        />
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export async function generateStaticParams() {
  // Use the static data for generating params as it's cheap
  return staticDoctors.map((doctor) => ({
    id: doctor.id,
  }));
}
