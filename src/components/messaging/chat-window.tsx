'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { messages as initialMessages } from '@/lib/data';
import type { Doctor, Message as MessageType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format }s from 'date-fns';
import { ar } from 'date-fns/locale';
import { Send } from 'lucide-react';
import data from '@/lib/placeholder-images.json';

interface ChatWindowProps {
  recipient: Doctor;
  sender: Doctor;
}

export default function ChatWindow({ recipient, sender }: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageType[]>(() => 
    initialMessages.filter(m => 
      (m.senderId === sender.id && m.recipientId === recipient.id) ||
      (m.senderId === recipient.id && m.recipientId === sender.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  );
  const [newMessage, setNewMessage] = useState('');

  const recipientImage = data.placeholderImages.find(img => img.id === recipient.imageId);
  const senderImage = data.placeholderImages.find(img => img.id === sender.imageId);

  const handleSendMessage = () => {
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

    setMessages([...messages, message]);
    setNewMessage('');
  };

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
        <ScrollArea className="h-full p-4">
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
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">إرسال</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
