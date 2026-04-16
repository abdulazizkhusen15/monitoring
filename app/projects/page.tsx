'use client';

import { useState } from 'react';
import { useProject } from '@/app/context/ProjectContext';
import Link from 'next/link';

export default function ProjectsPage() {
  const { projects, addProject, toggleProjectStatus } = useProject();
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');

  const handleAddProject = () => {
    const result = addProject(newProjectName);
    if (result.success) {
      setNewProjectName('');
      setError('');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Soft Elegant Background */}
      <div className="absolute inset-0 opacity-[0.5] pointer-events-none">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="0" cy="0" r="400" fill="rgba(252, 211, 77, 0.1)" />
          <circle cx="1000" cy="1000" r="400" fill="rgba(254, 243, 199, 0.1)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-yellow-500/10 backdrop-blur-xl bg-white/40 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">PENTALAND</h1>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left Side: Form */}
          <div className="space-y-10">
            <div className="space-y-4">
               <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">Monitoring <br/><span className="text-gold-gradient">Proyek</span></h2>
               <p className="text-lg text-slate-500 font-medium">Kelola dan pantau seluruh operasional proyek Pentaland dengan efisiensi tertinggi.</p>
            </div>
            
            <div className="glass-card-strong rounded-[40px] p-10 border-white shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
                  <span className="text-black font-black text-xs">+</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Buat Proyek Baru</h3>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nama Proyek (Contoh: Pentaland Tower A)" 
                  className={`w-full bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-100'} rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-medium`}
                  value={newProjectName}
                  onChange={(e) => {
                    setNewProjectName(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                />
                {error && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest">{error}</div>}
                <button 
                  onClick={handleAddProject}
                  className="w-full btn-modern py-5 rounded-2xl shadow-xl shadow-yellow-500/20 active:scale-95 transition-transform"
                >
                  Daftarkan Proyek
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: List */}
          <div className="glass-card-strong rounded-[40px] p-10 border-white shadow-xl h-fit">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Daftar Aktif</h3>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black tracking-widest uppercase">{projects.length} Total</span>
            </div>

            <div className="space-y-5">
              {projects.length === 0 ? (
                <div className="text-center py-16 px-6 glass-card rounded-3xl border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-slate-300 font-black text-2xl">?</span>
                  </div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Belum ada proyek terdaftar</p>
                </div>
              ) : (
                projects.map((p) => (
                  <div key={p.id} className="relative group">
                    <div className="flex items-center justify-between p-6 bg-white/40 border border-slate-100 rounded-[32px] hover:bg-white hover:border-yellow-500/30 hover:shadow-lg transition-all group">
                      <Link href={`/projects/${p.id}`} className="flex-1 cursor-pointer">
                        <h4 className="font-black text-xl text-slate-900 group-hover:text-amber-600 transition-colors">{p.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Buka Detail Dashboard</span>
                           <svg className="w-3 h-3 text-slate-300 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                        </div>
                      </Link>
                      <button 
                        onClick={() => toggleProjectStatus(p.id)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${p.status ? 'bg-green-500/10 text-green-600 border border-green-500/10' : 'bg-red-500/10 text-red-500 border border-red-500/10'}`}
                      >
                        {p.status ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
