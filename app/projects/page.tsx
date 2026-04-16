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
    <div className="min-h-screen bg-[#0A0F1A] text-slate-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <g fill="#FACC15"><rect x="100" y="200" width="100" height="800" rx="4"/><rect x="300" y="100" width="120" height="900" rx="4"/></g>
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-amber-500/20 backdrop-blur-md bg-gradient-to-r from-amber-500 to-amber-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">PENTALAND</h1>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Side: Form */}
          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold tracking-tighter">Monitoring Proyek</h2>
            <p className="text-lg text-slate-400">Kelola dan pantau proyek aktif Pentaland dengan presisi.</p>
            
            <div className="glass-card-strong rounded-3xl p-8 border border-slate-700/50">
              <input 
                type="text" 
                placeholder="Nama Proyek Baru" 
                className={`w-full bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 mb-2 focus:border-amber-500 outline-none transition-all`}
                value={newProjectName}
                onChange={(e) => {
                  setNewProjectName(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
              />
              {error && <p className="text-red-400 text-sm mb-4 ml-1">{error}</p>}
              <button 
                onClick={handleAddProject}
                className="w-full btn-modern py-3 rounded-xl font-semibold mt-2"
              >
                Tambah Proyek
              </button>
            </div>
          </div>

          {/* Right Side: List */}
          <div className="glass-card-strong rounded-3xl p-8 border border-slate-700/50">
            <h3 className="text-xl font-bold mb-6">Daftar Proyek</h3>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-slate-500 italic">
                  Belum ada proyek. Tambahkan proyek baru di sebelah kiri.
                </div>
              ) : (
                projects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-colors group">
                    <Link href={`/projects/${p.id}`} className="font-medium text-lg hover:text-amber-400 transition-colors flex-1 cursor-pointer">
                      {p.name}
                      <span className="block text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Lihat Detail →</span>
                    </Link>
                    <button 
                      onClick={() => toggleProjectStatus(p.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${p.status ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
                    >
                      {p.status ? 'Active' : 'Inactive'}
                    </button>
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
