'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const adminUser = localStorage.getItem('admin_username');

    if (!isLoggedIn) {
      router.push('/');
    } else {
      setUsername(adminUser || 'Administrator');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    router.push('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-amber-200">
      {/* Elegant Light Abstract Background */}
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

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-yellow-500/20 backdrop-blur-xl bg-white/60 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <span className="text-white font-black text-xl">P</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">PENTALAND</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest border border-yellow-500/30 hover:bg-yellow-500 hover:text-black transition-all rounded-xl text-slate-700 bg-white/80"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-yellow-400/20 border border-yellow-500/30 text-[10px] text-amber-700 tracking-[0.2em] font-black uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Admin Control Panel
            </div>
            <h2 className="text-7xl font-black tracking-tighter leading-[0.9] text-slate-900">
              Welcome back, <br/>
              <span className="text-gold-gradient drop-shadow-sm">{username}</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed font-bold opacity-80">
              Pantau dan kelola seluruh operasional logistik proyek dengan sistem kendali terpusat yang presisi dan elegan.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <button 
                onClick={() => router.push('/projects')}
                className="btn-modern px-10 py-5 rounded-2xl font-black text-black shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all"
              >
                Monitoring Proyek
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative group">
            {/* Box dengan gradasi kuning-emas */}
            <div className="glass-card-strong rounded-[48px] p-10 border-yellow-400/30 shadow-[0_32px_64px_-16px_rgba(212,163,11,0.15)] transition-all hover:shadow-[0_48px_80px_-20px_rgba(212,163,11,0.2)] relative z-10 overflow-hidden bg-gradient-to-br from-white/80 via-yellow-50/50 to-yellow-100/40">
               {/* Decorative background for the card */}
               <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 blur-3xl rounded-full -mr-24 -mt-24"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/5 blur-2xl rounded-full -ml-16 -mb-16"></div>
               
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Status Proyek</div>
                    <div className="text-xs text-amber-700 font-black bg-yellow-400/20 px-3 py-1 rounded-lg uppercase tracking-widest border border-yellow-500/20">Operational</div>
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-3xl border border-yellow-200/50 flex items-center px-6 gap-6 bg-white/60 hover:bg-yellow-100/50 hover:border-yellow-400 transition-all cursor-default group/item shadow-sm">
                        <div className="w-10 h-10 rounded-2xl bg-yellow-50 group-hover/item:bg-white transition-colors flex items-center justify-center">
                           <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="h-2.5 w-32 bg-yellow-200/50 rounded-full group-hover/item:bg-yellow-300/50 transition-colors"></div>
                            <div className="h-2 w-20 bg-yellow-50 rounded-full"></div>
                        </div>
                    </div>
                ))}
              </div>
            </div>
            
            {/* Soft decorative glow behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-300 to-amber-500 rounded-[60px] opacity-10 blur-3xl -z-10 group-hover:opacity-30 transition-opacity"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
