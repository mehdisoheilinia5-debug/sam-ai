'use client';
import { useState } from 'react';
import { useChatHistory, type Message } from '../hooks/useChatHistory';

interface ChatInterfaceProps {
  lang: string;
}

export default function ChatInterface({ lang }: ChatInterfaceProps) {
  const { getActiveChat, addMessage } = useChatHistory();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const activeChat = getActiveChat();
  const messages: Message[] = activeChat?.messages || [];

  const t = (fa: string, en: string) => lang === 'fa' ? fa : en;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      addMessage({
        role: 'assistant',
        content: data.reply || t('متاسفانه پاسخی دریافت نشد.', 'Sorry, no response received.')
      });
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: t('❌ خطا در ارتباط با سرور. دوباره تلاش کن.', '❌ Server connection error. Please try again.')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 140px)',
      maxWidth: '720px',
      margin: '0 auto',
      padding: '0 16px',
    }}>
      <div style={{
        flex: 1,
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        padding: '16px',
        overflowY: 'auto',
        border: '1px solid var(--border-color)',
        marginBottom: '12px',
        minHeight: '200px',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === 'user' ? (lang === 'fa' ? 'right' : 'left') : (lang === 'fa' ? 'left' : 'right'),
            marginBottom: '10px',
          }}>
            <div style={{
              display: 'inline-block',
              background: msg.role === 'user' ? 'var(--red-glow)' : 'var(--bg-input)',
              padding: '8px 14px',
              borderRadius: '12px',
              maxWidth: '80%',
              border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              lineHeight: '1.5',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ textAlign: 'left', opacity: 0.5, fontSize: '13px' }}>SAM {t('در حال تایپ...', 'is typing...')}</div>}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        paddingBottom: '8px',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t('پیامت رو به SAM بگو...', 'Tell SAM...')}
          className="input-field"
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: '14px',
            borderRadius: '24px',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: '8px 14px',
            fontSize: '18px',
            minWidth: '42px',
            minHeight: '42px',
            borderRadius: '50%',
            background: 'var(--red)',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'default' : 'pointer',
            transition: 'all var(--transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? '...' : '➤'}
        </button>
      </div>
    </div>
  );
}