'use client';
import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'سلام! من SAM AI هستم، دستیار هنری تو. چطور می‌تونم کمکت کنم؟ 🎭' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: 'متاسفانه مشکلی پیش اومد. دوباره تلاش کن.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        background: '#141414',
        borderRadius: '16px',
        padding: '20px',
        minHeight: '400px',
        maxHeight: '500px',
        overflowY: 'auto',
        border: '1px solid rgba(255,107,0,0.15)',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === 'user' ? 'right' : 'left',
            marginBottom: '12px',
          }}>
            <div style={{
              display: 'inline-block',
              background: msg.role === 'user' ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.04)',
              padding: '10px 16px',
              borderRadius: '12px',
              maxWidth: '80%',
              border: msg.role === 'assistant' ? '1px solid rgba(255,107,0,0.08)' : 'none',
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
          style={{
            flex: 1,
            padding: '12px 16px',
            background: '#0a0a0a',
            border: '1px solid rgba(255,107,0,0.2)',
            borderRadius: '12px',
            color: '#f5f5f5',
            outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: '#ff6b00',
            border: 'none',
            borderRadius: '12px',
            color: '#0a0a0a',
            fontWeight: '600',
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          ارسال
        </button>
      </div>
    </div>
  );
}