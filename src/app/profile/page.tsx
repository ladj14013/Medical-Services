import AppLayout from '@/components/app-layout';
import ProfileForm from '@/components/profile/profile-form';

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            ملفي الشخصي
          </h1>
        </div>
        <ProfileForm />
      </div>
    </AppLayout>
  );
}
