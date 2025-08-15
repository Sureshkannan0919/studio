
"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  useMemo, 
  useCallback, 
  type ReactNode 
} from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  toggleChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
        const newState = !prev;
        if (newState && messages.length === 0) {
             setMessages([{ text: "Hello! I'm the SK Skates assistant. How can I help you today?", sender: 'bot' }]);
        }
        return newState;
    });
  }, [messages.length]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = { text: data.response || "Sorry, I didn't understand that.", sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chatbot API error:', error);
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const value = useMemo(() => ({
    isOpen,
    messages,
    isLoading,
    toggleChat,
    closeChat,
    sendMessage,
  }), [isOpen, messages, isLoading, toggleChat, closeChat, sendMessage]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatbot() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatProvider');
  }
  return context;
}
