'use client';
import { useState, useEffect, useRef } from 'react';
import { useChatHistory, type Message } from '../contexts/ChatHistoryContext';
import { useSettings } from '../contexts/SettingsContext';

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };

  return (
    <button onClick={handleCopy} className="copy-button" aria-label={label} type="button">
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

export default function ChatInterface() {
  const { getActiveChat, addMessage, activeChatId } = useChatHistory();
  const { lang, t } = useSettings();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

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
        content: data.reply || t('پاسخی دریافت نشد.', 'No response received.'),
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
              {msg.role === 'assistant' && (
                <div>
                  <CopyButton text={msg.content} label={t('کپی پیام', 'Copy message')} />
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div style={{ textAlign: assistantAlign, marginBottom: 8 }}>
            <div style={{ display: 'inline-block', opacity: 0.6, fontSize: 13, padding: '8px 14px' }}>
              SAM {t('در حال تایپ...', 'is typing...')}
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
          className="send-button"
          aria-label={t('ارسال پیام', 'Send message')}
        >
          {loading ? (
            <span style={{ fontSize: 16, lineHeight: 1 }}>···</span>
          ) : (
            <span className="send-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
