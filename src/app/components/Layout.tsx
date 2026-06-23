import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router';
import {
  Baby,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  LogOut,
  Menu,
  X,
  Activity,
  UserCircle,
  BookOpen,
  Moon,
  Sun,
  Building2
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const kaderMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Baby, label: 'Data Balita', path: '/balita' },
    { icon: Activity, label: 'Pemeriksaan', path: '/pemeriksaan' },
    { icon: Calendar, label: 'Jadwal Posyandu', path: '/jadwal' },
    { icon: FileText, label: 'Laporan', path: '/laporan' },
    { icon: BookOpen, label: 'Edukasi Kesehatan', path: '/edukasi' }
  ];

  const orangtuaMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Baby, label: 'Profil Anak', path: '/profil-anak' },
    { icon: Activity, label: 'Riwayat Pemeriksaan', path: '/riwayat' },
    { icon: Calendar, label: 'Jadwal Posyandu', path: '/jadwal' },
    { icon: BookOpen, label: 'Edukasi Kesehatan', path: '/edukasi' }
  ];

  const menuItems = user?.role === 'kader' ? kaderMenuItems : orangtuaMenuItems;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="hidden lg:block fixed top-0 left-64 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 transition-colors duration-300">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user?.role === 'kader' && user?.posyandu && (
              <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                <Building2 className="text-pink-600 dark:text-pink-400" size={18} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Posyandu {user.posyandu}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
          >
            {theme === 'light' ? (
              <Moon className="text-gray-700 dark:text-gray-300" size={20} />
            ) : (
              <Sun className="text-yellow-400" size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 px-4 py-3 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
              <Baby className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 dark:text-gray-100">Smart Posyandu</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Posyandu Teratai 4 – {user?.role === 'kader' ? 'Kader' : 'Orang Tua'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800 text-white w-64 z-50 transition-all duration-300
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-pink-400/30 dark:border-pink-600/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Baby className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg">Smart Posyandu</h1>
              <p className="text-pink-100 dark:text-pink-200 text-sm">Posyandu Teratai 4</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <UserCircle size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.nama}</p>
                <p className="text-pink-100 dark:text-pink-200 text-xs capitalize">
                  {user?.role}
                  {user?.posyandu && ` - ${user.posyandu}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${
                    isActive
                      ? 'bg-white dark:bg-white/10 text-pink-600 dark:text-white shadow-lg scale-[1.02]'
                      : 'text-pink-50 dark:text-pink-100 hover:bg-white/10 hover:scale-[1.01]'
                  }
                `}
              >
                <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-pink-400/30 dark:border-pink-600/30 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-pink-50 dark:text-pink-100 hover:bg-red-500/20 hover:text-white transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-20">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
