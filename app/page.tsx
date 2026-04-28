'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Internal mapping for hardcoded authorized accounts
      const staticAccounts: Record<string, string> = {
        'admin': 'Pentaland'
      };

      const normalizedUser = username.toLowerCase().trim();
      let isValid = false;
      let userRole = 'logistic';

      // 1. Check Static Accounts
      if (staticAccounts[normalizedUser] && staticAccounts[normalizedUser] === password) {
        isValid = true;
        userRole = 'admin';
      } 
      // 2. Check Dynamic Logistic Users from Database
      else {
        const { data: logUser, error: logError } = await supabase
          .from('logistic_users')
          .select('*')
          .eq('username', normalizedUser)
          .eq('password', password)
          .single();
        
        if (logUser && !logError) {
          isValid = true;
          userRole = logUser.role || 'logistic';
        }
      }

      if (!isValid) {
        throw new Error('Username atau password salah');
      }

      // We use a fixed internal email for all admin accounts to share the same data
      const adminEmail = 'admin@pentaland.com';
      const adminPassword = 'admin_pentaland_secure_123'; // Internal password for Supabase Auth

      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Akun admin belum terdaftar di sistem. Hubungi pengembang.');
        }
        throw error;
      }

      // Save username for local permission checking
      localStorage.setItem('pentaland_user_alias', normalizedUser);
      localStorage.setItem('pentaland_user_role', userRole);

      // Refresh and hard redirect to ensure cookies are sent
      router.refresh();
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 200);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan autentikasi');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FFFBEB]">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.6] pointer-events-none">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          <g fill="url(#goldGradient)" opacity="0.15">
            <circle cx="100" cy="100" r="300" />
            <circle cx="900" cy="900" r="400" />
            <path d="M400,100 Q600,300 400,500 T400,900" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />
          </g>
        </svg>
      </div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card-strong rounded-[32px] md:rounded-[48px] border-yellow-400/30 overflow-hidden bg-gradient-to-br from-white/90 to-yellow-50/50 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="mx-auto mb-6 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/50 shadow-xl">
                <span className="text-white font-black text-4xl">P</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-lg">
                PENTALAND
              </h1>
              <p className="text-yellow-100 mt-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                Project Dashboard Control
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8 md:px-10 md:py-10">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-8 text-center uppercase tracking-tight">
              Selamat Datang Kembali
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/60 border border-yellow-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                  placeholder="admin"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/60 border border-yellow-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-modern py-5 rounded-2xl shadow-xl shadow-yellow-500/20 active:scale-95 transition-transform"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Masuk Dashboard'
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">&copy; 2026 PENTALAND. Monitoring System.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
