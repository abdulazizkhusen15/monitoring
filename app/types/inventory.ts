export type TransactionType = 'IN' | 'OUT' | 'USAGE';

export interface InventoryTransaction {
  id: string;
  projectId: string;
  itemId: string;
  type: TransactionType;
  quantity: number;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  project_id: string;
  name: string;
  itemCode: string;
  unit: string;
  createdAt: string;
  isCompleted: boolean;
  quantityLimit?: number;
  notes?: string;
}

export const VALID_UNITS = [
  'zak', 'kg', 'pcs', 'unit', 'roll', 'gln', 'set', 'm3', 'mtr', 'btg'
] as const;

export type Unit = (typeof VALID_UNITS)[number];

export interface InventorySummary {
  totalIn: number;
  totalOut: number;
  totalUsage: number;
  currentStock: number;
}
