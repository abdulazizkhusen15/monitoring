'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';

const schema = z.object({
  quantity: z.number().positive('Jumlah harus lebih dari 0'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  notes: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  unit: string;
  title: string;
  maxQuantity: number;
}

export default function ModalGoodsOut({ isOpen, onClose, onSubmit, unit, title, maxQuantity }: ModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: FormData) => {
    if (data.quantity > maxQuantity) {
      alert('Stok tidak mencukupi!');
      return;
    }
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Stok Tersedia</p>
            <p className="text-xl font-black text-white">{maxQuantity} <span className="text-xs">{unit}</span></p>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Jumlah / Kuantitas ({unit})</label>
            <input
              type="number"
              step="any"
              max={maxQuantity}
              className={`w-full bg-slate-900 border ${errors.quantity ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all`}
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && <p className="text-red-400 text-[10px] mt-1 font-bold">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Tanggal Transaksi</label>
            <input
              type="date"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
              {...register('date')}
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Keterangan / Tujuan</label>
            <textarea
              placeholder="Contoh: Distribusi ke Proyek B atau Pemakaian di Sektor A"
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all resize-none text-sm"
              {...register('notes')}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all border border-white/10 mt-4"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </form>
      </div>
    </div>
  );
}
