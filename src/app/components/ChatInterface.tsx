'use client';
import { useState, useEffect, useRef } from 'react';
import { useChatHistory, type Message } from '../contexts/ChatHistoryContext';

interface Props { lang: string; }

export default function ChatInterface({ lang }: Props) {
  const { getActiveChat, addMessage, activeChatId } = useChatHistory();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const t = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  // Re-syncs local view whenever the active chat changes (new chat / switch chat)
  useEffect(() => {
    const chat = getActiveChat();
    setMessages(chat?.messages || []);
  }, [activeChatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const user: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, user]);
    addMessage(user);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, user] }),
      });
      const data = await res.json();
      const assistant: Message = {
        role: 'assistant',
        content: data.reply || t('پاسخی دریافت نشد.', 'No response.'),
      };
      setMessages((prev) => [...prev, assistant]);
      addMessage(assistant);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('خطا در ارتباط.', 'Connection error.') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Assistant bubbles sit on the opposite side from user bubbles, and the
  // typing indicator must use the same side as assistant bubbles.
  const assistantAlign = lang === 'fa' ? 'left' : 'right';
  const userAlign = lang === 'fa' ? 'right' : 'left';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxWidth: 720,
        margin: '0 auto',
        padding: '0 10px',
      }}
    >
      <div
        style={{
          flex: 1,
          background: 'var(--bg-card)',
          borderRadius: 14,
          padding: 14,
          overflowY: 'auto',
          border: '1px solid var(--border-color)',
          marginBottom: 10,
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
              {t('به SAM AI خوش آمدید', 'Welcome to SAM AI')}
            </h3>
            <p style={{ fontSize: 13, opacity: 0.5, maxWidth: 280 }}>
              {t('دستیار هنری شما', 'Your artistic assistant')}
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.role === 'user' ? userAlign : assistantAlign,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  background: msg.role === 'user' ? 'var(--red-glow)' : 'var(--bg-input)',
                  padding: '8px 14px',
                  borderRadius: 12,
                  maxWidth: '80%',
                  border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div style={{ textAlign: assistantAlign, marginBottom: 8 }}>
            <div style={{ display: 'inline-block', opacity: 0.6, fontSize: 13, padding: '8px 14px' }}>
              SAM {t('در حال تایپ...', 'typing...')}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 8, paddingBottom: 6, flexShrink: 0 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={t('پیامت رو به SAM بگو...', 'Tell SAM...')}
          className="input-field"
          style={{ flex: 1, padding: '10px 14px', fontSize: 14, borderRadius: 24 }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{
            padding: '8px 14px',
            fontSize: 18,
            minWidth: 40,
            minHeight: 40,
            borderRadius: '50%',
            background: 'var(--red)',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? '...' : '>'}
        </button>
      </div>
    </div>
  );
}
