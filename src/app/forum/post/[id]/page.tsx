'use client';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { notFound, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { User, Send, MessageCircle, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import data from '@/lib/placeholder-images.json';
import type { ForumPost, Doctor } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import PostLoading from './loading';


export default function ForumPostPage({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<ForumPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loggedInDoctor, setLoggedInDoctor] = useState<Doctor | null>(null);
    const { toast } = useToast();
    const router = useRouter();


    useEffect(() => {
        const userJson = sessionStorage.getItem('loggedInUser');
        const userRole = sessionStorage.getItem('userRole');
        if (userJson && userRole === 'doctor') {
            setLoggedInDoctor(JSON.parse(userJson));
        } else {
             toast({
                title: "الوصول محظور",
                description: "يجب أن تكون طبيباً مسجلاً لعرض هذه الصفحة.",
                variant: "destructive"
            });
            router.push('/login?role=doctor');
        }
    }, [router, toast]);
    
    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/forum/posts/${params.id}`, { cache: 'no-store' });
            if (!res.ok) {
                 setIsLoading(false);
                 return;
            };
            const data = await res.json();
            setPost(data);
        } catch (error) {
            console.error('Failed to fetch post:', error);
            toast({ title: "خطأ", description: "فشل تحميل المنشور.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if(loggedInDoctor) {
            fetchPost();
        }
    }, [params.id, loggedInDoctor]);
    

    const handleAddComment = async () => {
        if (!comment.trim() || !loggedInDoctor || !post) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/forum/posts/${post.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: comment,
                    authorId: loggedInDoctor.id,
                    authorName: loggedInDoctor.name,
                }),
            });
            const newComment = await response.json();
            if (!response.ok) {
                throw new Error(newComment.message || 'فشل إضافة التعليق');
            }
            
            // Re-fetch post data to get the latest comments
            fetchPost();
            setComment('');
            toast({ title: 'تمت إضافة التعليق بنجاح' });
        } catch (error) {
             toast({ title: "خطأ", description: (error as Error).message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isLoading) {
        return <PostLoading />;
    }

    if (!post) {
        notFound();
    }
    
    const authorImage = data.placeholderImages.find(img => img.id === post.authorId);


    return (
        <AppLayout>
            <div className="flex-1 space-y-6 p-4 sm:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">{post.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm pt-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    {authorImage && (
                                        <AvatarImage src={authorImage.imageUrl} alt={authorImage.description} data-ai-hint={authorImage.imageHint} />
                                    )}
                                    <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <span className="font-semibold">{post.authorName}</span>
                                    <span className="text-xs text-muted-foreground"> - {post.authorSpecialization}</span>
                                </div>
                            </div>
                             <span>
                                {formatDistanceToNow(new Date(post.createdAt), {
                                addSuffix: true,
                                locale: ar,
                                })}
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-2xl font-headline flex items-center gap-2">
                        <MessageCircle className="h-6 w-6" />
                        التعليقات ({post.comments.length})
                    </h2>
                     {post.comments.map(comment => {
                        const commenterImageId = `doctor-${Math.floor(Math.random() * 6) + 1}`;
                        const commenterImage = data.placeholderImages.find(img => img.id === commenterImageId);

                        return (
                            <Card key={comment.id} className="bg-muted/50">
                                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                                    <Avatar className="h-10 w-10">
                                        {commenterImage && (
                                            <AvatarImage src={commenterImage.imageUrl} alt={commenterImage.description} data-ai-hint={commenterImage.imageHint} />
                                        )}
                                        <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">{comment.authorName}</span>
                                             <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ar })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground pt-2">{comment.content}</p>
                                    </div>
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">أضف تعليقًا</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                          placeholder="اكتب تعليقك هنا..." 
                          rows={4}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          disabled={isSubmitting} />
                    </CardContent>
                    <CardFooter>
                        <Button variant="accent" onClick={handleAddComment} disabled={isSubmitting || !comment.trim()}>
                            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin"/>}
                            <Send className="ml-2 h-4 w-4" />
                            إرسال التعليق
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}

// Keeping this function for build-time optimization, but it won't be fully dynamic in `next build`
// export async function generateStaticParams() {
//   // In a real production app with many posts, you might fetch only the most recent/popular posts here
//   // For now, we clear it as we move to dynamic rendering
//   return [];
// }
