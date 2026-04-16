'use client';

import { useProject } from '@/app/context/ProjectContext';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { VALID_UNITS, Unit } from '@/app/types/inventory';
import { Package, Plus, ChevronRight, Settings } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { projects, addProjectItem, removeProjectItem, toggleProjectStatus } = useProject();
  
  const project = projects.find(p => p.id === id);
  
  const [itemName, setItemName] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [unit, setUnit] = useState<Unit>(VALID_UNITS[0]);
  const [error, setError] = useState('');

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center text-white p-6 text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4 text-white">Proyek Tidak Ditemukan</h1>
          <button onClick={() => router.push('/projects')} className="text-amber-500 hover:text-amber-400 font-bold">Kembali ke Daftar Proyek</button>
        </div>
      </div>
    );
  }

  const handleAddItem = () => {
    if (!itemName || !itemCode || !unit) {
      setError('Semua kolom wajib diisi');
      return;
    }
    const result = addProjectItem(project.id, itemName, itemCode, unit);
    if (result.success) {
      setItemName('');
      setItemCode('');
      setError('');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Kembali
          </Link>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${project.status ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {project.status ? 'Aktif' : 'Non-Aktif'}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <h2 className="text-6xl font-black tracking-tighter text-white leading-none">{project.name}</h2>
              <div className="flex items-center gap-4 text-slate-500 text-sm font-bold uppercase tracking-widest">
                <span>Daftar Logistik Proyek</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span>{project.items.length} Item Terdaftar</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {project.items.length === 0 ? (
                <div className="glass-card-strong rounded-[40px] py-16 text-center border border-white/5">
                  <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Belum ada barang terdaftar</p>
                </div>
              ) : (
                project.items.map((item) => (
                  <div key={item.id} className="group relative">
                    <Link 
                      href={`/projects/${project.id}/inventory/${item.id}`}
                      className="block glass-card-strong p-6 rounded-[32px] border border-white/5 hover:border-amber-500/40 hover:bg-white/[0.03] transition-all relative z-10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-left">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">{item.name}</h4>
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <span className="text-amber-500/70">{item.itemCode}</span>
                              <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                              <span>Satuan: {item.unit}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        removeProjectItem(project.id, item.id);
                      }}
                      className="absolute -right-2 -top-2 z-20 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-xl"
                      aria-label="Hapus"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar Area: Form */}
          <div className="space-y-6">
            <div className="glass-card-strong rounded-[40px] p-8 border border-white/5 sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Katalog Baru</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Barang</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Semen Gresik" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:border-amber-500 outline-none transition-all text-white font-medium"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kode Barang</label>
                    <input 
                      type="text" 
                      placeholder="SMN-01" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:border-amber-500 outline-none transition-all text-white font-medium uppercase"
                      value={itemCode}
                      onChange={(e) => setItemCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Satuan</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:border-amber-500 outline-none transition-all text-white font-medium appearance-none"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as Unit)}
                    >
                      {VALID_UNITS.map(u => (
                        <option key={u} value={u}>{u.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold leading-relaxed">{error}</div>}
                
                <button 
                  onClick={handleAddItem}
                  className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-amber-500/10"
                >
                  Tambahkan Barang
                </button>
              </div>
            </div>

            <div className="glass-card-strong p-8 rounded-[40px] border border-white/5 bg-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-slate-500" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Status Proyek</h4>
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">Kelola visibilitas proyek di layar monitoring utama Pentaland.</p>
              <button 
                onClick={() => toggleProjectStatus(project.id)}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${project.status ? 'border-red-500/20 text-red-500 hover:bg-red-500/10' : 'border-green-500/20 text-green-400 hover:bg-green-500/10'}`}
              >
                {project.status ? 'Hentikan Monitoring' : 'Mulai Monitoring'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
