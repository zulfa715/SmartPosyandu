import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Baby, Calendar, Activity, TrendingUp, Building2 } from 'lucide-react';
import { format, differenceInMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardOrangTua() {
  const { balita, pemeriksaan, jadwal, orangtua } = useData();
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

  const jadwalTerdekat = useMemo(() => {
    const today = new Date();
    return jadwal
      .filter(j => new Date(j.tanggal) >= today)
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())[0];
  }, [jadwal]);

  const usiaBulan = selectedBalita
    ? differenceInMonths(new Date(), new Date(selectedBalita.tanggal_lahir))
    : 0;

  const pemeriksaanTerakhir = riwayatPemeriksaan[riwayatPemeriksaan.length - 1];

  if (!selectedBalita) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Baby className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Belum Ada Data Anak</h2>
          <p className="text-gray-500 dark:text-gray-400">Silakan hubungi kader Posyandu Teratai 4 untuk mendaftarkan anak Anda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Dashboard Orang Tua</h1>
        <p className="text-gray-600 dark:text-gray-400">Pantau kesehatan dan pertumbuhan anak Anda</p>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Baby size={28} />
          </div>
          <div className="flex-1">
            <p className="text-pink-100 text-sm">Selamat datang,</p>
            <h2 className="text-2xl font-bold">{user?.nama}</h2>
            <div className="flex items-center gap-2 text-pink-100 text-sm mt-1">
              <Building2 size={14} />
              <span className="font-medium">Posyandu Teratai 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Child Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-pink-100 dark:border-pink-900/40">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Profil Anak</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Nama Anak</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedBalita.nama}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Jenis Kelamin</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedBalita.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Tanggal Lahir</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {format(new Date(selectedBalita.tanggal_lahir), 'd MMMM yyyy', { locale: id })}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Usia</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{usiaBulan} bulan</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Posyandu</p>
            <p className="font-semibold text-pink-600 dark:text-pink-400">Teratai 4</p>
          </div>
        </div>
      </div>

      {/* Vital Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Activity className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Berat Badan</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pemeriksaanTerakhir?.berat_badan ?? '-'} <span className="text-sm">kg</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {pemeriksaanTerakhir
              ? format(new Date(pemeriksaanTerakhir.tanggal), 'd MMM yyyy', { locale: id })
              : 'Belum ada data'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Tinggi Badan</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pemeriksaanTerakhir?.tinggi_badan ?? '-'} <span className="text-sm">cm</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {pemeriksaanTerakhir
              ? format(new Date(pemeriksaanTerakhir.tanggal), 'd MMM yyyy', { locale: id })
              : 'Belum ada data'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Baby className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Lingkar Kepala</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pemeriksaanTerakhir?.lingkar_kepala ?? '-'} <span className="text-sm">cm</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {pemeriksaanTerakhir
              ? format(new Date(pemeriksaanTerakhir.tanggal), 'd MMM yyyy', { locale: id })
              : 'Belum ada data'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Activity className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">LILA</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pemeriksaanTerakhir?.lingkar_lengan ?? '-'} <span className="text-sm">cm</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {pemeriksaanTerakhir
              ? format(new Date(pemeriksaanTerakhir.tanggal), 'd MMM yyyy', { locale: id })
              : 'Belum ada data'}
          </p>
        </div>
      </div>

      {/* Growth Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Grafik Pertumbuhan Anak</h3>
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
              <Line yAxisId="left" type="monotone" dataKey="Berat Badan" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 5 }} />
              <Line yAxisId="right" type="monotone" dataKey="Tinggi Badan" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Next Schedule */}
      {jadwalTerdekat && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Jadwal Posyandu Teratai 4 Berikutnya</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-100">Tanggal</p>
                  <p className="font-semibold">
                    {format(new Date(jadwalTerdekat.tanggal), 'EEEE, d MMMM yyyy', { locale: id })}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100">Waktu</p>
                  <p className="font-semibold">{jadwalTerdekat.waktu}</p>
                </div>
                <div>
                  <p className="text-blue-100">Lokasi</p>
                  <p className="font-semibold">{jadwalTerdekat.lokasi}</p>
                </div>
              </div>
              {jadwalTerdekat.keterangan && (
                <p className="mt-3 text-blue-50">{jadwalTerdekat.keterangan}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Examination History */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Riwayat Pemeriksaan</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">5 pemeriksaan terakhir</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Tanggal', 'BB (kg)', 'TB (cm)', 'LK (cm)', 'LILA (cm)', 'Status BB', 'Imunisasi', 'Catatan'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {riwayatPemeriksaan.slice(-5).reverse().length > 0 ? (
                riwayatPemeriksaan.slice(-5).reverse().map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {format(new Date(p.tanggal), 'd MMM yyyy', { locale: id })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{p.berat_badan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{p.tinggi_badan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{p.lingkar_kepala}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{p.lingkar_lengan ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.status_bb === 'N' && <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">Naik (N)</span>}
                      {p.status_bb === 'T' && <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-medium">Turun (T)</span>}
                      {p.status_bb === 'O' && <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">Tdk Ada (O)</span>}
                      {!p.status_bb && <span className="text-gray-400 text-xs">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{p.imunisasi ?? '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{p.catatan ?? '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada data pemeriksaan
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
