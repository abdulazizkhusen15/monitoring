import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  const { data: employees, error } = await supabaseAdmin
    .from('employees')
    .select('id, name, loans(amount), payments(amount)')
    .order('name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (employees ?? []).map((e: any) => {
    const total_loan = (e.loans ?? []).reduce((s: number, l: any) => s + Number(l.amount), 0);
    const total_paid = (e.payments ?? []).reduce((s: number, p: any) => s + Number(p.amount), 0);
    return {
      id: e.id,
      name: e.name,
      total_loan,
      total_paid,
      balance: total_loan - total_paid,
    };
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('employees')
    .insert({ name })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
