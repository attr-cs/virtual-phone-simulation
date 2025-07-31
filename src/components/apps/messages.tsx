"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { usePhone } from '@/contexts/phone-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

const initialMessages: Message[] = [
  { id: 1, text: "Hey, are you free this weekend?", sender: 'other', timestamp: '10:30 AM' },
  { id: 2, text: "I was thinking we could catch that new sci-fi movie.", sender: 'other', timestamp: '10:31 AM' },
  { id: 3, text: "Yeah, I'm free! Sounds like a plan.", sender: 'user', timestamp: '10:35 AM' },
  { id: 4, text: "Great! I'll check the showtimes.", sender: 'other', timestamp: '10:36 AM' },
];

const MessagesApp = () => {
    const { setApp } = usePhone();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg: Message = {
                id: messages.length + 1,
                text: newMessage,
                sender: 'user',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };
    
    useEffect(() => {
        // Auto-scroll to the bottom
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if(viewport) viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages]);


  return (
    <div className="bg-background h-full flex flex-col font-sans">
      <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => setApp('home')} className="p-1 -ml-2"><X size={20} /></button>
        <Avatar>
            <AvatarImage src="https://placehold.co/40x40/7350C1/FFFFFF" data-ai-hint="person" />
            <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-headline font-bold">Jane Doe</h1>
      </header>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
        {messages.map((msg) => (
            <div key={msg.id} className={cn('flex items-end gap-2', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.sender === 'other' && <Avatar className="h-6 w-6"><AvatarImage src="https://placehold.co/40x40/7350C1/FFFFFF" data-ai-hint="person" /></Avatar>}
                <div className={cn('max-w-[70%] rounded-2xl px-4 py-2', msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md')}>
                    <p className="text-sm">{msg.text}</p>
                </div>
            </div>
        ))}
        </div>
      </ScrollArea>
      
      <footer className="p-2 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="rounded-full"
          />
          <Button onClick={handleSendMessage} size="icon" className="rounded-full bg-accent hover:bg-accent/90">
            <Send />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default MessagesApp;
