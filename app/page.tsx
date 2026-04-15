'use client';

import { useEffect, useState } from 'react';

type EmployeeRow = {
  id: number;
  name: string;
  total_loan: number;
  total_paid: number;
  balance: number;
};

type Details = {
  emp: { id: number; name: string };
  loans: { id: number; date: string; amount: number; notes: string | null }[];
  payments: { id: number; date: string; amount: number }[];
  balance: number;
};

const rp = (n: number) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export default function Home() {
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const [trans, setTrans] = useState<{ id: number; type: 'loan' | 'payment' } | null>(null);
  const [transAmount, setTransAmount] = useState('');
  const [transDate, setTransDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [transNotes, setTransNotes] = useState('');

  const [preview, setPreview] = useState<{ name: string; data: Details } | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/employees', { cache: 'no-store' });
    setEmployees(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addEmp = async () => {
    if (!newName.trim()) return;
    await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });
    setNewName('');
    setShowAdd(false);
    load();
  };

  const deleteEmp = async (id: number, name: string) => {
    if (!confirm(`Hapus karyawan "${name}" dan semua data hutangnya?`)) return;
    const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    if (res.ok) load();
    else alert('Gagal menghapus.');
  };

  const openTrans = (id: number, type: 'loan' | 'payment') => {
    setTrans({ id, type });
    setTransAmount('');
    setTransNotes('');
    setTransDate(new Date().toISOString().slice(0, 10));
  };

  const saveTrans = async () => {
    if (!trans) return;
    const url = trans.type === 'loan' ? '/api/loans' : '/api/payments';
    const body: any = { employee_id: trans.id, amount: transAmount, date: transDate };
    if (trans.type === 'loan') body.notes = transNotes;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setTrans(null);
    load();
  };

  const previewEmp = async (id: number, name: string) => {
    const res = await fetch(`/api/employee-details/${id}`);
    const data: Details = await res.json();
    setPreview({ name, data });
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pencatatan Hutang Karyawan</h1>
        <div className="flex gap-2">
          <a href="/api/report-all" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
            Download Laporan Gabungan
          </a>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
            Tambah Karyawan
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-2">Nama</th>
              <th className="py-2 px-2">Total Pinjaman</th>
              <th className="py-2 px-2">Total Bayar</th>
              <th className="py-2 px-2">Sisa</th>
              <th className="py-2 px-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="py-6 text-center text-gray-500">Memuat...</td></tr>}
            {!loading && employees.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-gray-500">Belum ada karyawan</td></tr>
            )}
            {employees.map((e) => (
              <tr key={e.id} className="border-b">
                <td className="py-2 px-2">{e.name}</td>
                <td className="py-2 px-2">{rp(e.total_loan)}</td>
                <td className="py-2 px-2">{rp(e.total_paid)}</td>
                <td className="py-2 px-2 text-red-600 font-medium">{rp(e.balance)}</td>
                <td className="py-2 px-2 flex flex-wrap gap-1">
                  <button onClick={() => previewEmp(e.id, e.name)} className="px-2 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-xs">Preview</button>
                  <button onClick={() => openTrans(e.id, 'loan')} className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs">+ Pinjam</button>
                  <button onClick={() => openTrans(e.id, 'payment')} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs">+ Bayar</button>
                  <a href={`/api/report/${e.id}`} className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs">PDF</a>
                  <button onClick={() => deleteEmp(e.id, e.name)} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Tambah Karyawan" onClose={() => setShowAdd(false)}>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama Karyawan"
            className="w-full border rounded px-3 py-2"
          />
          <div className="mt-4 flex justify-end">
            <button onClick={addEmp} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
          </div>
        </Modal>
      )}

      {trans && (
        <Modal
          title={trans.type === 'loan' ? 'Tambah Pinjaman' : 'Bayar Hutang'}
          onClose={() => setTrans(null)}
        >
          <input
            type="number"
            value={transAmount}
            onChange={(e) => setTransAmount(e.target.value)}
            placeholder="Jumlah (Rp)"
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <input
            type="date"
            value={transDate}
            onChange={(e) => setTransDate(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          {trans.type === 'loan' && (
            <input
              value={transNotes}
              onChange={(e) => setTransNotes(e.target.value)}
              placeholder="Catatan (opsional)"
              className="w-full border rounded px-3 py-2"
            />
          )}
          <div className="mt-4 flex justify-end">
            <button onClick={saveTrans} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
          </div>
        </Modal>
      )}

      {preview && (
        <Modal title={`Riwayat: ${preview.name}`} onClose={() => setPreview(null)} wide>
          <h5 className="text-lg">
            Sisa Hutang: <span className="text-red-600">{rp(preview.data.balance)}</span>
          </h5>
          <hr className="my-3" />
          <h6 className="font-semibold">Riwayat Pinjaman:</h6>
          <ul className="list-disc pl-5 mb-3">
            {preview.data.loans.map((l) => (
              <li key={l.id}>{l.date}: {rp(l.amount)} ({l.notes || '-'})</li>
            ))}
            {preview.data.loans.length === 0 && <li className="list-none text-gray-500">Belum ada data</li>}
          </ul>
          <h6 className="font-semibold">Riwayat Pembayaran:</h6>
          <ul className="list-disc pl-5">
            {preview.data.payments.map((p) => (
              <li key={p.id}>{p.date}: {rp(p.amount)}</li>
            ))}
            {preview.data.payments.length === 0 && <li className="list-none text-gray-500">Belum ada data</li>}
          </ul>
        </Modal>
      )}
    </main>
  );
}

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-24 z-50" onClick={onClose}>
      <div
        className={`bg-white rounded shadow-lg w-full ${wide ? 'max-w-2xl' : 'max-w-md'} mx-4`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h5 className="font-semibold">{title}</h5>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
