import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Baby, Calendar, User, Phone, MapPin, Download } from 'lucide-react';
import { format, differenceInMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

export default function ProfilAnak() {
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
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  }, [pemeriksaan, selectedBalita]);

  const chartData = useMemo(() => {
    return riwayatPemeriksaan.map(p => ({
      tanggal: format(new Date(p.tanggal), 'dd/MM', { locale: id }),
      'Berat Badan': p.berat_badan,
      'Tinggi Badan': p.tinggi_badan
    }));
  }, [riwayatPemeriksaan]);

  const usiaBulan = selectedBalita
    ? differenceInMonths(new Date(), new Date(selectedBalita.tanggal_lahir))
    : 0;

  const exportToPDF = () => {
    if (!selectedBalita || !myOrangTua) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('PROFIL KESEHATAN ANAK', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Smart Posyandu - Buku Kesehatan Digital', 105, 28, { align: 'center' });

    doc.setFontSize(10);
    let yPos = 45;

    doc.text('DATA ANAK', 14, yPos);
    yPos += 8;
    doc.text(`Nama: ${selectedBalita.nama}`, 20, yPos);
    yPos += 6;
    doc.text(`NIK: ${selectedBalita.nik || '-'}`, 20, yPos);
    yPos += 6;
    doc.text(`Tanggal Lahir: ${format(new Date(selectedBalita.tanggal_lahir), 'd MMMM yyyy', { locale: id })}`, 20, yPos);
    yPos += 6;
    doc.text(`Usia: ${usiaBulan} bulan`, 20, yPos);
    yPos += 6;
    doc.text(`Jenis Kelamin: ${selectedBalita.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}`, 20, yPos);
    yPos += 10;

    doc.text('DATA ORANG TUA', 14, yPos);
    yPos += 8;
    doc.text(`Nama Ayah: ${myOrangTua.nama_ayah}`, 20, yPos);
    yPos += 6;
    doc.text(`Nama Ibu: ${myOrangTua.nama_ibu}`, 20, yPos);
    yPos += 6;
    doc.text(`Alamat: ${myOrangTua.alamat}`, 20, yPos);
    yPos += 6;
    doc.text(`Telepon: ${myOrangTua.telepon}`, 20, yPos);
    yPos += 12;

    doc.text('RIWAYAT PEMERIKSAAN', 14, yPos);
    yPos += 8;

    const tableData = riwayatPemeriksaan.map(p => [
      format(new Date(p.tanggal), 'd MMM yyyy', { locale: id }),
      p.berat_badan.toString(),
      p.tinggi_badan.toString(),
      p.lingkar_kepala.toString(),
      p.imunisasi || '-',
      p.catatan || '-'
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Tanggal', 'BB (kg)', 'TB (cm)', 'LK (cm)', 'Imunisasi', 'Catatan']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [236, 72, 153] }
    });

    doc.save(`Profil_Kesehatan_${selectedBalita.nama.replace(/ /g, '_')}.pdf`);
    toast.success('Profil kesehatan berhasil diunduh');
  };

  if (!selectedBalita || !myOrangTua) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Baby className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Data Anak</h2>
          <p className="text-gray-500">Silakan hubungi kader posyandu untuk mendaftarkan anak Anda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Anak</h1>
          <p className="text-gray-600">Detail informasi kesehatan anak</p>
        </div>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
        >
          <Download size={20} />
          Unduh PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <Baby size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{selectedBalita.nama}</h2>
              <p className="text-pink-100">
                {selectedBalita.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Calendar size={18} />
              <div>
                <p className="text-pink-100 text-sm">Tanggal Lahir</p>
                <p className="font-semibold">
                  {format(new Date(selectedBalita.tanggal_lahir), 'd MMMM yyyy', { locale: id })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Baby size={18} />
              <div>
                <p className="text-pink-100 text-sm">Usia</p>
                <p className="font-semibold">{usiaBulan} bulan</p>
              </div>
            </div>
            {selectedBalita.nik && (
              <div className="flex items-center gap-3">
                <User size={18} />
                <div>
                  <p className="text-pink-100 text-sm">NIK</p>
                  <p className="font-semibold">{selectedBalita.nik}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Data Orang Tua</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Nama Ayah</p>
                <p className="font-medium text-gray-900">{myOrangTua.nama_ayah}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Nama Ibu</p>
                <p className="font-medium text-gray-900">{myOrangTua.nama_ibu}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Alamat</p>
                <p className="font-medium text-gray-900">{myOrangTua.alamat}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="font-medium text-gray-900">{myOrangTua.telepon}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Grafik Pertumbuhan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tanggal" />
              <YAxis yAxisId="left" label={{ value: 'Berat (kg)', angle: -90, position: 'insideLeft' }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Tinggi (cm)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Berat Badan"
                stroke="#ec4899"
                strokeWidth={3}
                dot={{ fill: '#ec4899', r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Tinggi Badan"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
