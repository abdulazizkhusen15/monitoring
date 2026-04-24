'use client';

import { InventoryTransaction } from '@/app/types/inventory';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowDownLeft, ArrowUpRight, Package, Search } from 'lucide-react';
import { useState } from 'react';

interface GoodsTableProps {
  transactions: InventoryTransaction[];
  unit: string;
}

export default function GoodsTable({ transactions, unit }: GoodsTableProps) {
  const [filter, setFilter] = useState<'ALL' | 'IN' | 'OUT' | 'USAGE'>('ALL');

  const filtered = transactions.filter(t => filter === 'ALL' || t.type === filter);

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'IN': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'OUT': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'USAGE': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'IN': return 'Barang Masuk';
      case 'OUT': return 'Distribusi';
      case 'USAGE': return 'Pemakaian';
      default: return type;
    }
  };

  const sortedTransactions = [...filtered].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="glass-card-strong rounded-[32px] md:rounded-[48px] overflow-hidden border-slate-100 shadow-xl bg-white/60">
      <div className="p-6 md:p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-white/40">
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
            Riwayat Pergerakan
            <span className="text-[9px] md:text-[10px] font-black text-amber-600 bg-amber-500/10 px-3 py-1 rounded-lg uppercase tracking-widest border border-amber-500/10">{filtered.length} Data</span>
          </h3>
          <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">Logging pergerakan logistik aktual</p>
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-xl md:p-1.5 md:rounded-2xl border border-slate-100 shadow-inner overflow-x-auto no-scrollbar">
          {(['ALL', 'IN', 'OUT', 'USAGE'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === t ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t === 'ALL' ? 'Semua' : t === 'IN' ? 'Masuk' : t === 'OUT' ? 'Keluar' : 'Pakai'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tanggal</th>
              <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Klasifikasi</th>
              <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Qty</th>
              <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-10 py-24 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px] bg-white/20">
                  <Package className="w-10 h-10 mx-auto mb-4 opacity-20" />
                  Tidak ada data transaksi ditemukan.
                </td>
              </tr>
            ) : (
              sortedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-yellow-50/50 transition-colors group cursor-default">
                  <td className="px-4 md:px-10 py-5 md:py-7">
                    <div className="text-xs md:text-sm font-black text-slate-900 mb-0.5">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1 md:gap-2">
                       <span className="hidden md:inline w-1 h-1 bg-slate-200 rounded-full"></span>
                       {new Date(t.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-4 md:px-10 py-5 md:py-7">
                    <span className={`px-3 md:px-4 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border transition-all ${getBadgeStyle(t.type)}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 md:px-10 py-5 md:py-7 text-right">
                    <div className={`text-base md:text-xl font-black ${t.type === 'IN' ? 'text-blue-600' : 'text-slate-900'} tracking-tight`}>
                      {t.type === 'IN' ? '+' : '-'}{t.quantity}
                    </div>
                    <div className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest">{unit}</div>
                  </td>
                  <td className="px-4 md:px-10 py-5 md:py-7">
                    <p className="text-[10px] md:text-sm font-medium text-slate-500 max-w-[80px] md:max-w-xs truncate transition-colors group-hover:text-slate-900" title={t.notes}>
                      {t.notes || '-'}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
