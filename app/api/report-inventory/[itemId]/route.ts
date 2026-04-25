import { supabaseAdmin } from '@/lib/supabase';
import { pdfToStream } from '@/lib/pdf';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!start || !end) {
    return new Response('Parameter tanggal diperlukan', { status: 400 });
  }

  // Fetch Item Details
  const { data: item } = await supabaseAdmin
    .from('project_items')
    .select('*, projects(name)')
    .eq('id', itemId)
    .single();

  if (!item) return new Response('Item tidak ditemukan', { status: 404 });

  // Fetch Transactions in range
  const { data: transactions } = await supabaseAdmin
    .from('inventory_transactions')
    .select('*')
    .eq('item_id', itemId)
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: true })
    .order('created_at', { ascending: true });

  const stream = pdfToStream((doc) => {
    // Header
    doc.fontSize(18).font('Helvetica-Bold').text('Riwayat Pergerakan', { align: 'center' });
    doc.fontSize(12).font('Helvetica-Bold').text(item.name.toUpperCase(), { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(`${item.projects.name} - ${item.item_code}`, { align: 'center' });
    doc.moveDown();

    // Info Periode & Cetak
    const startDateFmt = format(new Date(start), 'dd MMM yyyy', { locale: id });
    const endDateFmt = format(new Date(end), 'dd MMM yyyy', { locale: id });
    const printDate = format(new Date(), 'dd/MM/yyyy HH:mm');

    doc.fontSize(10).font('Helvetica-Bold').text(`Periode: `, { continued: true }).font('Helvetica').text(`${startDateFmt} - ${endDateFmt}`);
    doc.font('Helvetica-Bold').text(`Tanggal Cetak: `, { continued: true }).font('Helvetica').text(printDate);
    doc.moveDown();

    // Table Header
    const tableTop = doc.y;
    const col1 = 50;  // Tanggal
    const col2 = 120; // Waktu
    const col3 = 180; // Klasifikasi
    const col4 = 280; // Qty
    const col5 = 350; // Info

    doc.rect(50, tableTop, 500, 20).fill('#f1f5f9');
    doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold');
    doc.text('Tanggal', col1 + 5, tableTop + 5);
    doc.text('Waktu', col2 + 5, tableTop + 5);
    doc.text('Klasifikasi', col3 + 5, tableTop + 5);
    doc.text('Kuantitas', col4 + 5, tableTop + 5);
    doc.text('Info', col5 + 5, tableTop + 5);
    
    let currentY = tableTop + 20;

    // Table Rows
    doc.font('Helvetica').fontSize(8);
    (transactions ?? []).forEach((t: any) => {
      // Check for page break
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }

      const tDate = format(new Date(t.date), 'dd/MM/yyyy');
      const tTime = format(new Date(t.created_at), 'HH:mm');
      const typeLabel = t.type === 'IN' ? 'Barang Masuk' : t.type === 'OUT' ? 'Distribusi' : 'Pemakaian';
      const qty = `${t.type === 'IN' ? '+' : '-'}${t.quantity} ${item.unit}`;

      doc.text(tDate, col1 + 5, currentY + 5);
      doc.text(tTime, col2 + 5, currentY + 5);
      doc.text(typeLabel, col3 + 5, currentY + 5);
      doc.text(qty, col4 + 5, currentY + 5);
      doc.text(t.notes || '-', col5 + 5, currentY + 5, { width: 180 });

      // Draw horizontal line
      doc.moveTo(50, currentY + 20).lineTo(550, currentY + 20).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
      
      // Dynamic row height based on notes wrap
      const textHeight = doc.heightOfString(t.notes || '-', { width: 180 });
      currentY += Math.max(20, textHeight + 10);
    });

    if (!transactions || transactions.length === 0) {
      doc.text('Tidak ada data pergerakan pada periode ini.', 50, currentY + 10, { align: 'center', width: 500 });
    }
  });

  const filename = `Riwayat_${item.name.replace(/\s+/g, '_')}_${start}_to_${end}.pdf`;

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
