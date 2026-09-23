import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase.js';

// Auth admin via Supabase email+password. Sesi disimpan oleh supabase-js.
// Tanpa sesi: halaman admin terkunci (lihat RequireAuth di App.jsx).
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: 'Email atau kata sandi salah.' };
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
  }, []);

  // Login Google (OAuth). Redirect kembali ke halaman depan.
  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) return { ok: false, error: 'Login Google belum dikonfigurasi.' };
    return { ok: true };
  }, []);

  const value = useMemo(
    () => ({ session, user: session ? session.user : null, loading, signIn, signInWithGoogle, signOut, configured: isSupabaseConfigured }),
    [session, loading, signIn, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
