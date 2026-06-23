import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';
import { Baby, Calendar, Heart, TrendingUp, Users, Shield, BookOpen, Activity, Moon, Sun, ChevronDown } from 'lucide-react';

export default function LandingPageNew() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const aboutRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const edukasiRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-peach-50 to-white dark:from-gray-900 dark:via-pink-950 dark:to-gray-900 transition-colors duration-300">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg">
                <Baby className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-800 dark:text-gray-100">Smart Posyandu</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Posyandu Teratai 4 – Kesehatan Ibu dan Anak</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:shadow-md transition-all"
              >
                {theme === 'light' ? (
                  <Moon className="text-gray-700 dark:text-gray-300" size={20} />
                ) : (
                  <Sun className="text-yellow-400" size={20} />
                )}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-4 py-2 rounded-full mb-6">
                Pengganti Buku KIA/Buku Pink Digital
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                Pantau Kesehatan Ibu dan Anak dengan{' '}
                <span className="text-pink-600 dark:text-pink-400">Lebih Mudah</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
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
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="bg-white dark:bg-gray-800 border-2 border-pink-300 dark:border-pink-600 text-pink-600 dark:text-pink-400 px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
                >
                  Pelajari Lebih Lanjut
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-200 to-peach-200 dark:from-pink-900/40 dark:to-peach-900/40 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-pink-50 dark:bg-pink-900/30 rounded-xl">
                    <div className="w-12 h-12 bg-pink-200 dark:bg-pink-700 rounded-full flex items-center justify-center">
                      <Heart className="text-pink-600 dark:text-pink-300" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Pemeriksaan Rutin</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Data tercatat otomatis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-peach-50 dark:bg-orange-900/30 rounded-xl">
                    <div className="w-12 h-12 bg-peach-200 dark:bg-orange-700 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-orange-600 dark:text-orange-300" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Grafik Pertumbuhan</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pantau perkembangan balita</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-pink-50 dark:bg-pink-900/30 rounded-xl">
                    <div className="w-12 h-12 bg-pink-200 dark:bg-pink-700 rounded-full flex items-center justify-center">
                      <Calendar className="text-pink-600 dark:text-pink-300" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Jadwal Posyandu</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notifikasi otomatis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={aboutRef} className="bg-white dark:bg-gray-800 py-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Tentang Smart Posyandu
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Smart Posyandu adalah sistem digital pengganti Buku KIA (Kesehatan Ibu dan Anak) atau Buku Pink
                yang memudahkan pencatatan, pemantauan, dan edukasi kesehatan balita
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-pink-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border border-pink-100 dark:border-pink-800 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-pink-200 dark:bg-pink-700 rounded-2xl flex items-center justify-center mb-4">
                  <Baby className="text-pink-600 dark:text-pink-300" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Data Balita Lengkap</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Catat semua data balita termasuk berat, tinggi, lingkar kepala, lingkar lengan, dan riwayat imunisasi secara lengkap.
                </p>
              </div>

              <div className="bg-gradient-to-br from-peach-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border border-peach-100 dark:border-orange-800 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-peach-200 dark:bg-orange-700 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="text-orange-600 dark:text-orange-300" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Grafik Pertumbuhan</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Visualisasi pertumbuhan balita dengan grafik interaktif yang mudah dipahami orang tua untuk deteksi dini stunting.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border border-pink-100 dark:border-pink-800 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-pink-200 dark:bg-pink-700 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="text-pink-600 dark:text-pink-300" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Multi User</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Akses terpisah untuk kader posyandu dan orang tua dengan hak akses yang sesuai peran masing-masing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={benefitsRef} className="py-16 bg-gradient-to-br from-pink-50 to-peach-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Manfaat Digitalisasi Buku KIA
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Transformasi dari buku fisik ke digital membawa banyak keuntungan untuk kesehatan ibu dan anak
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: 'Data Tidak Hilang', desc: 'Data tersimpan aman di cloud, tidak khawatir buku hilang atau rusak' },
                { icon: Activity, title: 'Akses Mudah', desc: 'Bisa diakses kapan saja dan di mana saja melalui smartphone atau komputer' },
                { icon: Calendar, title: 'Reminder Otomatis', desc: 'Notifikasi jadwal imunisasi dan posyandu langsung ke perangkat' },
                { icon: TrendingUp, title: 'Monitoring Real-time', desc: 'Pantau pertumbuhan anak secara real-time dengan grafik interaktif' },
                { icon: Users, title: 'Kolaborasi Tim', desc: 'Kader, bidan, dan dokter bisa akses data yang sama untuk penanganan lebih baik' },
                { icon: BookOpen, title: 'Edukasi Terintegrasi', desc: 'Tips kesehatan dan edukasi langsung tersedia dalam aplikasi' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="text-pink-600 dark:text-pink-400" size={24} />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={edukasiRef} className="bg-white dark:bg-gray-800 py-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Edukasi Kesehatan Ibu dan Anak
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Akses informasi kesehatan terpercaya untuk ibu dan anak
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-pink-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border border-pink-200 dark:border-pink-800">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Untuk Ibu Hamil</h4>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-pink-200 dark:bg-pink-700 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 text-xs mt-0.5">✓</span>
                    <span>Panduan nutrisi selama kehamilan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-pink-200 dark:bg-pink-700 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 text-xs mt-0.5">✓</span>
                    <span>Jadwal pemeriksaan kehamilan (ANC)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-pink-200 dark:bg-pink-700 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 text-xs mt-0.5">✓</span>
                    <span>Persiapan persalinan dan menyusui</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-pink-200 dark:bg-pink-700 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 text-xs mt-0.5">✓</span>
                    <span>Tips mengatasi morning sickness</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Untuk Balita</h4>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs mt-0.5">✓</span>
                    <span>Jadwal imunisasi lengkap (0-5 tahun)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs mt-0.5">✓</span>
                    <span>Menu MPASI bergizi sesuai usia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs mt-0.5">✓</span>
                    <span>Pencegahan stunting sejak dini</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs mt-0.5">✓</span>
                    <span>Deteksi tumbuh kembang anak</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800 py-16 transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Memulai Pencatatan Digital?
            </h3>
            <p className="text-pink-100 dark:text-pink-200 text-lg mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan posyandu yang telah beralih ke sistem digital untuk kesehatan ibu dan anak yang lebih baik.
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

      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                  <Baby className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Smart Posyandu</h4>
                  <p className="text-sm text-gray-400">Kesehatan Ibu dan Anak</p>
                </div>
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
            <p>&copy; 2026 Smart Posyandu - Kesehatan Ibu dan Anak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
