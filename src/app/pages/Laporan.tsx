import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { FileText, Download, Printer, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Laporan() {
  const { balita, pemeriksaan, orangtua } = useData();
  const [selectedBalitaId, setSelectedBalitaId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredPemeriksaan = useMemo(() => {
    let filtered = pemeriksaan;

    if (selectedBalitaId) {
      filtered = filtered.filter(p => p.balita_id === selectedBalitaId);
    }

    if (startDate) {
      filtered = filtered.filter(p => new Date(p.tanggal) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(p => new Date(p.tanggal) <= new Date(endDate));
    }

    return filtered.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [pemeriksaan, selectedBalitaId, startDate, endDate]);

  const exportToPDF = () => {
    if (filteredPemeriksaan.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const doc = new jsPDF();
    const selectedBalita = selectedBalitaId ? balita.find(b => b.id === selectedBalitaId) : null;
    const parent = selectedBalita ? orangtua.find(o => o.id === selectedBalita.orangtua_id) : null;

    doc.setFontSize(18);
    doc.text('LAPORAN PEMERIKSAAN BALITA', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Smart Posyandu - Sistem Kesehatan Balita Digital', 105, 28, { align: 'center' });

    let yPos = 40;

    if (selectedBalita) {
      doc.setFontSize(10);
      doc.text(`Nama Balita: ${selectedBalita.nama}`, 14, yPos);
      yPos += 6;
      doc.text(`Tanggal Lahir: ${format(new Date(selectedBalita.tanggal_lahir), 'd MMMM yyyy', { locale: id })}`, 14, yPos);
      yPos += 6;
      doc.text(`Jenis Kelamin: ${selectedBalita.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}`, 14, yPos);
      yPos += 6;
      if (parent) {
        doc.text(`Orang Tua: ${parent.nama_ibu} / ${parent.nama_ayah}`, 14, yPos);
        yPos += 6;
      }
      yPos += 4;
    }

    if (startDate || endDate) {
      doc.setFontSize(10);
      const periodText = `Periode: ${startDate ? format(new Date(startDate), 'd MMMM yyyy', { locale: id }) : 'Awal'} - ${endDate ? format(new Date(endDate), 'd MMMM yyyy', { locale: id }) : 'Sekarang'}`;
      doc.text(periodText, 14, yPos);
      yPos += 10;
    }

    const tableData = filteredPemeriksaan.map(p => {
      const b = balita.find(bl => bl.id === p.balita_id);
      return [
        format(new Date(p.tanggal), 'd MMM yyyy', { locale: id }),
        b?.nama || '-',
        p.berat_badan.toString(),
        p.tinggi_badan.toString(),
        p.lingkar_kepala.toString(),
        p.imunisasi || '-',
        p.vitamin || '-',
        p.catatan || '-'
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Tanggal', 'Nama', 'BB (kg)', 'TB (cm)', 'LK (cm)', 'Imunisasi', 'Vitamin', 'Catatan']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [236, 72, 153] },
      margin: { top: yPos }
    });

    const fileName = selectedBalita
      ? `Laporan_${selectedBalita.nama.replace(/ /g, '_')}_${format(new Date(), 'ddMMyyyy')}.pdf`
      : `Laporan_Semua_Balita_${format(new Date(), 'ddMMyyyy')}.pdf`;

    doc.save(fileName);
    toast.success('Laporan PDF berhasil diunduh');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Pemeriksaan</h1>
          <p className="text-gray-600">Export dan cetak laporan data pemeriksaan balita</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Filter Laporan</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Balita
            </label>
            <select
              value={selectedBalitaId}
              onChange={(e) => setSelectedBalitaId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Semua Balita</option>
              {balita.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <Download size={20} />
            Export PDF
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            <Printer size={20} />
            Cetak
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <FileText className="text-pink-600" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Preview Laporan</h2>
              <p className="text-gray-600 text-sm">
                {filteredPemeriksaan.length} data pemeriksaan
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Balita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BB (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TB (cm)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LK (cm)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imunisasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vitamin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPemeriksaan.length > 0 ? (
                filteredPemeriksaan.map((p) => {
                  const b = balita.find(bl => bl.id === p.balita_id);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(p.tanggal), 'd MMM yyyy', { locale: id })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{b?.nama}</div>
                        <div className="text-xs text-gray-500">
                          {b?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {p.berat_badan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {p.tinggi_badan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {p.lingkar_kepala}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{p.imunisasi || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{p.vitamin || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.catatan || '-'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data sesuai filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
