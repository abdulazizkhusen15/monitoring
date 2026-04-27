'use client';

import { useProject } from '@/app/context/ProjectContext';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VALID_UNITS, Unit } from '@/app/types/inventory';
import { Package, Plus, ChevronRight, Settings } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { projects, loading, addProjectItem, removeProjectItem, toggleProjectStatus, isUnlocked } = useProject();
  
  const project = projects.find(p => p.id === id);
  
  const [itemName, setItemName] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [unit, setUnit] = useState<Unit>(VALID_UNITS[0]);
  const [quantityLimit, setQuantityLimit] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<string>('');
  const [usageLimitNotes, setUsageLimitNotes] = useState<string>('');
  const [error, setError] = useState('');

  // Security Check: Redirect if project is locked and not admin
  useEffect(() => {
    if (!loading && project && !isUnlocked(project.id)) {
      router.push('/projects');
    }
  }, [project, loading, isUnlocked, router]);

  const handleAddItem = async () => {
    if (!itemName || !itemCode || !unit) {
      setError('Semua kolom wajib diisi');
      return;
    }
    if (!project) return;
    
    const result = await addProjectItem(
      project.id, 
      itemName, 
      itemCode, 
      unit, 
      quantityLimit ? Number(quantityLimit) : undefined,
      usageLimit ? Number(usageLimit) : undefined,
      undefined, // general notes (existing parameter order)
      usageLimitNotes
    );
    if (result.success) {
      setItemName('');
      setItemCode('');
      setQuantityLimit('');
      setUsageLimit('');
      setUsageLimitNotes('');
      setError('');
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass-card-strong p-12 rounded-[48px] border-yellow-400/30 bg-gradient-to-br from-white/95 to-yellow-50/60 shadow-2xl max-w-md">
          <Package className="w-16 h-16 text-yellow-500 mx-auto mb-6 opacity-20" />
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Proyek Tidak Ditemukan</h1>
          <button onClick={() => router.push('/projects')} className="btn-modern px-10 py-5 rounded-2xl w-full">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
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
      
      <header className="relative z-20 border-b border-yellow-500/20 backdrop-blur-xl bg-white/60 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-all font-black text-xs uppercase tracking-widest bg-white/50 px-4 py-2 rounded-xl border border-yellow-200 shadow-sm group">
            <ChevronRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            Kembali
          </Link>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${project.status ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              {project.status ? 'Aktif' : 'Non-Aktif'}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] drop-shadow-sm">{project.name}</h2>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Proyek Logistik</span>
                <span className="hidden md:inline w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span>{project.items.length} Item Terdaftar</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Katalog Barang</h3>
              {project.items.length === 0 ? (
                <div className="glass-card-strong rounded-[48px] py-20 text-center border-slate-100 shadow-sm">
                  <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Belum ada barang terdaftar</p>
                </div>
              ) : (
                project.items.map((item) => (
                  <div key={item.id} className="group relative">
                    <Link 
                      href={`/projects/${project.id}/inventory/${item.id}`}
                      className="block glass-card-strong p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-yellow-400/30 bg-gradient-to-br from-white/95 to-yellow-50/60 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all relative z-10"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 md:gap-8 text-left">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[24px] bg-yellow-500/10 border border-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            <Package className="w-6 h-6 md:w-7 md:h-7 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="text-lg md:text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{item.name}</h4>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <span className="text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">{item.itemCode}</span>
                              <span className="hidden md:inline w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                              <span>Satuan: {item.unit}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-all">
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                        </div>
                      </div>
                    </Link>
                    <button 
                      onClick={async (e) => {
                        e.preventDefault();
                        if (confirm(`Apakah Anda yakin ingin menghapus "${item.name}" dari katalog? Seluruh data transaksi untuk barang ini akan ikut terhapus.`)) {
                          await removeProjectItem(project.id, item.id);
                        }
                      }}
                      className="absolute -right-3 -top-3 z-20 w-10 h-10 rounded-full bg-white border border-red-100 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-xl"
                      aria-label="Hapus"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar Area: Form */}
          <div className="space-y-8 lg:order-last order-first">
            <div className="glass-card-strong rounded-[32px] md:rounded-[48px] p-6 md:p-10 border-yellow-400/30 shadow-xl lg:sticky lg:top-28 bg-gradient-to-br from-white/95 to-yellow-50/60">
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="w-10 h-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Katalog Baru</h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Barang</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Semen Gresik" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kode Barang</label>
                    <input 
                      type="text" 
                      placeholder="SMN-01" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold uppercase"
                      value={itemCode}
                      onChange={(e) => setItemCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Satuan</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold appearance-none cursor-pointer"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as Unit)}
                      >
                        {VALID_UNITS.map(u => (
                          <option key={u} value={u}>{u.toUpperCase()}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                         <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Batas Stok (Opsi)</label>
                    <input 
                      type="number" 
                      placeholder="600" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold"
                      value={quantityLimit}
                      onChange={(e) => setQuantityLimit(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Batas Pakai (Opsi)</label>
                    <input 
                      type="number" 
                      placeholder="100" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Catatan Batas Pakai (Opsi)</label>
                  <textarea 
                    placeholder="Alasan pembatasan..." 
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold resize-none"
                    value={usageLimitNotes}
                    onChange={(e) => setUsageLimitNotes(e.target.value)}
                  />
                </div>

                {error && <div className="p-5 bg-red-50 border border-red-100 rounded-[24px] text-red-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</div>}
                
                <button 
                  onClick={handleAddItem}
                  className="w-full py-6 btn-modern rounded-[24px] shadow-xl shadow-yellow-500/20 active:scale-95 transition-transform"
                >
                  Tambahkan Barang
                </button>
              </div>
            </div>

            <div className="glass-card-strong p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-slate-100 bg-slate-50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-3xl rounded-full"></div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <Settings className="w-5 h-5 text-slate-400 group-hover:rotate-90 transition-transform duration-700" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Kontrol Visibilitas</h4>
              </div>
              <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium relative z-10">Status proyek menentukan kemunculan proyek di layar monitoring utama Pentaland.</p>
              <button 
                onClick={async () => await toggleProjectStatus(project.id, project.status)}
                className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border transition-all relative z-10 ${project.status ? 'bg-white border-red-100 text-red-500 hover:bg-red-50' : 'bg-white border-green-100 text-green-600 hover:bg-green-50'}`}
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
