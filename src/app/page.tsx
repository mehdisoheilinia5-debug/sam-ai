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
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '16px',
      fontFamily: 'var(--font-sans)',
      transition: 'all var(--transition)',
    }}>
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        lang={lang}
        toggleLang={() => setLang(lang === 'fa' ? 'en' : 'fa')}
      />

      <header className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '8px 16px',
      }}>
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '22px',
            padding: '4px',
          }}
        >
          ☰
        </button>
        <h1 className="title-font" style={{
          fontSize: 'clamp(24px, 4.5vw, 32px)',
          fontWeight: '700',
          color: 'var(--red)',
          letterSpacing: '-0.5px',
        }}>
          SAM AI
        </h1>
        <div style={{ width: '32px' }} />
      </header>

      <ChatInterface lang={lang} />
    </div>
  );
}