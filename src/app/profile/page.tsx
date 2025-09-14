'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import ProfileForm from '@/components/profile/profile-form';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/users/user1'); // Hardcoded for prototype
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            ملف المريض
          </h1>
        </div>
        {isLoading || !user ? (
          <div className="space-y-4">
             <Skeleton className="h-12 w-1/4" />
             <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <ProfileForm user={user} />
        )}
      </div>
    </AppLayout>
  );
}
