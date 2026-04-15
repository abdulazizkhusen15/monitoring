import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { employee_id, amount, date } = await req.json();
  const { error } = await supabaseAdmin.from('payments').insert({
    employee_id: Number(employee_id),
    amount: Number(amount),
    date,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
