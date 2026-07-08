'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Message = { role: 'user' | 'assistant'; content: string };
export type Chat = { id: string; title: string; messages: Message[]; createdAt: string };

interface ChatHistoryValue {
  chats: Chat[];
  activeChatId: string | null;
  getActiveChat: () => Chat | null;
  addMessage: (msg: Message) => void;
  newChat: () => void;
  switchChat: (id: string) => void;
  deleteChat: (id: string) => void;
}

const ChatHistoryContext = createContext<ChatHistoryValue | null>(null);

function createDefaultChat(): Chat {
  return {
    id: Date.now().toString(),
    title: 'چت جدید',
    messages: [{ role: 'assistant', content: 'سلام! من SAM AI هستم. چطور می‌تونم کمکت کنم؟ 🎭' }],
    createdAt: new Date().toISOString(),
  };
}

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load once on mount
  useEffect(() => {
    const saved = localStorage.getItem('sam_ai_chats');
    if (saved) {
      const parsed: Chat[] = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    } else {
      const defaultChat = createDefaultChat();
      setChats([defaultChat]);
      setActiveId(defaultChat.id);
    }
    setLoaded(true);
  }, []);

  // Persist whenever chats change (but not before the initial load finishes,
  // otherwise the very first render would overwrite localStorage with [])
  useEffect(() => {
    if (loaded) localStorage.setItem('sam_ai_chats', JSON.stringify(chats));
  }, [chats, loaded]);

  const getActiveChat = () => chats.find((c) => c.id === activeId) || null;

  const addMessage = (msg: Message) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeId) {
          const isFirstUserMsg = chat.messages.length <= 1 && msg.role === 'user';
          return {
            ...chat,
            messages: [...chat.messages, msg],
            title: isFirstUserMsg ? msg.content.slice(0, 30) : chat.title,
          };
        }
        return chat;
      })
    );
  };

  const newChat = () => {
    const chat = createDefaultChat();
    setChats((prev) => [chat, ...prev]);
    setActiveId(chat.id);
  };

  const switchChat = (id: string) => setActiveId(id);

  const deleteChat = (id: string) => {
    setChats((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeId === id) {
        setActiveId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  return (
    <ChatHistoryContext.Provider
      value={{ chats, activeChatId: activeId, getActiveChat, addMessage, newChat, switchChat, deleteChat }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
}

export function useChatHistory() {
  const ctx = useContext(ChatHistoryContext);
  if (!ctx) throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  return ctx;
}
