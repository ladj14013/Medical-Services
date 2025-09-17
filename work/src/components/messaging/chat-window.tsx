'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Doctor, Message as MessageType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Send } from 'lucide-react';
import data from '@/lib/placeholder-images.json';
import { Skeleton } from '../ui/skeleton';

interface ChatWindowProps {
  recipient: Doctor;
  sender: Doctor;
}

export default function ChatWindow({ recipient, sender }: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/messages?userId=${sender.id}`);
        const allMessages: MessageType[] = await res.json();
        const chatMessages = allMessages
          .filter(m => 
            (m.senderId === sender.id && m.recipientId === recipient.id) ||
            (m.senderId === recipient.id && m.recipientId === sender.id)
          )
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setMessages(chatMessages);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [sender.id, recipient.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const message: MessageType = {
      id: `msg-${Date.now()}`,
      senderId: sender.id,
      recipientId: recipient.id,
      senderName: sender.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'message',
    };

    // Optimistically update the UI
    setMessages([...messages, message]);
    setNewMessage('');

    // Send to backend
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error("Failed to send message", error);
      // Revert optimistic update on error
      setMessages(messages.filter(m => m.id !== message.id));
    }
  };

  const recipientImage = data.placeholderImages.find(img => img.id === recipient.imageId);
  const senderImage = data.placeholderImages.find(img => img.id === sender.imageId);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-3 border-b">
        <Avatar>
          {recipientImage && <AvatarImage src={recipientImage.imageUrl} alt={recipient.name} />}
          <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{recipient.name}</p>
          <p className="text-xs text-muted-foreground">{recipient.specialization}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-end gap-2 justify-start"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-10 w-48" /></div>
              <div className="flex items-end gap-2 justify-end"><Skeleton className="h-10 w-32" /><Skeleton className="h-8 w-8 rounded-full" /></div>
              <div className="flex items-end gap-2 justify-start"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-12 w-64" /></div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isSender = message.senderId === sender.id;
                const avatarImage = isSender ? senderImage : recipientImage;
                const authorName = isSender ? sender.name : recipient.name;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex items-end gap-2',
                      isSender ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!isSender && (
                      <Avatar className="h-8 w-8">
                         {avatarImage && <AvatarImage src={avatarImage.imageUrl} />}
                         <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className='flex flex-col gap-1' style={{alignItems: isSender ? 'flex-end' : 'flex-start'}}>
                      <div
                          className={cn(
                          'max-w-xs rounded-lg p-3 text-sm md:max-w-md',
                          isSender
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-muted rounded-bl-none'
                          )}
                      >
                          <p>{message.content}</p>
                      </div>
                       <p className="text-xs text-muted-foreground px-1">
                          {format(new Date(message.timestamp), 'p', { locale: ar })}
                      </p>
                    </div>
                     {isSender && (
                       <Avatar className="h-8 w-8">
                         {avatarImage && <AvatarImage src={avatarImage.imageUrl} />}
                         <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="اكتب رسالتك..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">إرسال</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
