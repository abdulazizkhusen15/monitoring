'use client';

import { useState, useEffect } from 'react';
import { useProject } from '@/app/context/ProjectContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Lock, Unlock, Key, ShieldCheck } from 'lucide-react';

export default function ProjectsPage() {
  const { projects, loading, addProject, toggleProjectStatus, deleteProject, updateProjectPin, unlockProject, isUnlocked } = useProject();
  const { user } = useAuth();
  const router = useRouter();
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // PIN Logic States
  const [pinModal, setPinModal] = useState<{ open: boolean; projectId: string; action: 'LOCK' | 'UNLOCK' | 'ENTER' }>({ 
    open: false, projectId: '', action: 'ENTER' 
  });
  const [pinValue, setPinValue] = useState('');

  useEffect(() => {
    const alias = localStorage.getItem('pentaland_user_alias');
    setIsAdmin(alias === 'admin');
  }, []);

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;
    const result = await addProject(newProjectName);
    if (result.success) {
      setNewProjectName('');
      setError('');
    } else {
      setError(result.message);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!isAdmin) return;
    if (confirm(`Apakah Anda yakin ingin menghapus proyek "${name}"? Seluruh data barang dan transaksi di dalamnya akan ikut terhapus.`)) {
      const result = await deleteProject(id);
      if (!result.success) alert(result.message);
    }
  };

  const submitPin = async () => {
    if (pinModal.action === 'ENTER') {
      const success = unlockProject(pinModal.projectId, pinValue);
      if (success) {
        const targetUrl = `/projects/${pinModal.projectId}`;
        setPinModal({ open: false, projectId: '', action: 'ENTER' });
        setPinValue('');
        router.push(targetUrl);
      } else {
        alert('PIN Salah!');
      }
    } else {
      const res = await updateProjectPin(pinModal.projectId, pinModal.action === 'LOCK' ? pinValue : null);
      if (res.success) {
        setPinModal({ open: false, projectId: '', action: 'ENTER' });
        setPinValue('');
      } else {
        alert(res.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
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

      {/* Header */}
      <header className="relative z-20 border-b border-yellow-500/20 backdrop-blur-xl bg-white/60 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">PENTALAND</h1>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left Side: Info & Form */}
          <div className="space-y-10">
            <div className="space-y-4">
               <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">Monitoring <br/><span className="text-gold-gradient">Proyek</span></h2>
               <p className="text-lg text-slate-500 font-medium leading-relaxed">
                 {isAdmin 
                   ? 'Kelola dan pantau seluruh operasional proyek Pentaland dengan efisiensi tertinggi.' 
                   : 'Daftar proyek aktif Pentaland. Silakan pilih proyek untuk memantau aktivitas logistik.'}
               </p>
            </div>
            
            {isAdmin ? (
              <div className="glass-card-strong rounded-[40px] p-10 border-yellow-400/30 bg-gradient-to-br from-white/90 to-yellow-50/50 shadow-xl">
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
            ) : (
              <div className="glass-card-strong rounded-[40px] p-10 border-slate-100 bg-white/40 shadow-sm">
                <div className="flex items-center gap-4 text-slate-400">
                  <ShieldCheck className="w-6 h-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Akses Terbatas: Operator Logistik</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: List */}
          <div className="glass-card-strong rounded-[40px] p-10 border-yellow-400/30 shadow-xl h-fit bg-gradient-to-br from-white/90 to-yellow-50/50">
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
                    <div className="flex items-center justify-between p-6 bg-gradient-to-br from-white/80 to-yellow-50/40 border border-yellow-200/50 rounded-[32px] hover:bg-white hover:border-yellow-500/30 hover:shadow-lg transition-all group backdrop-blur-xl">
                      <div className="flex-1">
                        {isUnlocked(p.id) ? (
                          <Link href={`/projects/${p.id}`}>
                            <h4 className="font-black text-xl text-slate-900 group-hover:text-amber-600 transition-colors">{p.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Buka Detail Dashboard</span>
                              <svg className="w-3 h-3 text-slate-300 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                            </div>
                          </Link>
                        ) : (
                          <button 
                            onClick={() => setPinModal({ open: true, projectId: p.id, action: 'ENTER' })}
                            className="text-left w-full group/btn"
                          >
                            <h4 className="font-black text-xl text-slate-400 group-hover/btn:text-amber-600 transition-colors flex items-center gap-3">
                              {p.name} <Lock className="w-4 h-4 text-slate-300" />
                            </h4>
                            <p className="text-[10px] text-red-400 font-black uppercase tracking-[0.2em] mt-1 italic">Proyek Terkunci - Klik untuk masukkan PIN</p>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {isAdmin && (
                          <button 
                            onClick={() => setPinModal({ open: true, projectId: p.id, action: p.pin ? 'UNLOCK' : 'LOCK' })}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${p.pin ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200 opacity-40 hover:opacity-100'}`}
                            title={p.pin ? "Ubah/Buka Kunci PIN" : "Kunci Proyek"}
                          >
                            {p.pin ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                        )}
                        
                        <button 
                          onClick={() => isAdmin && toggleProjectStatus(p.id, p.status)}
                          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${p.status ? 'bg-green-500/10 text-green-600 border border-green-500/10' : 'bg-red-500/10 text-red-500 border border-red-500/10'} ${!isAdmin ? 'cursor-default opacity-70' : 'hover:scale-105 active:scale-95'}`}
                        >
                          {p.status ? 'Aktif' : 'Non-Aktif'}
                        </button>
                        
                        {isAdmin && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(p.id, p.name);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm group/del"
                            title="Hapus Proyek"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* PIN Modal */}
      {pinModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card-strong w-full max-w-sm rounded-[48px] p-10 border-yellow-400/30 bg-white shadow-2xl scale-in-center">
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-yellow-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-yellow-500/20">
                <Key className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {pinModal.action === 'LOCK' ? 'Kunci Proyek' : pinModal.action === 'UNLOCK' ? 'Buka Kunci' : 'Masukkan PIN'}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  {pinModal.action === 'LOCK' ? 'Tentukan PIN 6-Digit' : 'Akses Terbatas'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <input 
                type="password"
                maxLength={6}
                placeholder="••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-center text-2xl font-black tracking-[1em] placeholder:tracking-normal placeholder:text-slate-200"
                value={pinValue}
                onChange={(e) => setPinValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && submitPin()}
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => { setPinModal({ open: false, projectId: '', action: 'ENTER' }); setPinValue(''); }}
                  className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={submitPin}
                  className="flex-[2] btn-modern py-4 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform"
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
