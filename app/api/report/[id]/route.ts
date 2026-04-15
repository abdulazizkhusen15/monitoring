import { supabaseAdmin } from '@/lib/supabase';
import { pdfToStream, fmtRp } from '@/lib/pdf';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employeeId = Number(id);

  const { data: emp } = await supabaseAdmin.from('employees').select('*').eq('id', employeeId).single();
  if (!emp) return new Response('Karyawan tidak ditemukan', { status: 404 });

  const { data: loans } = await supabaseAdmin
    .from('loans').select('*').eq('employee_id', employeeId).order('date', { ascending: true });
  const { data: payments } = await supabaseAdmin
    .from('payments').select('*').eq('employee_id', employeeId).order('date', { ascending: true });

  const totalL = (loans ?? []).reduce((s, l: any) => s + Number(l.amount), 0);
  const totalP = (payments ?? []).reduce((s, p: any) => s + Number(p.amount), 0);
  const balance = totalL - totalP;

  const stream = pdfToStream((doc) => {
    doc.fontSize(20).text(`LAPORAN HUTANG: ${emp.name.toUpperCase()}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Total Pinjaman : ${fmtRp(totalL)}`);
    doc.text(`Total Terbayar : ${fmtRp(totalP)}`);
    doc.fillColor('red').text(`SISA HUTANG    : ${fmtRp(balance)}`).fillColor('black');

    doc.moveDown();
    doc.text('DETAIL TRANSAKSI:', { underline: true });

    doc.moveDown(0.5);
    doc.text('PINJAMAN:');
    (loans ?? []).forEach((l: any, i: number) =>
      doc.text(`  ${i + 1}. ${l.date} - ${fmtRp(l.amount)} (${l.notes || '-'})`)
    );

    doc.moveDown();
    doc.text('PEMBAYARAN:');
    (payments ?? []).forEach((p: any, i: number) =>
      doc.text(`  ${i + 1}. ${p.date} - ${fmtRp(p.amount)}`)
    );

    doc.moveDown(3);
    doc.text('Disetujui oleh,', { align: 'right' });
    doc.moveDown(3);
    doc.text('____________________', { align: 'right' });
    doc.text('Pengawas', { align: 'right' });
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Laporan_${emp.name}.pdf"`,
    },
  });
}
