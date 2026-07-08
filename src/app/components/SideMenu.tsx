'use client';
import { useState } from 'react';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: Props) {
  const { chats, activeChatId, switchChat, newChat, deleteChat } = useChatHistory();
  const { user, updateProfile, logOut } = useAuth();
  const { lang, toggleTheme, toggleLang, t } = useSettings();

  const currentDisplayName = (user?.user_metadata?.display_name as string) || user?.email || t('کاربر', 'User');

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [newPassword, setNewPassword] = useState('');

  const startEditing = () => {
    setDisplayName(currentDisplayName);
    setNewPassword('');
    setEditing(true);
  };

  const saveProfile = async () => {
    await updateProfile(displayName, newPassword || undefined);
    setNewPassword('');
    setEditing(false);
  };

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="profile-card">
          <div className="profile-avatar">{currentDisplayName[0]?.toUpperCase() || '?'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input
                  className="profile-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('نام نمایشی', 'Display name')}
                  autoFocus
                />
                <input
                  className="profile-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('رمز عبور جدید (اختیاری)', 'New password (optional)')}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <button
                    onClick={saveProfile}
                    style={{ background: 'none', border: 'none', color: 'var(--red-light)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    {t('ذخیره', 'Save')}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', padding: 0 }}
                  >
                    {t('انصراف', 'Cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="profile-name">{currentDisplayName}</div>
                {user?.email && (
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', opacity: 0.7 }}>{user.email}</div>
                )}
                <button
                  onClick={startEditing}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', padding: 0, marginTop: 2 }}
                >
                  {t('ویرایش اطلاعات کاربری ✎', 'Edit profile ✎')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="menu-divider" />

        <button onClick={() => { newChat(); onClose(); }} className="menu-item" style={{ color: 'var(--red-light)' }}>
          + {t('چت جدید', 'New Chat')}
        </button>

        <div className="menu-divider" />

        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => { switchChat(chat.id); onClose(); }}
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

        <div className="menu-divider" />
        <button className="menu-item" onClick={toggleTheme}>
          {t('تغییر تم', 'Theme')}
        </button>
        <button className="menu-item" onClick={toggleLang}>
          {lang === 'fa' ? 'English' : 'فارسی'}
        </button>

        <div className="menu-divider" />
        <button className="menu-item" onClick={logOut}>
          {t('خروج از حساب', 'Log out')}
        </button>
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