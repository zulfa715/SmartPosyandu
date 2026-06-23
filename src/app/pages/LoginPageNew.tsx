import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Baby, Lock, User, Phone, Moon, Sun, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPageNew() {
  const [isKader, setIsKader] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;

      if (isKader) {
        if (!username || !password) {
          toast.error('Username dan password harus diisi');
          setLoading(false);
          return;
        }
        success = await login(username, password, false);
      } else {
        if (!username || !phone) {
          toast.error('Username dan nomor HP harus diisi');
          setLoading(false);
          return;
        }
        success = await login(username, phone, true);
      }

      if (success) {
        toast.success('Login berhasil!');
        navigate('/dashboard');
      } else {
        toast.error(
          isKader
            ? 'Username atau password salah'
            : 'Username atau nomor HP tidak ditemukan'
        );
      }
    } catch {
      toast.error('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (kader: boolean) => {
    setIsKader(kader);
    setUsername('');
    setPassword('');
    setPhone('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-peach-50 to-pink-50 dark:from-gray-900 dark:via-pink-950 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
      >
        {theme === 'light' ? (
          <Moon className="text-gray-700" size={24} />
        ) : (
          <Sun className="text-yellow-400" size={24} />
        )}
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800 p-8 text-center transition-colors duration-300">
            <div className="w-20 h-20 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Baby className="text-pink-600 dark:text-pink-700" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Smart Posyandu</h1>
            <p className="text-pink-100 dark:text-pink-200 font-medium">Kesehatan Ibu dan Anak</p>
            <p className="text-pink-200 dark:text-pink-300 text-sm mt-1">Posyandu Teratai 4</p>
          </div>

          <div className="p-8">
            <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl transition-colors duration-300">
              <button
                onClick={() => handleTabChange(true)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                  isKader
                    ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Kader
              </button>
              <button
                onClick={() => handleTabChange(false)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                  !isKader
                    ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Orang Tua
              </button>
            </div>

            {isKader ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username Kader
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Masukkan username kader"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Masukkan password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Memproses...' : 'Masuk sebagai Kader'}
                </button>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex gap-2 mb-2">
                    <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Demo Login Kader</p>
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1 ml-7">
                    <p><span className="font-semibold">Username:</span> dewi / siti / ani / rina</p>
                    <p><span className="font-semibold">Password:</span> kader123</p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nomor HP
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Contoh: 081234567890"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Memproses...' : 'Masuk sebagai Orang Tua'}
                </button>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex gap-2 mb-2">
                    <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Demo Login Orang Tua</p>
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1 ml-7">
                    <p><span className="font-semibold">Username:</span> sulastri</p>
                    <p><span className="font-semibold">No HP:</span> 081234567890</p>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
