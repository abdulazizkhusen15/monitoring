'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryTransaction, ProjectItem, TransactionType } from '../types/inventory';

interface Project extends Omit<ProjectItem, 'itemId'> {
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
  items: ProjectItem[];
}

// Full Project interface update
export interface ProjectExtended {
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
  items: ProjectItem[];
  transactions: InventoryTransaction[];
}

interface ProjectContextType {
  projects: ProjectExtended[];
  addProject: (name: string) => { success: boolean; message: string; data?: any };
  toggleProjectStatus: (id: string) => void;
  addProjectItem: (projectId: string, name: string, itemCode: string, unit: string) => { success: boolean; message: string; data?: any };
  addTransaction: (transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>) => { success: boolean; message: string; data?: any };
  removeProjectItem: (projectId: string, itemId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectExtended[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pentaland_projects_v2');
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
      localStorage.setItem('pentaland_projects_v2', JSON.stringify(projects));
    }
  }, [projects, isInitialized]);

  // Logging utility
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

    const newProject: ProjectExtended = {
      id: Date.now().toString(),
      name: name.trim(),
      status: true,
      createdAt: new Date().toISOString(),
      items: [],
      transactions: []
    };

    setProjects(prev => [...prev, newProject]);
    const result = { success: true, message: 'Proyek berhasil ditambahkan', data: newProject };
    logOperation('ADD_PROJECT', result);
    return result;
  };

  const toggleProjectStatus = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  const addProjectItem = (projectId: string, name: string, itemCode: string, unit: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { success: false, message: 'Proyek tidak ditemukan' };

    // Validation: Check if itemCode already exists in ANY project and has a different unit
    const existingItemWithSameCode = projects.flatMap(p => p.items).find(i => i.itemCode === itemCode);
    if (existingItemWithSameCode && existingItemWithSameCode.unit !== unit) {
      const result = { 
        success: false, 
        message: `Peringatan: Satuan tidak boleh diubah untuk Kode Barang '${itemCode}'! Satuan yang terdaftar adalah: ${existingItemWithSameCode.unit}` 
      };
      logOperation('ADD_ITEM_VALIDATION_ERROR', result);
      return result;
    }

    if (project.items.some(item => item.name.toLowerCase() === name.trim().toLowerCase())) {
      const result = { success: false, message: 'Barang sudah ada dalam proyek ini' };
      logOperation('ADD_ITEM', result);
      return result;
    }

    const newItem: ProjectItem = {
      id: Date.now().toString(),
      project_id: projectId,
      name: name.trim(),
      itemCode: itemCode.trim(),
      unit,
      createdAt: new Date().toISOString(),
      isCompleted: false
    };

    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, items: [...p.items, newItem] } : p
    ));

    const result = { success: true, message: 'Barang berhasil ditambahkan', data: newItem };
    logOperation('ADD_ITEM', result);
    return result;
  };

  const addTransaction = (data: Omit<InventoryTransaction, 'id' | 'createdAt'>) => {
    const transaction: InventoryTransaction = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setProjects(prev => prev.map(p => 
      p.id === data.projectId ? { ...p, transactions: [...p.transactions, transaction] } : p
    ));

    const result = { success: true, message: 'Transaksi berhasil dicatat', data: transaction };
    logOperation('ADD_TRANSACTION', result);
    return result;
  };

  const removeProjectItem = (projectId: string, itemId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { 
        ...p, 
        items: p.items.filter(i => i.id !== itemId),
        transactions: p.transactions.filter(t => t.itemId !== itemId)
      } : p
    ));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      addProject,
      toggleProjectStatus,
      addProjectItem,
      addTransaction,
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
