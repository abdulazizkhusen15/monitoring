import { supabaseAdmin } from '@/lib/supabase';
import { pdfToStream, fmtRp } from '@/lib/pdf';

export const runtime = 'nodejs';

export async function GET() {
  const { data: employees } = await supabaseAdmin
    .from('employees').select('*').order('name', { ascending: true });

  const { data: allLoans } = await supabaseAdmin
    .from('loans').select('*').order('date', { ascending: true });
  const { data: allPayments } = await supabaseAdmin
    .from('payments').select('*').order('date', { ascending: true });

  const loansByEmp = new Map<number, any[]>();
  const paysByEmp = new Map<number, any[]>();
  (allLoans ?? []).forEach((l: any) => {
    const arr = loansByEmp.get(l.employee_id) ?? [];
    arr.push(l);
    loansByEmp.set(l.employee_id, arr);
  });
  (allPayments ?? []).forEach((p: any) => {
    const arr = paysByEmp.get(p.employee_id) ?? [];
    arr.push(p);
    paysByEmp.set(p.employee_id, arr);
  });

  const stream = pdfToStream((doc) => {
    doc.fontSize(20).text('LAPORAN GABUNGAN HUTANG KARYAWAN', { align: 'center' });
    doc.fontSize(10).text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, { align: 'center' });
    doc.moveDown(2);

    for (const emp of employees ?? []) {
      const loans = loansByEmp.get(emp.id) ?? [];
      const payments = paysByEmp.get(emp.id) ?? [];
      const totalL = loans.reduce((s, l: any) => s + Number(l.amount), 0);
      const totalP = payments.reduce((s, p: any) => s + Number(p.amount), 0);
      const balance = totalL - totalP;

      doc.fontSize(14).text(`NAMA: ${emp.name.toUpperCase()}`, { underline: true });
      doc.fontSize(10).text(`Total Pinjaman : ${fmtRp(totalL)}`);
      doc.text(`Total Terbayar : ${fmtRp(totalP)}`);
      doc.fillColor('red').text(`SISA HUTANG   : ${fmtRp(balance)}`).fillColor('black');

      doc.moveDown(0.5);
      doc.text('RIWAYAT PINJAMAN:');
      if (loans.length > 0) {
        loans.forEach((l: any, i: number) =>
          doc.text(`   ${i + 1}. Tanggal: ${l.date} - Jumlah: ${fmtRp(l.amount)} (${l.notes || '-'})`)
        );
      } else {
        doc.text('   (Belum ada data pinjaman)');
      }

      doc.moveDown(0.5);
      doc.text('RIWAYAT PEMBAYARAN:');
      if (payments.length > 0) {
        payments.forEach((p: any, i: number) =>
          doc.text(`   ${i + 1}. Tanggal: ${p.date} - Jumlah: ${fmtRp(p.amount)}`)
        );
      } else {
        doc.text('   (Belum ada data pembayaran)');
      }

      doc.moveDown();
      doc.text('---------------------------------------------------------------------------------------------------');
      doc.moveDown();

      if (doc.y > 600) doc.addPage();
    }

    doc.moveDown(2);
    doc.text('Disetujui oleh,', { align: 'right' });
    doc.moveDown(3);
    doc.text('____________________', { align: 'right' });
    doc.text('Pengawas', { align: 'right' });
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Laporan_Gabungan_Hutang.pdf"',
    },
  });
}
