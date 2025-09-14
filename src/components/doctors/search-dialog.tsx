'use client';
import { useState, useEffect } from 'react';
import type { Doctor } from '@/lib/types';
import { Input } from '@/components/ui/input';
import DoctorCard from './doctor-card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

interface SearchDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialSearch?: string;
}

export default function SearchDialog({ isOpen, setIsOpen, initialSearch }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchDoctors = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('/api/doctors');
          const data: Doctor[] = await res.json();
          setAllDoctors(data);
          // Apply initial search if it exists
           if (initialSearch) {
              setSearchTerm(initialSearch);
              const lowercasedSearchTerm = initialSearch.toLowerCase();
              const results = data.filter((doctor) => 
                doctor.specialization.toLowerCase().includes(lowercasedSearchTerm)
              );
              setFilteredDoctors(results);
          } else {
              setFilteredDoctors(data);
          }
        } catch (error) {
          console.error("Failed to fetch doctors:", error);
          setFilteredDoctors([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDoctors();
    }
  }, [isOpen, initialSearch]);


  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = allDoctors.filter((doctor) => {
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
    setFilteredDoctors(allDoctors);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
      )
    }

    if (filteredDoctors.length > 0) {
      return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
        </div>
      )
    }

    return (
       <div className="md:col-span-3 text-center text-muted-foreground py-10">
            لم يتم العثور على أطباء يطابقون معاييرك.
        </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">ابحث عن طبيب</DialogTitle>
          <DialogDescription>
            ابحث بالاسم أو التخصص أو الموقع للعثور على الطبيب المناسب لك.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-3 space-y-2">
              <label htmlFor="search-dialog" className="text-sm font-medium">
                البحث بالاسم أو التخصص أو الموقع
              </label>
              <Input
                id="search-dialog"
                placeholder="مثال: د. ريد، طب القلب، أو سبرينغفيلد"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 md:col-span-1">
              <Button onClick={handleSearch} variant="accent" className="w-full">
                بحث
              </Button>
              <Button onClick={handleClear} variant="outline" className="w-full">
                مسح
              </Button>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1 mt-4">
           {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
