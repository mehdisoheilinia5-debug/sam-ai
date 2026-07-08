'use client';
import { useState } from 'react';
import { useChatHistory, type Message } from '../hooks/useChatHistory';

export default function ChatInterface() {
  const { getActiveChat, addMessage } = useChatHistory();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const activeChat = getActiveChat();
  const messages: Message[] = activeChat?.messages || [];

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
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || 'متاسفانه پاسخی دریافت نشد.'
      };
      addMessage(assistantMessage);
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: '❌ خطا در ارتباط با سرور. دوباره تلاش کن.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '16px' }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        padding: '20px',
        minHeight: '400px',
        maxHeight: '500px',
        overflowY: 'auto',
        border: '1px solid var(--border-color)',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === 'user' ? 'right' : 'left',
            marginBottom: '12px',
          }}>
            <div style={{
              display: 'inline-block',
              background: msg.role === 'user' ? 'var(--red-glow)' : 'var(--bg-input)',
              padding: '10px 16px',
              borderRadius: '12px',
              maxWidth: '80%',
              border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
              color: 'var(--text-primary)',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ textAlign: 'left', opacity: 0.5 }}>SAM در حال تایپ...</div>}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="پیامت رو به SAM بگو..."
          className="input-field"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="btn-primary"
          style={{
            padding: '10px 16px',
            fontSize: '20px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '44px',
            minHeight: '44px',
            borderRadius: '50%',
            background: 'var(--red)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
        >
          {loading ? '...' : '➤'}
        </button>
      </div>
    </div>
  );
}