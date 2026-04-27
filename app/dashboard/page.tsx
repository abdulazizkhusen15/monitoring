'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useState, useEffect } from 'react';
import { UserPlus, Trash2, ShieldCheck, Users, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { loading, addLogisticUser, deleteLogisticUser, getLogisticUsers } = useProject();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [logisticUsers, setLogisticUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: '', pin: '', role: 'logistic' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const alias = localStorage.getItem('pentaland_user_alias');
    setIsAdmin(alias === 'admin');
    if (alias === 'admin') {
      loadLogisticUsers();
    }
  }, []);

  const loadLogisticUsers = async () => {
    const users = await getLogisticUsers();
    setLogisticUsers(users);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.pin) return;
    
    setActionLoading(true);
    const res = await addLogisticUser(newUser.username, newUser.pin, newUser.role);
    if (res.success) {
      setNewUser({ username: '', pin: '', role: 'logistic' });
      await loadLogisticUsers();
    } else {
      alert(res.message);
    }
    setActionLoading(false);
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (confirm(`Hapus akses untuk ${username}?`)) {
      const res = await deleteLogisticUser(id);
      if (res.success) {
        await loadLogisticUsers();
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const displayUsername = localStorage.getItem('pentaland_user_alias') || 'User';

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-amber-200 bg-[#FFFBEB]">
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

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-yellow-500/20 backdrop-blur-xl bg-white/60 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <span className="text-white font-black text-xl">P</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">PENTALAND</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border border-yellow-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all rounded-xl text-slate-700 bg-white/80 shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-20">
        {/* Welcome Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-yellow-400/20 border border-yellow-500/30 text-[10px] text-amber-700 tracking-[0.2em] font-black uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              {isAdmin ? 'System Administrator' : 'Operator Logistik'}
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900 uppercase">
              Welcome, <br/>
              <span className="text-gold-gradient drop-shadow-sm">{displayUsername}</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed font-bold opacity-80 uppercase tracking-tight">
              Akses panel kendali proyek Pentaland. Pantau stok, distribusi, dan aktivitas logistik secara real-time.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <button 
                onClick={() => router.push('/projects')}
                className="btn-modern px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-black shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px] md:text-xs"
              >
                Monitoring Proyek
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="glass-card-strong rounded-[32px] md:rounded-[48px] p-6 md:p-10 border-yellow-400/30 shadow-2xl bg-gradient-to-br from-white/90 to-yellow-50/50">
               <ShieldCheck className="w-12 h-12 md:w-20 md:h-20 text-yellow-500 mb-8 opacity-20" />
               <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Ringkasan Sistem</h3>
               <p className="text-sm text-slate-500 font-bold uppercase tracking-widest leading-loose">
                 Semua data tersinkronisasi dengan server cloud Pentaland. Pastikan setiap input barang keluar & masuk dicatat dengan teliti.
               </p>
            </div>
            <div className="absolute -inset-4 bg-yellow-500/10 blur-3xl -z-10 rounded-[60px]"></div>
          </div>
        </div>

        {/* Admin Only: Team Management */}
        {isAdmin && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="w-14 h-14 rounded-2xl md:rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">Kelola Tim Logistic</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hanya Admin yang dapat menambah & menghapus akses</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Form Add User */}
              <div className="lg:col-span-1">
                <div className="glass-card-strong p-8 rounded-[40px] border-slate-100 bg-white shadow-xl space-y-8">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-blue-500" />
                    Tambah Akun Baru
                  </h4>
                  <form onSubmit={handleAddUser} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Username</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: staff_logistic"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
                        value={newUser.username}
                        onChange={e => setNewUser({...newUser, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">PIN Keamanan</label>
                      <input 
                        type="password" 
                        placeholder="••••••"
                        maxLength={6}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-center tracking-[0.5em]"
                        value={newUser.pin}
                        onChange={e => setNewUser({...newUser, pin: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Role Akses</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black uppercase text-[10px] tracking-widest"
                        value={newUser.role}
                        onChange={e => setNewUser({...newUser, role: e.target.value})}
                      >
                        <option value="logistic">Logistic</option>
                        <option value="pengawas">Pengawas</option>
                      </select>
                    </div>
                    <button 
                      disabled={actionLoading}
                      className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {actionLoading ? 'Memproses...' : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Daftarkan Akses
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* List Users */}
              <div className="lg:col-span-2">
                <div className="glass-card-strong p-8 rounded-[40px] border-slate-100 bg-white/60 shadow-xl overflow-hidden min-h-[400px]">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    Daftar Akses Terdaftar
                  </h4>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {logisticUsers.length === 0 ? (
                      <div className="col-span-full py-20 text-center opacity-40">
                        <p className="text-[10px] font-black uppercase tracking-widest">Belum ada akun logistic tambahan</p>
                      </div>
                    ) : (
                      logisticUsers.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-6 rounded-[32px] border border-slate-100 bg-white/80 group hover:border-red-200 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                              <span className="text-[10px] font-black uppercase">{u.username[0]}</span>
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{u.username}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Role: {u.role || 'Logistic'}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 py-10 text-center opacity-40">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">&copy; 2026 Pentaland Monitoring. Precision Control.</p>
      </footer>
    </div>
  );
}
