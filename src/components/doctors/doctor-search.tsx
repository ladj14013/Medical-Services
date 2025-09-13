'use client';
import { useState } from 'react';
import type { Doctor } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DoctorCard from './doctor-card';
import { Button } from '../ui/button';

interface DoctorSearchProps {
  doctors: Doctor[];
}

export default function DoctorSearch({ doctors }: DoctorSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('all');
  const [location, setLocation] = useState('');

  const specializations = [
    'all',
    ...Array.from(new Set(doctors.map((doc) => doc.specialization))),
  ];
  
  const translatedSpecializations: {[key: string]: string} = {
    'all': 'جميع التخصصات',
    'Cardiology': 'طب القلب',
    'Dermatology': 'الأمراض الجلدية',
    'Pediatrics': 'طب الأطفال',
    'Neurology': 'طب الأعصاب',
  };

  const filteredDoctors = doctors.filter((doctor) => {
    return (
      (doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (specialization === 'all' || doctor.specialization === specialization) &&
      doctor.location.toLowerCase().includes(location.toLowerCase())
    );
  });
  
  const handleClear = () => {
    setSearchTerm('');
    setSpecialization('all');
    setLocation('');
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-card border rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              البحث بالاسم أو التخصص
            </label>
            <Input
              id="search"
              placeholder="مثال: د. ريد أو طب القلب"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="specialization" className="text-sm font-medium">
              التخصص
            </label>
            <Select value={specialization} onValueChange={setSpecialization}>
              <SelectTrigger id="specialization">
                <SelectValue placeholder="جميع التخصصات" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {translatedSpecializations[spec] || spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              الموقع
            </label>
            <Input
              id="location"
              placeholder="مثال: سبرينغفيلد، إلينوي"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
           <div className="md:col-start-4">
             <Button onClick={handleClear} variant="outline" className="w-full">
              مسح الفلاتر
            </Button>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <div className="md:col-span-3 text-center text-muted-foreground py-10">
            لم يتم العثور على أطباء يطابقون معاييرك.
          </div>
        )}
      </div>
    </div>
  );
}
