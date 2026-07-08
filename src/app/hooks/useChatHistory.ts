import { useState, useEffect } from 'react';

export type Message = { role: 'user' | 'assistant'; content: string; };
export type Chat = { id: string; title: string; messages: Message[]; createdAt: string; };

export function useChatHistory() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sam_ai_chats');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    } else {
      const defaultChat: Chat = {
        id: Date.now().toString(),
        title: 'چت جدید',
        messages: [{ role: 'assistant', content: 'سلام! من SAM AI هستم. چطور می‌تونم کمکت کنم؟ 🎭' }],
        createdAt: new Date().toISOString(),
      };
      setChats([defaultChat]);
      setActiveId(defaultChat.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sam_ai_chats', JSON.stringify(chats));
  }, [chats]);

  const getActive = () => chats.find(c => c.id === activeId) || null;

  const addMessage = (msg: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === activeId) {
        const newMessages = [...chat.messages, msg];
        return {
          ...chat,
          messages: newMessages,
          title: chat.messages.length === 0 ? msg.content.slice(0, 30) + '...' : chat.title,
        };
      }
      return chat;
    }));
  };

  const newChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'چت جدید',
      messages: [{ role: 'assistant', content: 'سلام! من SAM AI هستم. چطور می‌تونم کمکت کنم؟ 🎭' }],
      createdAt: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveId(newChat.id);
  };

  const switchChat = (id: string) => setActiveId(id);
  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeId === id) {
      const remaining = chats.filter(c => c.id !== id);
      setActiveId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return {
    chats,
    activeChatId: activeId,
    getActiveChat: getActive,
    addMessage,
    newChat,
    switchChat,
    deleteChat,
  };
}