import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Stethoscope } from 'lucide-react';
import type { Doctor } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import data from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const doctorImage = data.placeholderImages.find(
    (img) => img.id === doctor.imageId
  );
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          {doctorImage && (
            <AvatarImage
              src={doctorImage.imageUrl}
              alt={doctorImage.description}
              width={64}
              height={64}
              data-ai-hint={doctorImage.imageHint}
            />
          )}
          <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <CardTitle className="font-headline text-xl">{doctor.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-1">
             <Stethoscope className="w-4 h-4" /> {doctor.specialization}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{doctor.bio}</p>
        <div className="flex items-center gap-2 pt-4">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{doctor.location}</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild className="w-full" variant="accent">
          <Link href={`/doctors/${doctor.id}`}>حجز موعد</Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.location)}`} target="_blank" rel="noopener noreferrer">
                <MapPin className="h-4 w-4" />
                <span className="sr-only">عرض الخريطة</span>
            </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
