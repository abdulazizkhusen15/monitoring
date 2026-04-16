'use client';

import { ProjectProvider } from '@/app/context/ProjectContext';
import { AuthProvider } from '@/app/context/AuthContext';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProjectProvider>
        {children}
      </ProjectProvider>
    </AuthProvider>
  );
}
