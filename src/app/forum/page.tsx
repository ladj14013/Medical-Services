'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ForumPost, Doctor } from '@/lib/types';
import { MessageSquare, Plus, User, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
            description: "يجب أن تكون طبيباً لعرض هذه الصفحة.",
            variant: "destructive"
        });
        router.push('/login?role=doctor');
    }
  }, [router, toast]);


  useEffect(() => {
    if(!loggedInDoctor) return;

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/forum/posts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch forum posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [loggedInDoctor]);

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
               <MessageSquare className="h-8 w-8" /> منتدى الأطباء
            </h1>
            <p className="text-muted-foreground mt-1">
                مكان لمناقشة الحالات والأبحاث مع الزملاء.
            </p>
          </div>
          <Button variant="accent" asChild>
            <Link href="/forum/new">
                <Plus className="ml-2 h-5 w-5" />
                إنشاء منشور جديد
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="font-headline text-xl hover:text-primary">
                    <Link href={`/forum/post/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 text-xs pt-1">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.authorName} - {post.authorSpecialization}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">
                    {post.content}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center text-sm">
                   <div className="text-muted-foreground">
                      {Array.isArray(post.comments) ? post.comments.length : 0} تعليقات
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                      <Link href={`/forum/post/${post.id}`} className="flex items-center gap-2">
                          عرض المناقشة <ArrowRight className="h-4 w-4" />
                      </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
