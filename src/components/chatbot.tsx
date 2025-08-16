
"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import SkLogo from './icons/sk-logo';
import { useChatbot } from '@/hooks/use-chatbot';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Chatbot() {
  const { isOpen, messages, isLoading, toggleChat, sendMessage } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (isOpen && scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!inputValue.trim()) return;
    await sendMessage(inputValue, user?.uid);
    setInputValue('');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-[99998]"
        size="icon"
      >
        {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[99999] animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
          <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className='flex items-center gap-2'>
                <SkLogo className="h-8 w-auto text-primary" />
                <CardTitle className="font-headline">SK Bot</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                 <div className="p-4 space-y-4">
                    {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={cn(
                        'flex items-end gap-2',
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {msg.sender === 'bot' && <Bot className="w-6 h-6 text-primary shrink-0" />}
                        <p
                        className={cn(
                            'rounded-lg px-4 py-2 max-w-[80%]',
                            msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                        >
                        {msg.text}
                        </p>
                    </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start items-center gap-2">
                             <Bot className="w-6 h-6 text-primary shrink-0" />
                             <p className="bg-muted rounded-lg px-4 py-2 flex items-center">
                                <LoaderCircle className="w-5 h-5 animate-spin"/>
                             </p>
                        </div>
                    )}
                 </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
                <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                   {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
