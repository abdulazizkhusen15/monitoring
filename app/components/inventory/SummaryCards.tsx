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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className={`glass-card-strong p-6 rounded-3xl border ${card.borderColor} transition-all hover:scale-[1.02]`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-xl ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{card.value}</span>
            <span className="text-xs font-bold text-slate-500 uppercase">{unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
