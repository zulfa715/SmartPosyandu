# Smart Posyandu - Sistem Kesehatan Balita Digital

![Smart Posyandu](https://img.shields.io/badge/Smart-Posyandu-pink)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-38bdf8)

Aplikasi web modern untuk pencatatan dan pemantauan kesehatan balita sebagai pengganti **Buku KIA/Buku Pink** tradisional. Sistem ini memudahkan kader posyandu dan orang tua dalam memantau tumbuh kembang balita secara digital.

---

## 🌟 Fitur Utama

### Untuk Kader Posyandu
- ✅ Dashboard statistik lengkap
- ✅ CRUD data balita dan orang tua
- ✅ Input pemeriksaan kesehatan (BB, TB, LK)
- ✅ Grafik pertumbuhan balita
- ✅ Manajemen jadwal posyandu
- ✅ Export laporan ke PDF
- ✅ Pencarian data balita

### Untuk Orang Tua
- ✅ Dashboard kesehatan anak
- ✅ Lihat profil anak lengkap
- ✅ Riwayat pemeriksaan
- ✅ Grafik pertumbuhan anak
- ✅ Lihat jadwal posyandu
- ✅ Download profil kesehatan (PDF)
- ✅ View-only (tidak bisa edit data)

---

## 🎨 Tema Desain

Aplikasi ini menggunakan tema yang **ramah ibu dan anak** dengan warna dominan:

- **Soft Pink** (#F8C8DC) - Warna utama yang lembut
- **Peach Muda** (#FFD6CC) - Aksen hangat
- **Putih & Cream Pastel** - Background bersih
- **Desain Minimalis** - Modern dan mudah digunakan
- **Responsive** - Optimal di HP dan laptop

---

## 🚀 Teknologi

### Frontend
- **React 18.3.1** - Library UI modern
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **React Router 7** - Routing aplikasi
- **Recharts** - Grafik pertumbuhan
- **jsPDF** - Export PDF
- **Sonner** - Toast notifications
- **date-fns** - Date formatting

### Data Storage
- **localStorage** - Storage sementara (demo)
- **Context API** - State management

---

## 📦 Instalasi

### Prasyarat
- Node.js 18+ 
- pnpm (atau npm/yarn)

### Langkah Instalasi

1. Clone atau download project

2. Install dependencies:
```bash
pnpm install
```

3. Jalankan development server:
```bash
pnpm dev
```

4. Buka browser di `http://localhost:5173`

---

## 👤 Demo Login

### Kader Posyandu
- **Username:** `kader1`
- **Password:** `password123`
- **Akses:** Full CRUD, Input pemeriksaan, Kelola jadwal

### Orang Tua
- **Username:** `orangtua1`
- **Password:** `password123`
- **Akses:** View-only, Lihat data anak sendiri

---

## 📱 Halaman Aplikasi

### 1. Landing Page
Halaman utama dengan informasi tentang Smart Posyandu dan fitur-fiturnya.

### 2. Login Page
Login dengan role berbeda (Kader atau Orang Tua).

### 3. Dashboard Kader
- Statistik total balita
- Jumlah pemeriksaan bulan ini
- Jadwal posyandu terdekat
- Tabel pemeriksaan terbaru
- Quick actions

### 4. Dashboard Orang Tua
- Profil anak
- Statistik kesehatan terkini (BB, TB, LK)
- Grafik pertumbuhan interaktif
- Jadwal posyandu terdekat
- Riwayat pemeriksaan

### 5. Data Balita (Kader)
- Tabel data balita
- Search/filter balita
- Tambah balita baru + data orang tua
- Edit data balita
- Hapus data balita

### 6. Pemeriksaan (Kader)
- Input pemeriksaan baru
- Form lengkap: BB, TB, LK, Imunisasi, Vitamin, Keluhan, Diagnosa, Catatan
- Riwayat semua pemeriksaan
- Tabel sortir by tanggal

### 7. Jadwal Posyandu
- Kader: CRUD jadwal
- Orang Tua: View-only
- Jadwal mendatang vs riwayat
- Detail tanggal, waktu, lokasi

### 8. Laporan (Kader)
- Filter by balita
- Filter by tanggal
- Preview laporan
- Export PDF
- Print laporan

### 9. Profil Anak (Orang Tua)
- Detail lengkap anak
- Data orang tua
- Grafik pertumbuhan
- Download profil (PDF)

### 10. Riwayat Pemeriksaan (Orang Tua)
- Semua riwayat pemeriksaan anak
- Detail lengkap setiap pemeriksaan
- Download riwayat (PDF)

---

## 📊 Struktur Database

Lihat file `DATABASE_SCHEMA.md` untuk detail lengkap struktur database MySQL yang direkomendasikan.

### Tabel Utama
1. **users** - Data user (kader & orang tua)
2. **orang_tua** - Data orang tua balita
3. **balita** - Data balita
4. **pemeriksaan** - Data pemeriksaan kesehatan
5. **jadwal_posyandu** - Jadwal kegiatan posyandu
6. **imunisasi** (opsional) - Master data imunisasi

---

## 🗂️ Struktur Project

```
src/
├── app/
│   ├── components/
│   │   ├── Layout.tsx              # Layout dengan sidebar
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Context autentikasi
│   │   └── DataContext.tsx         # Context data management
│   ├── pages/
│   │   ├── LandingPage.tsx         # Halaman utama
│   │   ├── LoginPage.tsx           # Halaman login
│   │   ├── DashboardKader.tsx      # Dashboard kader
│   │   ├── DashboardOrangTua.tsx   # Dashboard orang tua
│   │   ├── DataBalita.tsx          # CRUD balita
│   │   ├── Pemeriksaan.tsx         # Input pemeriksaan
│   │   ├── JadwalPosyandu.tsx      # Manajemen jadwal
│   │   ├── Laporan.tsx             # Export laporan
│   │   ├── ProfilAnak.tsx          # Profil anak
│   │   └── RiwayatPemeriksaan.tsx  # Riwayat pemeriksaan
│   └── App.tsx                     # Root component + routing
└── styles/
    ├── theme.css                   # Custom theme
    └── fonts.css                   # Font imports
```

---

## 🔄 Migrasi ke Backend Real

Aplikasi ini menggunakan **localStorage** untuk demo. Untuk produksi:

### Opsi Backend

#### 1. Laravel (Recommended)
```bash
# Install Laravel
composer create-project laravel/laravel smart-posyandu-api

# Setup database di .env
# Buat migration dari DATABASE_SCHEMA.md
# Buat API Controller & Routes
# Implementasi JWT authentication
```

#### 2. Node.js + Express
```bash
# Install Express + Sequelize
npm init -y
npm install express sequelize mysql2 jsonwebtoken bcrypt

# Setup database connection
# Buat models dari DATABASE_SCHEMA.md
# Buat API routes
# Implementasi JWT authentication
```

#### 3. Supabase (No Backend Code)
- Buat project di Supabase
- Setup tabel sesuai schema
- Enable Row Level Security (RLS)
- Update frontend untuk pakai Supabase Client
- Implementasi Supabase Auth

### Frontend Changes
```typescript
// Ganti dari localStorage ke API
// Context: DataContext.tsx
const addBalita = async (data) => {
  const response = await fetch('/api/balita', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

---

## 📝 Fitur Tambahan (Roadmap)

- [ ] Notifikasi jadwal posyandu via email/WhatsApp
- [ ] Multi-bahasa (Indonesia & English)
- [ ] Dark mode
- [ ] Foto balita upload
- [ ] Curve WHO standard untuk grafik
- [ ] Export Excel
- [ ] SMS reminder
- [ ] Dashboard analytics untuk admin
- [ ] QR Code untuk check-in posyandu
- [ ] Mobile app (React Native)

---

## 🔒 Keamanan

### Demo Version (localStorage)
- Data tersimpan di browser
- Tidak cocok untuk produksi
- Tidak ada enkripsi

### Produksi (dengan Backend)
Implementasi keamanan yang disarankan:
- ✅ HTTPS only
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (Prepared statements)
- ✅ XSS prevention
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Data encryption (untuk NIK, dll)
- ✅ Regular backup
- ✅ Audit logging

---

## 📄 Lisensi

Aplikasi ini dibuat untuk keperluan edukasi dan pengembangan sistem posyandu.

**Catatan Penting:**
- Aplikasi ini TIDAK dirancang untuk menyimpan data kesehatan yang memerlukan compliance tingkat tinggi (HIPAA, dll)
- Untuk implementasi produksi, pastikan mengikuti regulasi privasi data kesehatan yang berlaku di Indonesia
- Konsultasikan dengan ahli keamanan dan legal sebelum deployment produksi

---

## 🤝 Kontribusi

Untuk pengembangan lebih lanjut:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

---

## 📞 Support

Untuk pertanyaan dan diskusi:
- Email: support@smartposyandu.id (contoh)
- GitHub Issues: [Link ke repo]

---

## 🙏 Acknowledgments

- Desain terinspirasi dari Buku KIA/Buku Pink tradisional
- Dibuat dengan ❤️ untuk kemajuan kesehatan balita Indonesia
- Terima kasih kepada semua kader posyandu yang berdedikasi

---

**Smart Posyandu** - Memudahkan Pemantauan Kesehatan Balita untuk Indonesia yang Lebih Sehat 🇮🇩
