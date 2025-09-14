import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { User, Send, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import data from '@/lib/placeholder-images.json';
import type { ForumPost } from '@/lib/types';
import { forumPosts as staticForumPosts } from '@/lib/data';

async function getPost(id: string): Promise<ForumPost | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  try {
    const res = await fetch(`${baseUrl}/api/forum/posts/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export default async function ForumPostPage({ params }: { params: { id: string } }) {
    const post = await getPost(params.id);

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
                                {formatDistanceToNow(new Date(post.date), {
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
                        // Assuming we don't have all commenter images, we can make a fallback
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
                                                {formatDistanceToNow(new Date(comment.date), { addSuffix: true, locale: ar })}
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
                        <Textarea placeholder="اكتب تعليقك هنا..." rows={4} />
                    </CardContent>
                    <CardFooter>
                        <Button variant="accent">
                            <Send className="ml-2 h-4 w-4" />
                            إرسال التعليق
                        </Button>
                    </CardFooter>
                </Card>

            </div>
        </AppLayout>
    );
}

export async function generateStaticParams() {
  return staticForumPosts.map((post) => ({
    id: post.id,
  }));
}
