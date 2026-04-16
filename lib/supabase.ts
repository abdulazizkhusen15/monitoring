import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for the browser/authenticated users with SSR cookie support
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

// Admin client for backend API routes (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, serviceKey || supabaseAnonKey, {
  auth: { persistSession: false },
});

export type Employee = { id: number; name: string };
export type Loan = { id: number; employee_id: number; amount: number; date: string; notes: string | null };
export type Payment = { id: number; employee_id: number; amount: number; date: string };
