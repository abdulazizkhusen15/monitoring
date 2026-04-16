'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ProjectItem {
  id: string;
  name: string;
  quantity: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
  items: ProjectItem[];
}

interface ProjectContextType {
  projects: Project[];
  addProject: (name: string) => { success: boolean; message: string; data?: any };
  toggleProjectStatus: (id: string) => void;
  addProjectItem: (projectId: string, name: string, quantity: string) => { success: boolean; message: string; data?: any };
  toggleItemStatus: (projectId: string, itemId: string) => void;
  removeProjectItem: (projectId: string, itemId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pentaland_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved projects', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pentaland_projects', JSON.stringify(projects));
    }
  }, [projects, isInitialized]);

  // Logging utility as requested
  const logOperation = (action: string, result: any) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      action,
      ...result
    }, null, 2));
  };

  const addProject = (name: string) => {
    if (name.trim().length < 3) {
      const result = { success: false, message: 'Nama proyek minimal 3 karakter' };
      logOperation('ADD_PROJECT', result);
      return result;
    }

    if (projects.some(p => p.name.toLowerCase() === name.trim().toLowerCase())) {
      const result = { success: false, message: 'Nama proyek sudah ada' };
      logOperation('ADD_PROJECT', result);
      return result;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: name.trim(),
      status: true,
      createdAt: new Date().toISOString(),
      items: []
    };

    setProjects(prev => [...prev, newProject]);
    const result = { success: true, message: 'Proyek berhasil ditambahkan', data: newProject };
    logOperation('ADD_PROJECT', result);
    return result;
  };

  const toggleProjectStatus = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  const addProjectItem = (projectId: string, name: string, quantity: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { success: false, message: 'Proyek tidak ditemukan' };

    if (project.items.some(item => item.name.toLowerCase() === name.trim().toLowerCase())) {
      const result = { success: false, message: 'Barang sudah ada dalam proyek ini' };
      logOperation('ADD_ITEM', result);
      return result;
    }

    const newItem: ProjectItem = {
      id: Date.now().toString(),
      name: name.trim(),
      quantity,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };

    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, items: [...p.items, newItem] } : p
    ));

    const result = { success: true, message: 'Barang berhasil ditambahkan', data: newItem };
    logOperation('ADD_ITEM', result);
    return result;
  };

  const toggleItemStatus = (projectId: string, itemId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, items: p.items.map(i => i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i) } 
        : p
    ));
  };

  const removeProjectItem = (projectId: string, itemId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, items: p.items.filter(i => i.id !== itemId) } : p
    ));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      addProject,
      toggleProjectStatus,
      addProjectItem,
      toggleItemStatus,
      removeProjectItem
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
