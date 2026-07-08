'use client';
import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import SideMenu from './components/SideMenu';
import { ChatHistoryProvider } from './contexts/ChatHistoryContext';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('fa');

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <ChatHistoryProvider>
      <div
        style={{
          // Uses the real viewport height computed in layout.tsx (via
          // --app-height), which is more reliable on mobile than 100vh or
          // 100dvh alone — those were leaving a gap / pushing the header
          // until the page was scrolled once.
          height: 'var(--app-height, 100dvh)',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          padding: '8px 8px 0 8px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <SideMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
          lang={lang}
          toggleLang={() => setLang(lang === 'fa' ? 'en' : 'fa')}
        />

        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            marginBottom: 12,
            flexShrink: 0,
            position: 'relative',
            zIndex: 10,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 14,
            minHeight: 54,
            boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: 24,
              padding: 4,
            }}
          >
            ☰
          </button>
          <div className="brand-logo">
            <svg className="brand-mark" width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
              <defs>
                <linearGradient id="samMarkGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--red-light)" />
                  <stop offset="100%" stopColor="var(--red-dark)" />
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="11" fill="url(#samMarkGradient)" />
              <text
                x="20"
                y="28"
                textAnchor="middle"
                fontFamily="var(--font-serif)"
                fontSize="20"
                fontWeight="700"
                fill="#f5f5f5"
              >
                S
              </text>
            </svg>
            <div className="brand-text">
              <span className="brand-title">SAM AI</span>
              <span className="brand-sub">{lang === 'fa' ? 'دستیار هنری تئاتر' : 'Theatre Arts Assistant'}</span>
            </div>
          </div>
          <div style={{ width: 32 }} />
        </header>

        {/* minHeight: 0 is required here — without it a flex:1 child won't
            shrink below its content size, and the chat's internal scroll
            area stops scrolling and instead pushes the header up/off-screen. */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChatInterface lang={lang} />
        </div>
      </div>
    </ChatHistoryProvider>
  );
}
