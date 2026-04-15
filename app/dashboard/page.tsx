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
    <div className="min-h-screen bg-[#0A0F1A] text-slate-100 relative overflow-hidden">
      {/* Dynamic Building Vector Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          {/* Dense Cityscape Pattern */}
          <g fill="url(#goldGradient)">
            <rect x="50" y="400" width="80" height="600" rx="4" />
            <rect x="150" y="300" width="100" height="700" rx="4" />
            <rect x="270" y="500" width="70" height="500" rx="4" />
            <rect x="360" y="200" width="120" height="800" rx="4" />
            <rect x="500" y="450" width="90" height="550" rx="4" />
            <rect x="610" y="250" width="110" height="750" rx="4" />
            <rect x="740" y="550" width="80" height="450" rx="4" />
            <rect x="840" y="350" width="100" height="650" rx="4" />
            <rect x="900" y="100" width="60" height="900" rx="4" />
          </g>
        </svg>
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-slate-800/60 backdrop-blur-md bg-[#0A0F1A]/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <span className="text-amber-500 font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">PENTALAND</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 text-sm font-medium border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 transition-all rounded-lg text-slate-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-amber-500 tracking-wider font-semibold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Admin Control Panel
            </div>
            <h2 className="text-6xl font-extrabold tracking-tighter leading-[1.1]">
              Welcome back, <br/>
              <span className="text-gold-gradient">{username}</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              Pantau dan kelola seluruh operasional logistik proyek dengan sistem kendali terpusat yang presisi.
            </p>
            <button className="btn-modern px-8 py-4 rounded-xl font-semibold text-white shadow-lg flex items-center gap-3">
              Monitoring Logistic
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <div className="relative group perspective">
            <div className="glass-card-strong rounded-3xl p-8 border-slate-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Status</div>
                    <div className="text-sm text-green-400 font-semibold">Operational</div>
                </div>
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                    <div key={i} className="h-16 rounded-2xl border border-slate-700/50 flex items-center px-4 gap-4 bg-slate-900/30">
                        <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-2 w-24 bg-slate-700 rounded-full"></div>
                            <div className="h-2 w-16 bg-slate-800 rounded-full"></div>
                        </div>
                    </div>
                ))}
              </div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-[32px] opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
