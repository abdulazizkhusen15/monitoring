import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

export type Employee = { id: number; name: string };
export type Loan = { id: number; employee_id: number; amount: number; date: string; notes: string | null };
export type Payment = { id: number; employee_id: number; amount: number; date: string };
