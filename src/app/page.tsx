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
          // 100dvh instead of 100vh: recalculates with the mobile browser's
          // address bar instead of assuming the tallest possible viewport,
          // which is what was pushing the header out of view.
          height: '100dvh',
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
          <h1
            style={{
              fontSize: 'clamp(26px, 5vw, 34px)',
              fontWeight: 700,
              color: 'var(--red)',
              letterSpacing: '-0.5px',
              fontFamily: 'var(--font-serif)',
            }}
          >
            SAM AI
          </h1>
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
