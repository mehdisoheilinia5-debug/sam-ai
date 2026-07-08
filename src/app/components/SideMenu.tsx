'use client';
import { useState } from 'react';
import { useChatHistory } from '../hooks/useChatHistory';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  lang: string;
  toggleLang: () => void;
}

export default function SideMenu({ isOpen, onClose, isDark, toggleTheme, lang, toggleLang }: Props) {
  const { chats, activeChatId, switchChat, newChat, deleteChat } = useChatHistory();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);
  const t = (fa: string, en: string) => lang === 'fa' ? fa : en;

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="profile-card">
          <div className="profile-avatar">{name ? name[0].toUpperCase() : '?'}</div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
                className="profile-input"
                autoFocus
                placeholder={t('نام کاربری', 'Username')}
              />
            ) : (
              <div className="profile-name" onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
                {name || t('نام کاربری', 'Username')} ✎
              </div>
            )}
          </div>
        </div>

        <div className="menu-divider" />

        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => switchChat(chat.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                background: activeChatId === chat.id ? 'var(--red-glow)' : 'transparent',
              }}
            >
              <span style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {chat.title || t('چت جدید', 'New Chat')}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14, padding: '0 4px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button onClick={() => { newChat(); onClose(); }} className="menu-item" style={{ color: 'var(--red)' }}>
          {t('چت جدید', 'New Chat')}
        </button>

        <div className="menu-divider" />
        <button className="menu-item" onClick={() => { toggleTheme(); onClose(); }}>
          {t('تغییر تم', 'Theme')}
        </button>
        <button className="menu-item" onClick={() => { toggleLang(); onClose(); }}>
          {lang === 'fa' ? 'English' : 'فارسی'}
        </button>

        <div className="menu-divider" />
        <button
          className="menu-item danger"
          onClick={() => {
            if (confirm(t('همه چت‌ها پاک میشن؟', 'Delete all chats?'))) {
              localStorage.removeItem('sam_ai_chats');
              window.location.reload();
            }
          }}
        >
          {t('پاک کردن تاریخچه', 'Clear History')}
        </button>
      </div>
    </>
  );
}