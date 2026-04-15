import PDFDocument from 'pdfkit';

export function pdfToStream(build: (doc: PDFKit.PDFDocument) => void): ReadableStream<Uint8Array> {
  const doc = new PDFDocument({ margin: 50 });
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      doc.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
      doc.on('end', () => controller.close());
      doc.on('error', (err) => controller.error(err));
      try {
        build(doc);
        doc.end();
      } catch (err) {
        controller.error(err);
      }
    },
  });
  return stream;
}

export const fmtRp = (n: number) => `Rp ${Number(n).toLocaleString('id-ID')}`;
