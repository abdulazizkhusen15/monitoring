'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Cek apakah sudah login
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const adminUser = localStorage.getItem('admin_username');
    
    if (!isLoggedIn) {
      router.push('/');
    } else {
      setUsername(adminUser || 'Admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-yellow-100">
      {/* Header dengan gradasi elegan */}
      <header className="bg-gradient-to-r from-white via-yellow-100 to-yellow-200 shadow-lg border-b-2 border-yellow-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo PENTALAND */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent tracking-wider">
              PENTALAND
            </h1>
          </div>

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Bagian Kiri - Konten */}
          <div className="space-y-8">
            {/* Ucapan Selamat Datang */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-yellow-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Selamat Datang, <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">{username}</span>
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Anda telah berhasil masuk ke halaman Dashboard
                  </p>
                </div>
              </div>
              <div className="border-t border-yellow-200 pt-4 mt-4">
                <p className="text-sm text-gray-500 italic">
                  "Kelola dan pantau semua aktivitas logistic proyek Anda dengan mudah dan efisien"
                </p>
              </div>
            </div>

            {/* Menu Monitoring Logistic Proyek */}
            <div className="bg-white rounded-2xl shadow-xl border border-yellow-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Monitoring Logistic Proyek
                  </h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Akses dan pantau semua data logistic proyek secara real-time
                </p>
                
                <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Masuk ke Dashboard Logistic
                </button>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">0</div>
                    <div className="text-xs text-gray-600 mt-1">Proyek Aktif</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">0</div>
                    <div className="text-xs text-gray-600 mt-1">Total Pengiriman</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">0</div>
                    <div className="text-xs text-gray-600 mt-1">Material</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Kanan - Ilustrasi Vektor Bangunan */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* SVG Ilustrasi Bangunan */}
              <svg viewBox="0 0 500 500" className="w-full h-auto drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background circle */}
                <circle cx="250" cy="250" r="230" fill="url(#gradient-bg)" opacity="0.1" />
                
                {/* Gedung utama */}
                <rect x="150" y="120" width="200" height="300" fill="#374151" rx="4" />
                <rect x="150" y="120" width="200" height="15" fill="#4B5563" />
                
                {/* Atap */}
                <polygon points="140,120 250,60 360,120" fill="#1F2937" />
                <polygon points="140,120 250,60 360,120" fill="url(#roof-gradient)" opacity="0.3" />
                
                {/* Jendela-jendela */}
                {/* Gedung utama - baris 1 */}
                <rect x="170" y="150" width="35" height="45" fill="#FCD34D" rx="2" />
                <rect x="232" y="150" width="35" height="45" fill="#FCD34D" rx="2" />
                <rect x="295" y="150" width="35" height="45" fill="#FCD34D" rx="2" />
                
                {/* Gedung utama - baris 2 */}
                <rect x="170" y="210" width="35" height="45" fill="#FCD34D" rx="2" />
                <rect x="232" y="210" width="35" height="45" fill="#FDE68A" rx="2" />
                <rect x="295" y="210" width="35" height="45" fill="#FCD34D" rx="2" />
                
                {/* Gedung utama - baris 3 */}
                <rect x="170" y="270" width="35" height="45" fill="#FDE68A" rx="2" />
                <rect x="232" y="270" width="35" height="45" fill="#FCD34D" rx="2" />
                <rect x="295" y="270" width="35" height="45" fill="#FCD34D" rx="2" />
                
                {/* Gedung utama - baris 4 */}
                <rect x="170" y="330" width="35" height="45" fill="#FCD34D" rx="2" />
                <rect x="232" y="330" width="35" height="45" fill="#FCD34D" rx="2" />
                <rect x="295" y="330" width="35" height="45" fill="#FDE68A" rx="2" />
                
                {/* Pintu masuk */}
                <rect x="225" y="390" width="50" height="30" fill="#1F2937" rx="2" />
                <rect x="225" y="390" width="50" height="5" fill="#4B5563" />
                
                {/* Gedung samping kiri */}
                <rect x="90" y="220" width="60" height="200" fill="#4B5563" rx="4" />
                <rect x="90" y="220" width="60" height="12" fill="#6B7280" />
                <polygon points="85,220 120,190 155,220" fill="#374151" />
                
                {/* Jendela gedung kiri */}
                <rect x="100" y="245" width="18" height="25" fill="#FCD34D" rx="1" />
                <rect x="122" y="245" width="18" height="25" fill="#FDE68A" rx="1" />
                <rect x="100" y="285" width="18" height="25" fill="#FDE68A" rx="1" />
                <rect x="122" y="285" width="18" height="25" fill="#FCD34D" rx="1" />
                <rect x="100" y="325" width="18" height="25" fill="#FCD34D" rx="1" />
                <rect x="122" y="325" width="18" height="25" fill="#FDE68A" rx="1" />
                
                {/* Gedung samping kanan */}
                <rect x="350" y="180" width="60" height="240" fill="#4B5563" rx="4" />
                <rect x="350" y="180" width="60" height="12" fill="#6B7280" />
                <polygon points="345,180 380,150 415,180" fill="#374151" />
                
                {/* Jendela gedung kanan */}
                <rect x="360" y="205" width="18" height="25" fill="#FCD34D" rx="1" />
                <rect x="382" y="205" width="18" height="25" fill="#FCD34D" rx="1" />
                <rect x="360" y="245" width="18" height="25" fill="#FDE68A" rx="1" />
                <rect x="382" y="245" width="18" height="25" fill="#FCD34D" rx="1" />
                <rect x="360" y="285" width="18" height="25" fill="#FCD34D" rx="1" />
                <rect x="382" y="285" width="18" height="25" fill="#FDE68A" rx="1" />
                <rect x="360" y="325" width="18" height="25" fill="#FDE68A" rx="1" />
                <rect x="382" y="325" width="18" height="25" fill="#FCD34D" rx="1" />
                
                {/* Detail tambahan */}
                <rect x="150" y="410" width="200" height="10" fill="#1F2937" />
                <rect x="90" y="410" width="60" height="10" fill="#374151" />
                <rect x="350" y="410" width="60" height="10" fill="#374151" />
                
                {/* Pohon */}
                <circle cx="75" cy="395" r="15" fill="#059669" opacity="0.8" />
                <rect x="73" y="395" width="4" height="25" fill="#78350F" />
                
                <circle cx="425" cy="385" r="18" fill="#059669" opacity="0.8" />
                <rect x="423" y="385" width="4" height="30" fill="#78350F" />
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="gradient-bg" x1="0" y1="0" x2="500" y2="500">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                  <linearGradient id="roof-gradient" x1="140" y1="60" x2="360" y2="120">
                    <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Shadow effect */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-gray-800 rounded-full opacity-20 blur-lg"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-white via-yellow-50 to-yellow-100 border-t border-yellow-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-gray-600 text-sm">
            &copy; 2026 <span className="font-semibold text-yellow-600">PENTALAND</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
