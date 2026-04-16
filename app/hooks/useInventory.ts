'use client';

import { useProject } from '../context/ProjectContext';
import { InventorySummary, InventoryTransaction, ProjectItem } from '../types/inventory';
import { useMemo } from 'react';

export function useInventory(projectId: string, itemId: string) {
  const { projects, addTransaction } = useProject();

  const project = useMemo(() => projects.find(p => p.id === projectId), [projects, projectId]);
  const item = useMemo(() => project?.items.find(i => i.id === itemId), [project, itemId]);
  
  const transactions = useMemo(() => {
    return project?.transactions.filter(t => t.itemId === itemId) || [];
  }, [project, itemId]);

  const summary = useMemo((): InventorySummary => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'IN') acc.totalIn += t.quantity;
      if (t.type === 'OUT') acc.totalOut += t.quantity;
      if (t.type === 'USAGE') acc.totalUsage += t.quantity;
      
      acc.currentStock = acc.totalIn - acc.totalOut - acc.totalUsage;
      return acc;
    }, { totalIn: 0, totalOut: 0, totalUsage: 0, currentStock: 0 });
  }, [transactions]);

  const addGoodsIn = (data: { quantity: number; notes?: string; date: string }) => {
    return addTransaction({
      projectId,
      itemId,
      type: 'IN',
      ...data
    });
  };

  const addGoodsOut = (data: { quantity: number; notes?: string; date: string }) => {
    if (data.quantity > summary.currentStock) {
      return { success: false, message: 'Stok tidak mencukupi!' };
    }
    return addTransaction({
      projectId,
      itemId,
      type: 'OUT',
      ...data
    });
  };

  const addUsage = (data: { quantity: number; notes?: string; date: string }) => {
    if (data.quantity > summary.currentStock) {
      return { success: false, message: 'Stok tidak mencukupi!' };
    }
    return addTransaction({
      projectId,
      itemId,
      type: 'USAGE',
      ...data
    });
  };

  const isCritical = summary.currentStock <= 0;

  return {
    project,
    item,
    transactions,
    summary,
    addGoodsIn,
    addGoodsOut,
    addUsage,
    isCritical
  };
}
