'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Message = { role: 'user' | 'assistant'; content: string };
export type Chat = { id: string; title: string; messages: Message[]; createdAt: string };

const STORAGE_KEY = 'sam_ai_chats';

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

function persist(chats: Chat[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {
    // e.g. private browsing / storage full — fail silently rather than crash
  }
}

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // On first load: restore saved chats, or immediately create AND persist a
  // brand new chat. The user should never need to press "New Chat" for the
  // very first conversation to exist and be saved.
  useEffect(() => {
    let initialChats: Chat[];
    let initialActiveId: string;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialChats = parsed;
        initialActiveId = parsed[0].id;
      } else {
        const chat = createDefaultChat();
        initialChats = [chat];
        initialActiveId = chat.id;
      }
    } catch {
      const chat = createDefaultChat();
      initialChats = [chat];
      initialActiveId = chat.id;
    }
    setChats(initialChats);
    setActiveId(initialActiveId);
    persist(initialChats);
  }, []);

  const getActiveChat = () => chats.find((c) => c.id === activeId) || null;

  // Every mutation persists immediately and synchronously — saving no
  // longer depends on a separate effect or on any button being pressed.
  const addMessage = (msg: Message) => {
    setChats((prev) => {
      const updated = prev.map((chat) => {
        if (chat.id === activeId) {
          const isFirstUserMsg = chat.messages.length <= 1 && msg.role === 'user';
          return {
            ...chat,
            messages: [...chat.messages, msg],
            title: isFirstUserMsg ? msg.content.slice(0, 30) : chat.title,
          };
        }
        return chat;
      });
      persist(updated);
      return updated;
    });
  };

  const newChat = () => {
    const chat = createDefaultChat();
    setChats((prev) => {
      const updated = [chat, ...prev];
      persist(updated);
      return updated;
    });
    setActiveId(chat.id);
  };

  const switchChat = (id: string) => setActiveId(id);

  const deleteChat = (id: string) => {
    setChats((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      persist(remaining);
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
