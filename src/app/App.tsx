import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Toaster } from 'sonner';

import LandingPageNew from './pages/LandingPageNew';
import LoginPageNew from './pages/LoginPageNew';
import DashboardKader from './pages/DashboardKader';
import DashboardOrangTua from './pages/DashboardOrangTua';
import DataBalita from './pages/DataBalita';
import Pemeriksaan from './pages/Pemeriksaan';
import JadwalPosyandu from './pages/JadwalPosyandu';
import Laporan from './pages/Laporan';
import ProfilAnak from './pages/ProfilAnak';
import RiwayatPemeriksaan from './pages/RiwayatPemeriksaan';
import EdukasiKesehatan from './pages/EdukasiKesehatan';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === 'kader') {
    return <DashboardKader />;
  } else if (user?.role === 'orangtua') {
    return <DashboardOrangTua />;
  }

  return <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Toaster position="top-right" richColors />
            <Routes>
              <Route path="/" element={<LandingPageNew />} />
              <Route path="/login" element={<LoginPageNew />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardRouter />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/balita"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DataBalita />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pemeriksaan"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Pemeriksaan />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/jadwal"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <JadwalPosyandu />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/laporan"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Laporan />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profil-anak"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilAnak />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/riwayat"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <RiwayatPemeriksaan />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edukasi"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EdukasiKesehatan />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}