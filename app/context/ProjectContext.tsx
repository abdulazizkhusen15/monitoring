'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryTransaction, ProjectItem } from '../types/inventory';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

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
  loading: boolean;
  addProject: (name: string) => Promise<{ success: boolean; message: string; data?: any }>;
  toggleProjectStatus: (id: string, currentStatus: boolean) => Promise<void>;
  addProjectItem: (projectId: string, name: string, itemCode: string, unit: string) => Promise<{ success: boolean; message: string; data?: any }>;
  addTransaction: (transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>) => Promise<{ success: boolean; message: string; data?: any }>;
  removeProjectItem: (projectId: string, itemId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectExtended[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from Supabase
  const fetchData = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch projects
      const { data: dbProjects, error: pError } = await supabase
        .from('projects')
        .select(`
          *,
          items:project_items(*),
          transactions:inventory_transactions(*)
        `)
        .order('created_at', { ascending: false });

      if (pError) throw pError;

      // Map to ProjectExtended interface
      const mapped: ProjectExtended[] = (dbProjects || []).map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        createdAt: p.created_at,
        items: (p.items || []).map((i: any) => ({
          id: i.id,
          project_id: i.project_id,
          name: i.name,
          itemCode: i.item_code,
          unit: i.unit,
          isCompleted: i.is_completed,
          createdAt: i.created_at
        })),
        transactions: (p.transactions || []).map((t: any) => ({
          id: t.id,
          projectId: t.project_id,
          itemId: t.item_id,
          type: t.type,
          quantity: t.quantity,
          date: t.date,
          notes: t.notes,
          createdAt: t.created_at
        }))
      }));

      setProjects(mapped);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Auto-Migration from localStorage
  const handleMigration = async () => {
    if (!user) return;
    
    const saved = localStorage.getItem('pentaland_projects_v2');
    if (!saved) return;

    try {
      const localProjects: ProjectExtended[] = JSON.parse(saved);
      if (localProjects.length === 0) return;

      console.log('Migrating local data to cloud...');
      
      for (const lp of localProjects) {
        // Insert Project
        const { data: newProj, error: pErr } = await supabase
          .from('projects')
          .insert({ name: lp.name, status: lp.status, user_id: user.id })
          .select()
          .single();

        if (pErr) continue;

        // Insert Items
        if (lp.items.length > 0) {
          const itemsToInsert = lp.items.map(i => ({
            project_id: newProj.id,
            user_id: user.id,
            name: i.name,
            item_code: i.itemCode,
            unit: i.unit,
            is_completed: i.isCompleted
          }));
          
          const { data: newItems, error: iErr } = await supabase
            .from('project_items')
            .insert(itemsToInsert)
            .select();

          if (iErr) continue;

          // Insert Transactions
          if (lp.transactions.length > 0) {
             const transactionsToInsert = lp.transactions.map(t => {
                // Find matching new item ID by item_code
                const oldItem = lp.items.find(i => i.id === t.itemId);
                const matchedItem = newItems.find(ni => ni.item_code === oldItem?.itemCode);
                return {
                  project_id: newProj.id,
                  item_id: matchedItem?.id,
                  user_id: user.id,
                  type: t.type,
                  quantity: t.quantity,
                  date: t.date,
                  notes: t.notes
                };
             }).filter(t => t.item_id);

             await supabase.from('inventory_transactions').insert(transactionsToInsert);
          }
        }
      }

      // Clear local storage after successful migration
      localStorage.removeItem('pentaland_projects_v2');
      fetchData();
    } catch (e) {
      console.error('Migration failed:', e);
    }
  };

  useEffect(() => {
    if (user) {
      handleMigration().then(() => fetchData());
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  const addProject = async (name: string) => {
    if (!user) return { success: false, message: 'Harus login' };

    const { data, error } = await supabase
      .from('projects')
      .insert({ name: name.trim(), user_id: user.id })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.code === '23505' ? 'Nama proyek sudah ada' : error.message };
    }

    const newProject: ProjectExtended = {
      id: data.id,
      name: data.name,
      status: data.status,
      createdAt: data.created_at,
      items: [],
      transactions: []
    };

    setProjects(prev => [newProject, ...prev]);
    return { success: true, message: 'Proyek berhasil ditambahkan', data: newProject };
  };

  const toggleProjectStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('projects')
      .update({ status: !currentStatus })
      .eq('id', id);

    if (!error) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status: !currentStatus } : p));
    }
  };

  const addProjectItem = async (projectId: string, name: string, itemCode: string, unit: string) => {
    if (!user) return { success: false, message: 'Harus login' };

    const { data, error } = await supabase
      .from('project_items')
      .insert({
        project_id: projectId,
        user_id: user.id,
        name: name.trim(),
        item_code: itemCode.trim(),
        unit
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    const newItem: ProjectItem = {
      id: data.id,
      project_id: projectId,
      name: data.name,
      itemCode: data.item_code,
      unit: data.unit,
      createdAt: data.created_at,
      isCompleted: data.is_completed
    };

    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, items: [...p.items, newItem] } : p
    ));

    return { success: true, message: 'Barang berhasil ditambahkan', data: newItem };
  };

  const addTransaction = async (data: Omit<InventoryTransaction, 'id' | 'createdAt'>) => {
    if (!user) return { success: false, message: 'Harus login' };

    const { data: dbData, error } = await supabase
      .from('inventory_transactions')
      .insert({
        project_id: data.projectId,
        item_id: data.itemId,
        user_id: user.id,
        type: data.type,
        quantity: data.quantity,
        date: data.date,
        notes: data.notes
      })
      .select()
      .single();

    if (error) return { success: false, message: error.message };

    const transaction: InventoryTransaction = {
      ...data,
      id: dbData.id,
      createdAt: dbData.created_at
    };

    setProjects(prev => prev.map(p => 
      p.id === data.projectId ? { ...p, transactions: [...p.transactions, transaction] } : p
    ));

    return { success: true, message: 'Transaksi berhasil dicatat', data: transaction };
  };

  const removeProjectItem = async (projectId: string, itemId: string) => {
    const { error } = await supabase
      .from('project_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { 
          ...p, 
          items: p.items.filter(i => i.id !== itemId),
          transactions: p.transactions.filter(t => t.itemId !== itemId)
        } : p
      ));
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
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
