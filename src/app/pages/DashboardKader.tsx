import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Baby, Calendar, Activity, TrendingUp, Building2, UserCircle, ArrowUp, ArrowDown, Minus, Clock } from 'lucide-react';
import { format, differenceInMonths } from 'date-fns';
import { id } from 'date-fns/locale';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function DashboardKader() {
  const { balita, pemeriksaan, jadwal } = useData();
  const { user } = useAuth();

  const grafikPertumbuhan = [
  { bulan: "Jan", bb: 3.2 },
  { bulan: "Feb", bb: 4.1 },
  { bulan: "Mar", bb: 5.3 },
  { bulan: "Apr", bb: 6.2 },
  { bulan: "Mei", bb: 6.8 },
  { bulan: "Jun", bb: 7.5 },
  { bulan: "Jul", bb: 8.0 },
];

  const stats = useMemo(() => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const pemeriksaanBulanIni = pemeriksaan.filter(p => {
      const date = new Date(p.tanggal);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const jadwalTerdekat = jadwal
      .filter(j => new Date(j.tanggal) >= today)
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())[0];

    return {
      totalBalita: balita.length,
      pemeriksaanBulanIni: pemeriksaanBulanIni.length,
      jadwalTerdekat,
      balitaLaki: balita.filter(b => b.jenis_kelamin === 'L').length,
      balitaPerempuan: balita.filter(b => b.jenis_kelamin === 'P').length
    };
  }, [balita, pemeriksaan, jadwal]);

  const pemeriksaanTerbaru = useMemo(() => {
    return pemeriksaan
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      .slice(0, 5)
      .map(p => ({
        ...p,
        balita: balita.find(b => b.id === p.balita_id)
      }));
  }, [pemeriksaan, balita]);

  const lastLoginFormatted = useMemo(() => {
    if (!user?.lastLogin) return null;
    try {
      return format(new Date(user.lastLogin), "EEEE, d MMMM yyyy 'pukul' HH:mm", { locale: id });
    } catch {
      return null;
    }
  }, [user?.lastLogin]);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <UserCircle size={32} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">Selamat Datang, {user?.nama}!</h1>
            <div className="flex flex-wrap items-center gap-4 text-pink-100 dark:text-pink-200 text-sm">
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                <span className="font-semibold">Posyandu Teratai 4</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}</span>
              </div>
            </div>
            {lastLoginFormatted && (
              <div className="flex items-center gap-2 text-pink-200 dark:text-pink-300 text-xs mt-2">
                <Clock size={14} />
                <span>Login terakhir: {lastLoginFormatted}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Identity Banner */}
      <div className="bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-800 rounded-xl px-5 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/40 rounded-lg flex items-center justify-center">
          <Baby className="text-pink-600 dark:text-pink-400" size={18} />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">Posyandu Teratai 4</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Smart Posyandu – Kesehatan Ibu dan Anak</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Baby size={24} />
            </div>
            <div className="text-right">
              <p className="text-pink-100 text-sm">Total Balita</p>
              <p className="text-3xl font-bold">{stats.totalBalita}</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <p className="text-pink-100">Laki-laki</p>
              <p className="font-semibold">{stats.balitaLaki}</p>
            </div>
            <div>
              <p className="text-pink-100">Perempuan</p>
              <p className="font-semibold">{stats.balitaPerempuan}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Activity className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <div className="text-right">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pemeriksaan</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.pemeriksaanBulanIni}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bulan ini</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="text-right">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Jadwal Terdekat</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.jadwalTerdekat
                  ? format(new Date(stats.jadwalTerdekat.tanggal), 'd MMM', { locale: id })
                  : '-'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stats.jadwalTerdekat ? stats.jadwalTerdekat.lokasi : 'Belum ada jadwal'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div className="text-right">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Status</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">Aktif</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sistem berjalan normal</p>
        </div>
      </div>

      {/* Upcoming Schedule */}
      {stats.jadwalTerdekat && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Jadwal Posyandu Teratai 4 Terdekat</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-100">Tanggal</p>
                  <p className="font-semibold">
                    {format(new Date(stats.jadwalTerdekat.tanggal), 'EEEE, d MMMM yyyy', { locale: id })}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100">Waktu</p>
                  <p className="font-semibold">{stats.jadwalTerdekat.waktu}</p>
                </div>
                <div>
                  <p className="text-blue-100">Lokasi</p>
                  <p className="font-semibold">{stats.jadwalTerdekat.lokasi}</p>
                </div>
              </div>
              {stats.jadwalTerdekat.keterangan && (
                <p className="mt-3 text-blue-50">{stats.jadwalTerdekat.keterangan}</p>
              )}
            </div>
          </div>
        </div>
      )}

<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
    📈 Grafik Pertumbuhan Balita
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={grafikPertumbuhan}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="bulan" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="bb"
        stroke="#ec4899"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
      {/* Recent Examinations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pemeriksaan Terbaru</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">5 pemeriksaan terakhir – Posyandu Teratai 4</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Tanggal', 'Nama Balita', 'Umur', 'BB (kg)', 'TB (cm)', 'LK (cm)', 'LILA (cm)', 'Status BB', 'Catatan'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pemeriksaanTerbaru.length > 0 ? (
                pemeriksaanTerbaru.map((p) => {
                  const umurBulan = p.balita
                    ? differenceInMonths(new Date(p.tanggal), new Date(p.balita.tanggal_lahir))
                    : 0;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {format(new Date(p.tanggal), 'd MMM yyyy', { locale: id })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.balita?.nama}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {p.balita?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {p.umur_bulan ?? umurBulan} bln
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {p.berat_badan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {p.tinggi_badan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {p.lingkar_kepala}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {p.lingkar_lengan ?? '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.status_bb === 'N' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                            <ArrowUp size={12} /> Naik
                          </span>
                        )}
                        {p.status_bb === 'T' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
                            <ArrowDown size={12} /> Turun
                          </span>
                        )}
                        {p.status_bb === 'O' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs font-medium">
                            <Minus size={12} /> Tidak Ada
                          </span>
                        )}
                        {!p.status_bb && <span className="text-gray-400 text-xs">-</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {p.catatan ?? '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada data pemeriksaan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-green-100 dark:border-green-800">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4">Status Gizi Balita</h3>
          <div className="space-y-3">
            {[
              { label: 'Gizi Baik', value: balita.length - 1, color: 'text-green-600 dark:text-green-400' },
              { label: 'Gizi Kurang', value: 1, color: 'text-yellow-600 dark:text-yellow-400' },
              { label: 'Gizi Buruk', value: 0, color: 'text-red-600 dark:text-red-400' }
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-xl">
                <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                <span className={`font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4">Status Pertumbuhan</h3>
          <div className="space-y-3">
            {[
              { label: 'BB Naik (N)', value: pemeriksaan.filter(p => p.status_bb === 'N').length, color: 'text-green-600 dark:text-green-400' },
              { label: 'BB Turun (T)', value: pemeriksaan.filter(p => p.status_bb === 'T').length, color: 'text-red-600 dark:text-red-400' },
              { label: 'Tidak Ada Data (O)', value: pemeriksaan.filter(p => p.status_bb === 'O' || !p.status_bb).length, color: 'text-gray-600 dark:text-gray-400' }
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-xl">
                <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                <span className={`font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4">Tips Kesehatan</h3>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pastikan semua balita Posyandu Teratai 4 mendapatkan imunisasi sesuai jadwal untuk perlindungan optimal.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pantau LILA balita secara rutin untuk deteksi dini malnutrisi dan stunting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
