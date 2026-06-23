import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Baby, Lock, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast.success('Login berhasil!');
        navigate('/dashboard');
      } else {
        toast.error('Username atau password salah');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-peach-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Baby className="text-pink-600" size={40} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Smart Posyandu</h1>
            <p className="text-pink-100">Sistem Kesehatan Balita Digital</p>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Masuk ke Akun</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Masukkan username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Masukkan password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex gap-2 mb-2">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm font-medium text-blue-900">Demo Login</p>
              </div>
              <div className="text-sm text-blue-800 space-y-1 ml-7">
                <p><span className="font-semibold">Kader:</span> username: <code className="bg-blue-100 px-2 py-0.5 rounded">kader1</code></p>
                <p><span className="font-semibold">Orang Tua:</span> username: <code className="bg-blue-100 px-2 py-0.5 rounded">orangtua1</code></p>
                <p><span className="font-semibold">Password:</span> <code className="bg-blue-100 px-2 py-0.5 rounded">password123</code></p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-pink-600 hover:text-pink-700 font-medium"
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
