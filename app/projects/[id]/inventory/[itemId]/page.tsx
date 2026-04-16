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
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass-card-strong p-12 rounded-[48px] border-yellow-400/30 bg-gradient-to-br from-white/95 to-yellow-50/60 shadow-2xl max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Data Tidak Ditemukan</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-8">Informasi proyek atau item logistik tidak tersedia atau telah dihapus.</p>
          <button 
            onClick={() => router.back()} 
            className="btn-modern px-10 py-5 rounded-2xl w-full flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-5 h-5" />
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
          <div className="flex items-center gap-6">
            <Link 
              href={`/projects/${projectId}`}
              className="w-12 h-12 rounded-2xl bg-white border border-yellow-200 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{item.name}</h1>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-2">
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
          <div className="bg-red-50 border border-red-100 rounded-[40px] p-8 flex items-center gap-8 animate-pulse shadow-xl shadow-red-500/5">
            <div className="w-16 h-16 rounded-[24px] bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-red-600 uppercase tracking-tight">Peringatan: Stok Habis!</h3>
              <p className="text-sm text-red-500/80 font-bold uppercase tracking-wider mt-1">Stok barang saat ini kosong. Segera lakukan pengadaan untuk melanjutkan proyek.</p>
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
            
            <div className="glass-card-strong p-10 rounded-[48px] border-slate-100 space-y-5 bg-white/60 shadow-xl">
              <button 
                onClick={() => setIsModalInOpen(true)}
                className="w-full group flex items-center gap-6 p-5 rounded-[32px] bg-blue-50 border border-blue-100 hover:bg-blue-500 hover:border-blue-500 transition-all text-left shadow-sm"
              >
                <div className="w-14 h-14 rounded-[20px] bg-blue-500 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shadow-blue-500/20">
                  <Plus className="w-7 h-7 text-white group-hover:text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 group-hover:text-white/80 transition-colors">Tambah Stok</p>
                  <p className="text-lg font-black text-slate-900 group-hover:text-white transition-colors">Barang Masuk</p>
                </div>
              </button>

              <button 
                onClick={() => setModalOutConfig({ open: true, type: 'OUT' })}
                className="w-full group flex items-center gap-6 p-5 rounded-[32px] bg-purple-50 border border-purple-100 hover:bg-purple-500 hover:border-purple-500 transition-all text-left shadow-sm"
              >
                <div className="w-14 h-14 rounded-[20px] bg-purple-500 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shadow-purple-500/20">
                  <Send className="w-7 h-7 text-white group-hover:text-purple-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 group-hover:text-white/80 transition-colors">Distribusi</p>
                  <p className="text-lg font-black text-slate-900 group-hover:text-white transition-colors">Barang Keluar</p>
                </div>
              </button>

              <button 
                onClick={() => setModalOutConfig({ open: true, type: 'USAGE' })}
                className="w-full group flex items-center gap-6 p-5 rounded-[32px] bg-yellow-50 border border-yellow-100 hover:bg-yellow-500 hover:border-yellow-500 transition-all text-left shadow-sm"
              >
                <div className="w-14 h-14 rounded-[20px] bg-yellow-500 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shadow-yellow-500/20">
                  <PenTool className="w-7 h-7 text-white group-hover:text-yellow-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 group-hover:text-white/80 transition-colors">Operasional</p>
                  <p className="text-lg font-black text-slate-900 group-hover:text-white transition-colors">Pemakaian Aktual</p>
                </div>
              </button>
            </div>

            <div className="glass-card-strong p-10 rounded-[48px] border-slate-100 bg-slate-50/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full"></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Informasi Teknis</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kode Katalog</span>
                  <span className="text-sm font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-100">{item.itemCode}</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Satuan Tetap</span>
                  <span className="text-sm font-black text-amber-600 uppercase">{item.unit}</span>
                </div>
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
        onSubmit={(data) => {
          const res = addGoodsIn(data);
          if (!res.success) alert(res.message);
        }}
        unit={item.unit}
      />
      
      <ModalGoodsOut 
        isOpen={modalOutConfig.open} 
        onClose={() => setModalOutConfig({ ...modalOutConfig, open: false })}
        type={modalOutConfig.type}
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
