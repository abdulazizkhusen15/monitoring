import type { Metadata } from 'next';
import './globals.css';
import ClientWrapper from './components/ClientWrapper';

export const metadata: Metadata = {
  title: 'PENTALAND - Sistem Monitoring Proyek',
  description: 'PENTALAND - Platform monitoring proyek yang modern dan efisien',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
