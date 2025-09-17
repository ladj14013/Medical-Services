'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Doctor } from '@/lib/types';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInDoctor, setLoggedInDoctor] = useState<Doctor | null>(null);
  const router = useRouter();
  const { toast } = useToast();

   useEffect(() => {
    const userJson = sessionStorage.getItem('loggedInUser');
    const userRole = sessionStorage.getItem('userRole');
    if (userJson && userRole === 'doctor') {
        setLoggedInDoctor(JSON.parse(userJson));
    } else {
        toast({
            title: "الوصول محظور",
            description: "يجب أن تكون طبيباً لإنشاء منشور.",
            variant: "destructive"
        });
        router.push('/login?role=doctor');
    }
  }, [router, toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !loggedInDoctor) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          authorId: loggedInDoctor.id,
          authorName: loggedInDoctor.name,
          authorSpecialization: loggedInDoctor.specialization,
        }),
      });
      
      const newPost = await response.json();
      if (!response.ok) {
        throw new Error(newPost.message || 'فشل إنشاء المنشور');
      }

      toast({ title: 'تم إنشاء المنشور بنجاح!' });
      router.push(`/forum/post/${newPost.id}`);

    } catch (error) {
       toast({ title: 'خطأ', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">إنشاء منشور جديد</CardTitle>
            <CardDescription>
              شارك حالة أو سؤالاً أو فكرة مع مجتمع الأطباء.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  placeholder="عنوان موجز وواضح لمنشورك"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">المحتوى</Label>
                <Textarea
                  id="content"
                  placeholder="اشرح بالتفصيل هنا. يمكنك تنسيق النص باستخدام أسطر جديدة."
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading || !title.trim() || !content.trim()}>
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'جاري النشر...' : 'نشر المنشور'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
