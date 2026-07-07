'use client';
import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
  }, [isDark]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '16px',
      fontFamily: 'var(--font-sans)',
      transition: 'all var(--transition)',
    }}>
      {/* هدر */}
      <header className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h1 className="title-font" style={{
          fontSize: 'clamp(24px, 4vw, 32px)',
          fontWeight: '700',
          color: 'var(--red)',
        }}>
          🎭 SAM AI
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '30px',
              padding: '8px 16px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all var(--transition)',
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <span style={{ fontSize: '14px', opacity: 0.5, display: 'none', '@media(min-width:500px)': { display: 'inline' } }}>
            دستیار شخصی هنری
          </span>
        </div>
      </header>

      <ChatInterface />
    </div>
  );
}