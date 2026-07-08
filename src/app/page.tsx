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
  }, [lang]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '0 8px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        lang={lang}
        toggleLang={() => setLang(lang === 'fa' ? 'en' : 'fa')}
      />

      {/* فاصله ثابت از بالا */}
      <div style={{ height: 50, flexShrink: 0 }} />

      <header style={{
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
      }}>
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
        <h1 style={{
          fontSize: 'clamp(26px, 5vw, 34px)',
          fontWeight: 700,
          color: 'var(--red)',
          letterSpacing: '-0.5px',
          fontFamily: 'var(--font-serif)',
        }}>
          SAM AI
        </h1>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatInterface lang={lang} />
      </div>
    </div>
  );
}