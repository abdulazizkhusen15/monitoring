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
}

export default function ModalGoodsIn({ isOpen, onClose, onSubmit, unit }: ModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="text-xl font-bold text-white">Input Barang Masuk</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Jumlah / Kuantitas ({unit})</label>
            <input
              type="number"
              step="any"
              className={`w-full bg-slate-900 border ${errors.quantity ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all`}
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && <p className="text-red-400 text-[10px] mt-1 font-bold">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Tanggal Masuk</label>
            <input
              type="date"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
              {...register('date')}
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Keterangan / Supplier</label>
            <textarea
              placeholder="Contoh: Pengiriman dari Gudang Pusat"
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all resize-none text-sm"
              {...register('notes')}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 mt-4"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Barang Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
