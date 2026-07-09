'use client';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import type { Lang } from './SettingsContext';

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

export const GREETING_MARKER = '__DEFAULT_GREETING__';

function createDefaultChat(lang: Lang): Chat {
  // Title and greeting are NOT baked in as fixed language text — an empty
  // title falls back to a live-translated "New Chat" label in the UI, and
  // the greeting marker gets resolved to the current language wherever
  // it's displayed. This way a chat created in Persian still shows in
  // English immediately after switching languages, and vice versa.
  void lang; // kept in the signature for callers, no longer used to bake text in
  return {
    id: Date.now().toString(),
    title: '',
    messages: [{ role: 'assistant', content: GREETING_MARKER }],
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

interface ProviderProps {
  children: ReactNode;
  lang: Lang;
  settingsLoaded: boolean;
}

export function ChatHistoryProvider({ children, lang, settingsLoaded }: ProviderProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const initializedRef = useRef(false);

  // Waits for the saved language to finish loading (so the very first chat's
  // greeting is created in the right language), then restores saved chats
  // or immediately creates AND persists a brand-new one. Runs exactly once.
  useEffect(() => {
    if (!settingsLoaded || initializedRef.current) return;
    initializedRef.current = true;

    let initialChats: Chat[];
    let initialActiveId: string;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialChats = parsed;
        initialActiveId = parsed[0].id;
      } else {
        const chat = createDefaultChat(lang);
        initialChats = [chat];
        initialActiveId = chat.id;
      }
    } catch {
      const chat = createDefaultChat(lang);
      initialChats = [chat];
      initialActiveId = chat.id;
    }
    setChats(initialChats);
    setActiveId(initialActiveId);
    persist(initialChats);
  }, [settingsLoaded, lang]);

  const getActiveChat = () => chats.find((c) => c.id === activeId) || null;

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
    const chat = createDefaultChat(lang);
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
