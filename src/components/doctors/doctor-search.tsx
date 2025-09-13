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
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors);

  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = doctors.filter((doctor) => {
      return (
        doctor.name.toLowerCase().includes(lowercasedSearchTerm) ||
        doctor.specialization.toLowerCase().includes(lowercasedSearchTerm) ||
        doctor.location.toLowerCase().includes(lowercasedSearchTerm)
      );
    });
    setFilteredDoctors(results);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    setFilteredDoctors(doctors);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-card border rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-3 space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              البحث بالاسم أو التخصص أو الموقع
            </label>
            <Input
              id="search"
              placeholder="مثال: د. ريد، طب القلب، أو سبرينغفيلد"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 md:col-span-1">
            <Button onClick={handleSearch} variant="outline" className="w-full">
              بحث
            </Button>
            <Button onClick={handleClear} variant="outline" className="w-full">
              مسح
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
