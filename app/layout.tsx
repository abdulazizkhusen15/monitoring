import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PENTALAND - Sistem Manajemen Karyawan',
  description: 'PENTALAND - Platform manajemen karyawan yang modern dan efisien',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
