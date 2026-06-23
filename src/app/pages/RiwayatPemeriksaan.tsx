import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

export default function RiwayatPemeriksaan() {
  const { balita, pemeriksaan, orangtua } = useData();
  const { user } = useAuth();

  const myOrangTua = useMemo(() => {
    return orangtua.find(o => o.user_id === user?.id);
  }, [orangtua, user]);

  const myBalita = useMemo(() => {
    if (!myOrangTua) return [];
    return balita.filter(b => b.orangtua_id === myOrangTua.id);
  }, [balita, myOrangTua]);

  const selectedBalita = myBalita[0];

  const riwayatPemeriksaan = useMemo(() => {
    if (!selectedBalita) return [];
    return pemeriksaan
      .filter(p => p.balita_id === selectedBalita.id)
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [pemeriksaan, selectedBalita]);

  const exportToPDF = () => {
    if (!selectedBalita || riwayatPemeriksaan.length === 0) {
      toast.error('Tidak ada data untuk diunduh');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('RIWAYAT PEMERIKSAAN', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Nama: ${selectedBalita.nama}`, 105, 28, { align: 'center' });

    const tableData = riwayatPemeriksaan.map(p => [
      format(new Date(p.tanggal), 'd MMM yyyy', { locale: id }),
      p.berat_badan.toString(),
      p.tinggi_badan.toString(),
      p.lingkar_kepala.toString(),
      p.imunisasi || '-',
      p.vitamin || '-',
      p.catatan || '-'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Tanggal', 'BB (kg)', 'TB (cm)', 'LK (cm)', 'Imunisasi', 'Vitamin', 'Catatan']],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [236, 72, 153] }
    });

    doc.save(`Riwayat_Pemeriksaan_${selectedBalita.nama.replace(/ /g, '_')}.pdf`);
    toast.success('Riwayat pemeriksaan berhasil diunduh');
  };

  if (!selectedBalita) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Data</h2>
          <p className="text-gray-500">Silakan hubungi kader posyandu untuk mendaftarkan anak Anda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Pemeriksaan</h1>
          <p className="text-gray-600">Lihat semua riwayat pemeriksaan {selectedBalita.nama}</p>
        </div>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
        >
          <Download size={20} />
          Unduh PDF
        </button>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-pink-200 rounded-2xl flex items-center justify-center">
            <Activity className="text-pink-600" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedBalita.nama}</h2>
            <p className="text-gray-600">Total {riwayatPemeriksaan.length} kali pemeriksaan</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Detail Riwayat Pemeriksaan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
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
                  Keluhan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riwayatPemeriksaan.length > 0 ? (
                riwayatPemeriksaan.map((p, index) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-pink-600">{riwayatPemeriksaan.length - index}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {format(new Date(p.tanggal), 'd MMMM yyyy', { locale: id })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(p.tanggal), 'EEEE', { locale: id })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {p.berat_badan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {p.tinggi_badan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {p.lingkar_kepala}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {p.imunisasi ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {p.imunisasi}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {p.vitamin ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {p.vitamin}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      {p.keluhan || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      {p.catatan || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Activity className="mx-auto mb-4 text-gray-300" size={48} />
                    <p>Belum ada riwayat pemeriksaan</p>
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
