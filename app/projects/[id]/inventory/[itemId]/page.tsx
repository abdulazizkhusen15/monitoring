'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useInventory } from '@/app/hooks/useInventory';
import SummaryCards from '@/app/components/inventory/SummaryCards';
import GoodsTable from '@/app/components/inventory/GoodsTable';
import ModalGoodsIn from '@/app/components/inventory/ModalGoodsIn';
import ModalGoodsOut from '@/app/components/inventory/ModalGoodsOut';
import { ArrowLeft, Plus, Send, PenTool, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const { id: projectId, itemId } = useParams();
  const router = useRouter();
  
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

  const [isModalInOpen, setIsModalInOpen] = useState(false);
  const [modalOutConfig, setModalOutConfig] = useState<{ open: boolean, type: 'OUT' | 'USAGE' }>({ open: false, type: 'OUT' });

  if (!project || !item) {
    return (
      <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center text-white">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Data Tidak Ditemukan</h1>
          <button onClick={() => router.back()} className="mt-4 text-amber-500 hover:underline">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-slate-100 relative overflow-hidden pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>

      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-slate-900/60 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/projects/${projectId}`}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tight">{item.name}</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{project.name} • {item.itemCode}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 rounded-lg bg-slate-800 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
               Satuan: {item.unit.toUpperCase()}
             </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Banner Stok Habis/Kritis */}
        {isCritical && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-[32px] p-6 flex items-center gap-6 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Peringatan: Stok Habis!</h3>
              <p className="text-sm text-red-400/80 font-medium">Stok barang saat ini kosong. Segera lakukan pengadaan untuk melanjutkan proyek.</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Ringkasan Inventaris</h2>
          </div>
          <SummaryCards summary={summary} unit={item.unit} />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Action Column */}
          <div className="space-y-6">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Aksi Cepat</h2>
            
            <div className="glass-card-strong p-8 rounded-[40px] border border-white/5 space-y-4">
              <button 
                onClick={() => setIsModalInOpen(true)}
                className="w-full group flex items-center gap-4 p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:border-blue-500 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shadow-blue-500/20">
                  <Plus className="w-6 h-6 text-white group-hover:text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:text-white/80 transition-colors">Tambah Stok</p>
                  <p className="text-sm font-black text-white group-hover:text-white">Barang Masuk</p>
                </div>
              </button>

              <button 
                onClick={() => setModalOutConfig({ open: true, type: 'OUT' })}
                className="w-full group flex items-center gap-4 p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500 hover:border-purple-500 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shadow-purple-500/20">
                  <Send className="w-6 h-6 text-white group-hover:text-purple-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 group-hover:text-white/80 transition-colors">Distribusi</p>
                  <p className="text-sm font-black text-white group-hover:text-white">Barang Keluar</p>
                </div>
              </button>

              <button 
                onClick={() => setModalOutConfig({ open: true, type: 'USAGE' })}
                className="w-full group flex items-center gap-4 p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:border-amber-500 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shadow-amber-500/20">
                  <PenTool className="w-6 h-6 text-white group-hover:text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 group-hover:text-white/80 transition-colors">Operasional</p>
                  <p className="text-sm font-black text-white group-hover:text-white">Pemakaian Aktual</p>
                </div>
              </button>
            </div>

            <div className="glass-card-strong p-8 rounded-[40px] border border-white/5 bg-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Informasi Tambahan</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-xs font-bold text-slate-400">Kode Barang</span>
                  <span className="text-xs font-black text-white">{item.itemCode}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-xs font-bold text-slate-400">Satuan Tetap</span>
                  <span className="text-xs font-black text-amber-500">{item.unit.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Detail Pergerakan</h2>
            <GoodsTable transactions={transactions} unit={item.unit} />
          </div>
        </div>
      </main>

      {/* Modals */}
      <ModalGoodsIn 
        isOpen={isModalInOpen} 
        onClose={() => setIsModalInOpen(false)} 
        onSubmit={(data) => {
          const res = addGoodsIn(data);
          if (!res.success) alert(res.message);
        }}
        unit={item.unit}
      />
      
      <ModalGoodsOut 
        isOpen={modalOutConfig.open} 
        onClose={() => setModalOutConfig({ ...modalOutConfig, open: false })}
        title={modalOutConfig.type === 'OUT' ? 'Input Barang Keluar / Distribusi' : 'Input Pemakaian Aktual'}
        maxQuantity={summary.currentStock}
        onSubmit={(data) => {
          let res;
          if (modalOutConfig.type === 'OUT') res = addGoodsOut(data);
          else res = addUsage(data);
          
          if (!res.success) alert(res.message);
        }}
        unit={item.unit}
      />
    </div>
  );
}
