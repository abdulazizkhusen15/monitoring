'use client';

import { useState } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Proyek A', status: true },
    { id: 2, name: 'Proyek B', status: false },
  ]);

  const toggleStatus = (id: number) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-slate-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <g fill="#FACC15"><rect x="100" y="200" width="100" height="800" rx="4"/><rect x="300" y="100" width="120" height="900" rx="4"/></g>
        </svg>
      </div>

      {/* Header (Same as Dashboard) */}
      <header className="relative z-20 border-b border-slate-800/60 backdrop-blur-md bg-[#0A0F1A]/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <span className="text-amber-500 font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">PENTALAND</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Side: Form */}
          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold tracking-tighter">Monitoring Proyek</h2>
            <p className="text-lg text-slate-400">Kelola dan pantau proyek aktif Pentaland dengan presisi.</p>
            
            <div className="glass-card-strong rounded-3xl p-8 border border-slate-700/50">
              <input type="text" placeholder="Nama Proyek Baru" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mb-4 focus:border-amber-500 outline-none" />
              <button className="w-full btn-modern py-3 rounded-xl font-semibold">Tambah Proyek</button>
            </div>
          </div>

          {/* Right Side: List */}
          <div className="glass-card-strong rounded-3xl p-8 border border-slate-700/50">
            <h3 className="text-xl font-bold mb-6">Daftar Proyek</h3>
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <span className="font-medium">{p.name}</span>
                  <button 
                    onClick={() => toggleStatus(p.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${p.status ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                  >
                    {p.status ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
