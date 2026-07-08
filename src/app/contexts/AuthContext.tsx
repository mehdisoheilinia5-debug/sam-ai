'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

type Status = 'loading' | 'unauthenticated' | 'confirm-email' | 'authenticated';

interface AuthValue {
  status: Status;
  user: User | null;
  error: string | null;
  signUp: (email: string, displayName: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateProfile: (displayName: string, newPassword?: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Supabase keeps the session (a signed JWT issued by Supabase's server,
  // only ever produced after checking the real password hash server-side)
  // and restores it automatically on load / refresh.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus((prev) => (prev === 'confirm-email' ? prev : 'unauthenticated'));
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, displayName: string, password: string) => {
    setError(null);
    if (!email.trim() || !displayName.trim() || password.length < 6) {
      setError('invalid');
      return;
    }
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName.trim() } },
    });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      setUser(data.session.user);
      setStatus('authenticated');
    } else {
      // "Confirm email" is on in the Supabase project — no session until
      // the user clicks the confirmation link Supabase emailed them.
      setStatus('confirm-email');
    }
  };

  const logIn = async (email: string, password: string) => {
    setError(null);
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (loginError) {
      setError('mismatch');
      return;
    }
    if (data.session) {
      setUser(data.session.user);
      setStatus('authenticated');
    }
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStatus('unauthenticated');
  };

  const updateProfile = async (displayName: string, newPassword?: string) => {
    const payload: { data?: Record<string, unknown>; password?: string } = {
      data: { display_name: displayName.trim() },
    };
    if (newPassword && newPassword.length >= 6) payload.password = newPassword;
    const { data, error: updateError } = await supabase.auth.updateUser(payload);
    if (!updateError && data.user) setUser(data.user);
  };

  const requestPasswordReset = async (email: string) => {
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (resetError) setError(resetError.message);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ status, user, error, signUp, logIn, logOut, updateProfile, requestPasswordReset, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
