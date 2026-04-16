'use client';

import { ProjectProvider } from '@/app/context/ProjectContext';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProjectProvider>
      {children}
    </ProjectProvider>
  );
}
