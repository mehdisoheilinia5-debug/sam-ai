'use client';
import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import SideMenu from './components/SideMenu';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('fa');

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        padding: '0 8px',
        fontFamily: 'var(--font-sans)',
        transition: 'all var(--transition)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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
        className="header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          marginTop: '24px',
          marginBottom: '14px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
          minHeight: '54px',
        }}
      >
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '4px',
            fontWeight: '300',
          }}
        >
          ☰
        </button>
        <h1
          className="title-font"
          style={{
            fontSize: 'clamp(26px, 5vw, 34px)',
            fontWeight: '700',
            color: 'var(--red)',
            letterSpacing: '-0.5px',
          }}
        >
          SAM AI
        </h1>
        <div style={{ width: '32px' }} />
      </header>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatInterface lang={lang} />
      </div>
    </div>
  );
}