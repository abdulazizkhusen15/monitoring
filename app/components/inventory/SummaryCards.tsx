'use client';

import { InventorySummary } from '@/app/types/inventory';
import { ArrowDownLeft, ArrowUpRight, Package, AlertTriangle } from 'lucide-react';

interface SummaryCardsProps {
  summary: InventorySummary;
  unit: string;
}

export default function SummaryCards({ summary, unit }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Stock Masuk',
      value: summary.totalIn,
      icon: ArrowDownLeft,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Keluar / Distribusi',
      value: summary.totalOut,
      icon: ArrowUpRight,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Pemakaian Aktual',
      value: summary.totalUsage,
      icon: Package,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      title: 'Sisa Stock',
      value: summary.currentStock,
      icon: summary.currentStock <= 0 ? AlertTriangle : Package,
      color: summary.currentStock <= 0 ? 'text-red-400' : 'text-green-400',
      bgColor: summary.currentStock <= 0 ? 'bg-red-500/10' : 'bg-green-500/10',
      borderColor: summary.currentStock <= 0 ? 'border-red-500/20' : 'border-green-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`glass-card-strong p-8 rounded-[40px] border ${card.borderColor} bg-white/60 transition-all hover:scale-[1.05] hover:shadow-2xl hover:shadow-slate-200/50 group`}>
          <div className="flex items-start justify-between mb-6">
            <div className={`p-4 rounded-[20px] ${card.bgColor} shadow-sm group-hover:scale-110 transition-transform`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{card.title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
