import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employeeId = Number(id);

  const { data: emp, error: empErr } = await supabaseAdmin
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single();
  if (empErr || !emp) return NextResponse.json({ error: 'Karyawan tidak ditemukan' }, { status: 404 });

  const { data: loans } = await supabaseAdmin
    .from('loans')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false });

  const { data: payments } = await supabaseAdmin
    .from('payments')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false });

  const totalL = (loans ?? []).reduce((s, l: any) => s + Number(l.amount), 0);
  const totalP = (payments ?? []).reduce((s, p: any) => s + Number(p.amount), 0);

  return NextResponse.json({
    emp,
    loans: loans ?? [],
    payments: payments ?? [],
    balance: totalL - totalP,
  });
}
