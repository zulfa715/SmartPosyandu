import React from 'react';
import { useNavigate } from 'react-router';
import { Baby, Calendar, Heart, TrendingUp, Users, Shield } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-peach-50 to-white">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                <Baby className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-800">Smart Posyandu</h1>
                <p className="text-xs text-gray-500">Kesehatan Balita Digital</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full mb-6">
                Pengganti Buku KIA/Buku Pink Digital
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Pantau Kesehatan Balita dengan{' '}
                <span className="text-pink-600">Lebih Mudah</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Sistem pencatatan kesehatan balita modern yang memudahkan kader posyandu
                dan orang tua dalam memantau tumbuh kembang anak secara real-time.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
                >
                  Mulai Sekarang
                </button>
                <button className="bg-white border-2 border-pink-300 text-pink-600 px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-200 to-peach-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
                    <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                      <Heart className="text-pink-600" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Pemeriksaan Rutin</p>
                      <p className="text-sm text-gray-500">Data tercatat otomatis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-peach-50 rounded-xl">
                    <div className="w-12 h-12 bg-peach-200 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Grafik Pertumbuhan</p>
                      <p className="text-sm text-gray-500">Pantau perkembangan balita</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
                    <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                      <Calendar className="text-pink-600" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Jadwal Posyandu</p>
                      <p className="text-sm text-gray-500">Notifikasi otomatis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Fitur Lengkap untuk Kesehatan Balita
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Semua yang Anda butuhkan untuk memantau kesehatan dan pertumbuhan balita dalam satu platform
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-pink-200 rounded-2xl flex items-center justify-center mb-4">
                  <Baby className="text-pink-600" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Data Balita Lengkap</h4>
                <p className="text-gray-600">
                  Catat semua data balita termasuk berat, tinggi, lingkar kepala, dan riwayat imunisasi secara lengkap.
                </p>
              </div>

              <div className="bg-gradient-to-br from-peach-50 to-white p-8 rounded-2xl border border-peach-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-peach-200 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="text-orange-600" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Grafik Pertumbuhan</h4>
                <p className="text-gray-600">
                  Visualisasi pertumbuhan balita dengan grafik interaktif yang mudah dipahami orang tua.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-pink-200 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="text-pink-600" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Multi User</h4>
                <p className="text-gray-600">
                  Akses terpisah untuk kader posyandu dan orang tua dengan hak akses yang sesuai.
                </p>
              </div>

              <div className="bg-gradient-to-br from-peach-50 to-white p-8 rounded-2xl border border-peach-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-peach-200 rounded-2xl flex items-center justify-center mb-4">
                  <Calendar className="text-orange-600" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Jadwal Posyandu</h4>
                <p className="text-gray-600">
                  Kelola jadwal posyandu dan kirim pengingat otomatis kepada orang tua balita.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-pink-200 rounded-2xl flex items-center justify-center mb-4">
                  <Heart className="text-pink-600" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Riwayat Kesehatan</h4>
                <p className="text-gray-600">
                  Akses mudah ke seluruh riwayat pemeriksaan balita kapan saja dan di mana saja.
                </p>
              </div>

              <div className="bg-gradient-to-br from-peach-50 to-white p-8 rounded-2xl border border-peach-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-peach-200 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="text-orange-600" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Aman & Terpercaya</h4>
                <p className="text-gray-600">
                  Data tersimpan dengan aman dan dapat diekspor dalam format PDF untuk arsip.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-pink-500 to-pink-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Memulai Pencatatan Digital?
            </h3>
            <p className="text-pink-100 text-lg mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan posyandu yang telah beralih ke sistem digital untuk kesehatan balita yang lebih baik.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-pink-600 px-10 py-4 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              Mulai Gratis Sekarang
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                  <Baby className="text-white" size={20} />
                </div>
                <h4 className="font-bold text-lg">Smart Posyandu</h4>
              </div>
              <p className="text-gray-400 mb-4">
                Sistem digital untuk pencatatan kesehatan balita yang modern, mudah, dan terpercaya.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Menu</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Bantuan</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Panduan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dukungan</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Smart Posyandu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
