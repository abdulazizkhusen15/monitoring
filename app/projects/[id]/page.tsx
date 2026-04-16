'use client';

import { useProject } from '@/app/context/ProjectContext';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { projects, addProjectItem, toggleItemStatus, removeProjectItem, toggleProjectStatus } = useProject();
  
  const project = projects.find(p => p.id === id);
  
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [error, setError] = useState('');

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center text-white p-6 text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Proyek Tidak Ditemukan</h1>
          <button onClick={() => router.push('/projects')} className="text-amber-500 hover:underline">Kembali ke Daftar Proyek</button>
        </div>
      </div>
    );
  }

  const handleAddItem = () => {
    if (!itemName || !itemQty) {
      setError('Nama dan jumlah barang wajib diisi');
      return;
    }
    const result = addProjectItem(project.id, itemName, itemQty);
    if (result.success) {
      setItemName('');
      setItemQty('');
      setError('');
    } else {
      setError(result.message);
    }
  };

  const completedItems = project.items.filter(i => i.isCompleted).length;
  const totalItems = project.items.length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-slate-100 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
      
      <header className="relative z-20 border-b border-white/5 backdrop-blur-md bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Kembali
          </Link>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${project.status ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {project.status ? 'Project Active' : 'Project Inactive'}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2">
              <h2 className="text-5xl font-black tracking-tighter text-white">{project.name}</h2>
              <p className="text-slate-500">Dibuat pada {new Date(project.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="glass-card-strong p-6 rounded-3xl border border-white/5">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Kebutuhan</p>
                <p className="text-3xl font-black">{totalItems}</p>
              </div>
              <div className="glass-card-strong p-6 rounded-3xl border border-white/5">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Terpenuhi</p>
                <p className="text-3xl font-black text-green-400">{completedItems}</p>
              </div>
              <div className="glass-card-strong p-6 rounded-3xl border border-white/5 col-span-2 md:col-span-1">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Progres</p>
                <p className="text-3xl font-black text-amber-500">{progressPercent}%</p>
              </div>
            </div>

            {/* Items List */}
            <div className="glass-card-strong rounded-3xl p-8 border border-white/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Daftar Kebutuhan Barang
                <span className="text-xs font-normal text-slate-500 ml-auto">{totalItems} Item</span>
              </h3>
              
              <div className="space-y-3">
                {project.items.length === 0 ? (
                  <div className="py-12 text-center text-slate-600 italic">Belum ada barang kebutuhan yang dicatat.</div>
                ) : (
                  project.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-2xl border border-white/5 group hover:border-amber-500/30 transition-all">
                      <button 
                        onClick={() => toggleItemStatus(project.id, item.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${item.isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-700 hover:border-amber-500'}`}
                        aria-label="Toggle status item"
                      >
                        {item.isCompleted && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                      </button>
                      <div className="flex-1">
                        <p className={`font-semibold ${item.isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>{item.name}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{item.quantity}</p>
                      </div>
                      <button 
                        onClick={() => removeProjectItem(project.id, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-400 transition-all"
                        aria-label="Hapus item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area: Form */}
          <div className="space-y-6">
            <div className="glass-card-strong rounded-3xl p-8 border border-white/5 sticky top-24">
              <h3 className="text-lg font-bold mb-6">Tambah Barang Baru</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Nama Barang</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Semen Tiga Roda" 
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Jumlah / Kuantitas</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 100 Sak" 
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all"
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-400 text-xs italic">{error}</p>}
                <button 
                  onClick={handleAddItem}
                  className="w-full btn-modern py-4 rounded-xl font-bold text-white uppercase tracking-widest text-xs mt-4"
                >
                  Simpan Barang
                </button>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-amber-500/10 bg-amber-500/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2">Pentaland Quick Action</h4>
              <p className="text-sm text-slate-400 mb-6">Ubah status proyek secara instan untuk memperbarui visibilitas di dasbor utama.</p>
              <button 
                onClick={() => toggleProjectStatus(project.id)}
                className={`w-full py-3 rounded-xl font-bold border transition-all ${project.status ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' : 'border-green-500/30 text-green-500 hover:bg-green-500/10'}`}
              >
                {project.status ? 'Set Inactive' : 'Set Active'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
