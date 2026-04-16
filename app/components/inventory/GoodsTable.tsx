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
    <div className="glass-card-strong rounded-3xl overflow-hidden border border-white/5">
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          Riwayat Pergerakan
          <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{filtered.length} Data</span>
        </h3>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
          {(['ALL', 'IN', 'OUT', 'USAGE'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === t ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}
            >
              {t === 'ALL' ? 'Semua' : t === 'IN' ? 'Masuk' : t === 'OUT' ? 'Keluar' : 'Pakai'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tanggal</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tipe</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Jumlah</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic text-sm">
                  Tidak ada data transaksi ditemukan.
                </td>
              </tr>
            ) : (
              sortedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-medium text-white">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold">PADA {new Date(t.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getBadgeStyle(t.type)}`}>
                      {getTypeName(t.type)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="text-base font-black text-white">
                      {t.type === 'IN' ? '+' : '-'}{t.quantity}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold">{unit}</div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-400 max-w-[200px] truncate md:max-w-xs" title={t.notes}>
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
