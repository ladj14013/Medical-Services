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
import { forumPosts } from '@/lib/data';
import { Edit, MessageSquare, Plus, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import Link from 'next/link';

export default function ForumPage() {
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
          <Button variant="accent">
            <Plus className="ml-2 h-5 w-5" />
            إنشاء منشور جديد
          </Button>
        </div>

        <div className="space-y-6">
          {forumPosts.map((post) => (
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
                    {formatDistanceToNow(new Date(post.date), {
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
                    {post.comments.length} تعليقات
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/forum/post/${post.id}`}>
                        عرض المناقشة <ArrowRight className="mr-2 h-4 w-4" />
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

// Dummy ArrowRight component as it's used in the code
const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
)
