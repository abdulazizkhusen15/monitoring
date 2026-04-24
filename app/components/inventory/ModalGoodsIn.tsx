'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Plus, AlertCircle } from 'lucide-react';

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
  quantityLimit?: number;
}

export default function ModalGoodsIn({ isOpen, onClose, onSubmit, unit, quantityLimit }: ModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  const quantity = watch('quantity');
  const isOverLimit = quantityLimit && quantity > quantityLimit;

  if (!isOpen) return null;

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-xl glass-card-strong rounded-[32px] md:rounded-[48px] overflow-hidden border-white shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">Tambah Stok</h3>
            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Plus className="w-4 h-4" /> Masukkan Data Barang Masuk
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 md:p-10 space-y-6 md:space-y-8 bg-white/90">
          {isOverLimit && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-4 animate-bounce">
              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-wider">Peringatan: Melebihi Batasan!</p>
                <p className="text-[11px] text-red-500 font-bold uppercase mt-0.5">Kuantitas input ({quantity} {unit}) melebihi batasan yang ditetapkan ({quantityLimit} {unit}).</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tanggal</label>
              <input
                type="date"
                {...register('date')}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold"
              />
              {errors.date && <p className="text-[10px] text-red-500 font-black uppercase ml-1">{errors.date.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kuantitas ({unit})</label>
              <input
                type="number"
                step="0.01"
                {...register('quantity', { valueAsNumber: true })}
                className={`w-full bg-slate-50 border rounded-xl md:rounded-2xl px-6 py-4 outline-none transition-all text-slate-900 font-bold focus:ring-4 ${isOverLimit ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-100 focus:ring-yellow-500/10 focus:border-yellow-500'}`}
              />
              {errors.quantity && <p className="text-[10px] text-red-500 font-black uppercase ml-1">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Catatan / Keterangan</label>
            <textarea
              {...register('notes')}
              placeholder="Contoh: Pengiriman dari Supplier Utama..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-6 py-4 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all text-slate-900 font-bold resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 py-4 md:py-5 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isOverLimit}
              className={`order-1 sm:order-2 flex-[2] px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl shadow-xl active:scale-95 transition-transform font-black uppercase tracking-widest text-[10px] md:text-xs ${isOverLimit ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'btn-modern bg-yellow-500 text-white shadow-yellow-500/20'}`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
