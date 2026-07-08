import { useState, useEffect } from 'react';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
};

export function useChatHistory() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sam_ai_chats');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) {
        setActiveChatId(parsed[0].id);
      }
    } else {
      const defaultChat: Chat = {
        id: Date.now().toString(),
        title: 'چت جدید',
        messages: [
          { role: 'assistant', content: 'سلام! من SAM AI هستم، دستیار هنری تو. چطور می‌تونم کمکت کنم؟ 🎭' }
        ],
        createdAt: new Date().toISOString(),
      };
      setChats([defaultChat]);
      setActiveChatId(defaultChat.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sam_ai_chats', JSON.stringify(chats));
  }, [chats]);

  const getActiveChat = (): Chat | null => {
    return chats.find(c => c.id === activeChatId) || null;
  };

  const addMessage = (message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        const newMessages = [...chat.messages, message];
        const title = chat.messages.length === 0 ? message.content.slice(0, 30) + '...' : chat.title;
        return { ...chat, messages: newMessages, title };
      }
      return chat;
    }));
  };

  const newChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'چت جدید',
      messages: [
        { role: 'assistant', content: 'سلام! من SAM AI هستم، دستیار هنری تو. چطور می‌تونم کمکت کنم؟ 🎭' }
      ],
      createdAt: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const switchChat = (id: string) => {
    setActiveChatId(id);
  };

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter(c => c.id !== id);
      setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return {
    chats,
    activeChatId, // ← این رو برگردوندم تا بتونیم توی ChatInterface ازش استفاده کنیم
    getActiveChat,
    addMessage,
    newChat,
    switchChat,
    deleteChat,
  };
}