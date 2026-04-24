'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useInventory } from '@/app/hooks/useInventory';
import { useProject } from '@/app/context/ProjectContext';
import SummaryCards from '@/app/components/inventory/SummaryCards';
import GoodsTable from '@/app/components/inventory/GoodsTable';
import ModalGoodsIn from '@/app/components/inventory/ModalGoodsIn';
import ModalGoodsOut from '@/app/components/inventory/ModalGoodsOut';
import { ArrowLeft, Plus, Send, PenTool, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const { id: projectId, itemId } = useParams();
  const router = useRouter();
  const { loading, updateProjectItem } = useProject();
  
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const alias = localStorage.getItem('pentaland_user_alias');
      setIsAdmin(['admin', 'henny', 'ko awi'].includes(alias?.toLowerCase().trim() || ''));
    }
  }, []);

  const { 
    project, 
    item, 
    summary, 
    transactions, 
    addGoodsIn, 
    addGoodsOut, 
    addUsage,
    isCritical 
  } = useInventory(projectId as string, itemId as string);

  const { isUnlocked } = useProject();

  // Security Check: Redirect if project is locked and not admin
  useEffect(() => {
    if (!loading && project && !isAdmin && !isUnlocked(project.id)) {
      router.push('/projects');
    }
  }, [project, loading, isAdmin, isUnlocked, router]);

  const [isModalInOpen, setIsModalInOpen] = useState(false);
  const [modalOutConfig, setModalOutConfig] = useState<{ open: boolean, type: 'OUT' | 'USAGE' }>({ open: false, type: 'OUT' });
  const [isEditingLimits, setIsEditingLimits] = useState(false);
  const [editData, setEditData] = useState({ quantityLimit: 0, notes: '' });

  // Sync editData when item loads or changes
  useEffect(() => {
    if (item) {
      setEditData({ 
        quantityLimit: item.quantityLimit || 0, 
        notes: item.notes || '' 
      });
    }
  }, [item]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass-card-strong p-12 rounded-[48px] border-yellow-400/30 bg-gradient-to-br from-white/95 to-yellow-50/60 shadow-2xl max-w-md">
          <Package className="w-16 h-16 text-yellow-500 mx-auto mb-6 opacity-20" />
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Data Tidak Ditemukan</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-8">Informasi proyek atau item logistik tidak tersedia atau telah dihapus.</p>
          <button 
            onClick={() => router.push('/projects')} 
            className="btn-modern px-10 py-5 rounded-2xl w-full"
          >
            Kembali
          </button>
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
          <div className="flex items-center gap-4 md:gap-6">
            <Link 
              href={`/projects/${projectId}`}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border border-yellow-200 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{item.name}</h1>
              <p className="text-[9px] md:text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-2">
                {project.name} <span className="w-1 h-1 bg-yellow-200 rounded-full"></span> {item.itemCode}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="px-4 py-2 rounded-xl bg-white/50 border border-yellow-200 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
               Satuan: <span className="text-amber-600 font-black">{item.unit.toUpperCase()}</span>
             </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Banner Stok Habis/Kritis */}
        {isCritical && (
          <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-white/90 backdrop-blur-xl border border-red-200/60 rounded-[32px] md:rounded-[48px] p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 shadow-2xl shadow-red-500/5 group animate-pulse">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-xl shadow-red-600/30 shrink-0">
              <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="relative">
              <h3 className="text-xl md:text-3xl font-black text-red-600 uppercase tracking-tighter leading-tight mb-2">Peringatan: Stok Habis!</h3>
              <p className="text-xs md:text-sm text-red-500/80 font-bold uppercase tracking-wide leading-relaxed max-w-2xl">Stok barang saat ini kosong. Segera lakukan pengadaan untuk melanjutkan proyek.</p>
            </div>
          </div>
        )}

        {/* Banner Melebihi Batas Kuantitas */}
        {item.quantityLimit && summary.totalIn >= item.quantityLimit && (
          <div className="relative overflow-hidden bg-gradient-to-br from-red-50/90 to-white/90 backdrop-blur-xl border border-red-200/60 rounded-[32px] md:rounded-[48px] p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 shadow-2xl shadow-red-500/5 group transition-all hover:shadow-red-500/10">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
            
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl shadow-red-500/30 shrink-0 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            
            <div className="relative w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/50 border border-red-200 text-[9px] font-black text-red-600 uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                Limit Tercapai
              </div>
              <h3 className="text-xl md:text-3xl font-black text-red-600 uppercase tracking-tighter leading-tight mb-2">Kuota Terpenuhi!</h3>
              <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wide leading-relaxed max-w-2xl mb-6">
                Total barang masuk <span className="text-red-600 font-black">({summary.totalIn} {item.unit})</span> telah mencapai atau melebihi batasan yang ditetapkan <span className="text-slate-900 font-black">({item.quantityLimit} {item.unit})</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-white/60 border border-red-100 rounded-3xl p-5 sm:p-6 shadow-sm max-w-xl">
                {/* SVG Donut Chart */}
                <div className="relative w-24 h-24 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {/* Background Ring */}
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                    
                    {/* Barang Keluar Ring */}
                    {summary.totalIn > 0 && summary.totalOut > 0 && (
                      <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#a855f7" strokeWidth="4" strokeDasharray={`${(summary.totalOut / summary.totalIn) * 100} ${100 - (summary.totalOut / summary.totalIn) * 100}`} strokeDashoffset="0" strokeLinecap="round" />
                    )}
                    
                    {/* Barang Terpakai Ring */}
                    {summary.totalIn > 0 && summary.totalUsage > 0 && (
                      <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#eab308" strokeWidth="4" strokeDasharray={`${(summary.totalUsage / summary.totalIn) * 100} ${100 - (summary.totalUsage / summary.totalIn) * 100}`} strokeDashoffset={`-${(summary.totalOut / summary.totalIn) * 100}`} strokeLinecap="round" />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                    <span className="text-sm font-black text-slate-800 leading-none mt-0.5">{summary.totalIn}</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex-1 w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Keluar (Distribusi)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-800">{summary.totalOut}</span>
                      <span className="text-[9px] font-bold text-slate-400 ml-1">{item.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Terpakai (Aktual)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-800">{summary.totalUsage}</span>
                      <span className="text-[9px] font-bold text-slate-400 ml-1">{item.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sisa Stok</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-800">{summary.currentStock}</span>
                      <span className="text-[9px] font-bold text-slate-400 ml-1">{item.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Statistik Inventaris</h2>
          <SummaryCards summary={summary} unit={item.unit} />
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Action Column */}
          <div className="space-y-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Menu Transaksi</h2>
            
            <div className="glass-card-strong p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-slate-100 space-y-4 md:space-y-5 bg-white/60 shadow-xl">
              <button 
                onClick={() => setIsModalInOpen(true)}
                className="w-full group flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-[24px] md:rounded-[32px] bg-blue-50 border border-blue-100 hover:bg-blue-500 hover:border-blue-500 transition-all text-left shadow-sm"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[20px] bg-blue-500 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shadow-blue-500/20 shrink-0">
                  <Plus className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-blue-500" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 group-hover:text-white/80 transition-colors">Tambah Stok</p>
                  <p className="text-base md:text-lg font-black text-slate-900 group-hover:text-white transition-colors">Barang Masuk</p>
                </div>
              </button>

              <button 
                onClick={() => setModalOutConfig({ open: true, type: 'OUT' })}
                className="w-full group flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-[24px] md:rounded-[32px] bg-purple-50 border border-purple-100 hover:bg-purple-500 hover:border-purple-500 transition-all text-left shadow-sm"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[20px] bg-purple-500 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shadow-purple-500/20 shrink-0">
                  <Send className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-purple-500" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 group-hover:text-white/80 transition-colors">Distribusi</p>
                  <p className="text-base md:text-lg font-black text-slate-900 group-hover:text-white transition-colors">Barang Keluar</p>
                </div>
              </button>

              <button 
                onClick={() => setModalOutConfig({ open: true, type: 'USAGE' })}
                className="w-full group flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-[24px] md:rounded-[32px] bg-yellow-50 border border-yellow-100 hover:bg-yellow-500 hover:border-yellow-500 transition-all text-left shadow-sm"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[20px] bg-yellow-500 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shadow-yellow-500/20 shrink-0">
                  <PenTool className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-yellow-600" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 group-hover:text-white/80 transition-colors">Operasional</p>
                  <p className="text-base md:text-lg font-black text-slate-900 group-hover:text-white transition-colors">Pemakaian Aktual</p>
                </div>
              </button>
            </div>

            <div className="glass-card-strong p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-slate-100 bg-slate-50/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full"></div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Pengaturan Item</h4>
                {isAdmin && !isEditingLimits && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditData({ quantityLimit: item.quantityLimit || 0, notes: item.notes || '' });
                      setIsEditingLimits(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                  >
                    Edit Pengaturan
                  </button>
                )}
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col gap-2 py-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Batas Kuantitas</span>
                  {isEditingLimits ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={editData.quantityLimit}
                        onChange={(e) => setEditData({ ...editData, quantityLimit: Number(e.target.value) })}
                        className="w-full bg-white border border-yellow-200 rounded-lg px-3 py-2 text-sm font-black outline-none focus:ring-2 focus:ring-yellow-500/20"
                      />
                      <span className="text-[10px] font-black text-slate-400 uppercase">{item.unit}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">{item.quantityLimit || '-'} {item.unit}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 py-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Catatan Inventaris</span>
                  {isEditingLimits ? (
                    <textarea 
                      value={editData.notes}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      placeholder="Catatan khusus untuk item ini..."
                      rows={3}
                      className="w-full bg-white border border-yellow-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-yellow-500/20 resize-none"
                    />
                  ) : (
                    <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                      {item.notes || 'Tidak ada catatan khusus.'}
                    </p>
                  )}
                </div>

                {isEditingLimits && (
                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsEditingLimits(false)}
                      className="flex-1 py-4 rounded-2xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      type="button"
                      onClick={async () => {
                        const res = await updateProjectItem(item.id, editData);
                        if (res.success) setIsEditingLimits(false);
                        else alert(res.message);
                      }}
                      className="flex-[2] py-4 rounded-2xl bg-yellow-500 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-yellow-500/20 hover:bg-yellow-600 transition-colors"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table Column */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Detail Pergerakan</h2>
            <GoodsTable transactions={transactions} unit={item.unit} />
          </div>
        </div>
      </main>

      {/* Modals */}
      <ModalGoodsIn 
        isOpen={isModalInOpen} 
        onClose={() => setIsModalInOpen(false)} 
        onSubmit={async (data) => {
          const res = await addGoodsIn(data);
          if (!res.success) alert(res.message);
        }}
        unit={item.unit}
        quantityLimit={item.quantityLimit}
        currentTotalIn={summary.totalIn}
      />
      
      <ModalGoodsOut 
        isOpen={modalOutConfig.open} 
        onClose={() => setModalOutConfig({ ...modalOutConfig, open: false })}
        type={modalOutConfig.type}
        maxQuantity={summary.currentStock}
        onSubmit={async (data) => {
          let res;
          if (modalOutConfig.type === 'OUT') res = await addGoodsOut(data);
          else res = await addUsage(data);
          
          if (!res.success) alert(res.message);
        }}
        unit={item.unit}
      />
    </div>
  );
}
