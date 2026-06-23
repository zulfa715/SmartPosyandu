# Database Schema - Smart Posyandu

Dokumentasi struktur database untuk aplikasi Smart Posyandu.

## Tabel Users

Tabel untuk menyimpan data user (Kader dan Orang Tua).

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('kader', 'orangtua') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Kolom:**
- `id`: Primary key (UUID)
- `username`: Username untuk login (unique)
- `password`: Password terenkripsi (gunakan bcrypt atau hash lain)
- `nama`: Nama lengkap user
- `email`: Email user (opsional)
- `role`: Role user (kader atau orangtua)
- `created_at`: Timestamp pembuatan data
- `updated_at`: Timestamp update terakhir

---

## Tabel Orang Tua

Tabel untuk menyimpan data orang tua balita.

```sql
CREATE TABLE orang_tua (
    id VARCHAR(36) PRIMARY KEY,
    nama_ayah VARCHAR(100) NOT NULL,
    nama_ibu VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    user_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Kolom:**
- `id`: Primary key (UUID)
- `nama_ayah`: Nama ayah
- `nama_ibu`: Nama ibu
- `alamat`: Alamat lengkap keluarga
- `telepon`: Nomor telepon
- `user_id`: Foreign key ke tabel users (untuk login orang tua)
- `created_at`: Timestamp pembuatan data
- `updated_at`: Timestamp update terakhir

**Relasi:**
- One-to-One dengan `users` (opsional)
- One-to-Many dengan `balita`

---

## Tabel Balita

Tabel untuk menyimpan data balita.

```sql
CREATE TABLE balita (
    id VARCHAR(36) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    nik VARCHAR(16),
    orangtua_id VARCHAR(36) NOT NULL,
    foto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orangtua_id) REFERENCES orang_tua(id) ON DELETE CASCADE
);
```

**Kolom:**
- `id`: Primary key (UUID)
- `nama`: Nama lengkap balita
- `tanggal_lahir`: Tanggal lahir balita
- `jenis_kelamin`: L (Laki-laki) atau P (Perempuan)
- `nik`: Nomor Induk Kependudukan (opsional)
- `orangtua_id`: Foreign key ke tabel orang_tua
- `foto`: Path/URL foto balita (opsional)
- `created_at`: Timestamp pembuatan data
- `updated_at`: Timestamp update terakhir

**Relasi:**
- Many-to-One dengan `orang_tua`
- One-to-Many dengan `pemeriksaan`

**Index:**
```sql
CREATE INDEX idx_balita_orangtua ON balita(orangtua_id);
CREATE INDEX idx_balita_nik ON balita(nik);
```

---

## Tabel Pemeriksaan

Tabel untuk menyimpan data pemeriksaan kesehatan balita.

```sql
CREATE TABLE pemeriksaan (
    id VARCHAR(36) PRIMARY KEY,
    balita_id VARCHAR(36) NOT NULL,
    tanggal DATE NOT NULL,
    berat_badan DECIMAL(5,2) NOT NULL,
    tinggi_badan DECIMAL(5,2) NOT NULL,
    lingkar_kepala DECIMAL(5,2) NOT NULL,
    keluhan TEXT,
    diagnosa TEXT,
    catatan TEXT,
    imunisasi VARCHAR(100),
    vitamin VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (balita_id) REFERENCES balita(id) ON DELETE CASCADE
);
```

**Kolom:**
- `id`: Primary key (UUID)
- `balita_id`: Foreign key ke tabel balita
- `tanggal`: Tanggal pemeriksaan
- `berat_badan`: Berat badan dalam kg (contoh: 12.50)
- `tinggi_badan`: Tinggi badan dalam cm (contoh: 85.00)
- `lingkar_kepala`: Lingkar kepala dalam cm (contoh: 46.00)
- `keluhan`: Keluhan yang disampaikan orang tua (opsional)
- `diagnosa`: Diagnosa dari kader/tenaga kesehatan (opsional)
- `catatan`: Catatan tambahan (opsional)
- `imunisasi`: Jenis imunisasi yang diberikan (opsional)
- `vitamin`: Jenis vitamin yang diberikan (opsional)
- `created_at`: Timestamp pembuatan data
- `updated_at`: Timestamp update terakhir

**Relasi:**
- Many-to-One dengan `balita`

**Index:**
```sql
CREATE INDEX idx_pemeriksaan_balita ON pemeriksaan(balita_id);
CREATE INDEX idx_pemeriksaan_tanggal ON pemeriksaan(tanggal);
```

---

## Tabel Jadwal Posyandu

Tabel untuk menyimpan jadwal kegiatan posyandu.

```sql
CREATE TABLE jadwal_posyandu (
    id VARCHAR(36) PRIMARY KEY,
    tanggal DATE NOT NULL,
    waktu VARCHAR(50) NOT NULL,
    lokasi VARCHAR(200) NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Kolom:**
- `id`: Primary key (UUID)
- `tanggal`: Tanggal jadwal posyandu
- `waktu`: Waktu pelaksanaan (contoh: "08:00 - 12:00")
- `lokasi`: Lokasi pelaksanaan
- `keterangan`: Keterangan tambahan (opsional)
- `created_at`: Timestamp pembuatan data
- `updated_at`: Timestamp update terakhir

**Index:**
```sql
CREATE INDEX idx_jadwal_tanggal ON jadwal_posyandu(tanggal);
```

---

## Tabel Imunisasi (Opsional - untuk tracking detail)

Tabel untuk menyimpan master data jenis imunisasi.

```sql
CREATE TABLE imunisasi (
    id VARCHAR(36) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    usia_bulan_min INT,
    usia_bulan_max INT,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
- `id`: Primary key (UUID)
- `nama`: Nama imunisasi (contoh: "BCG", "DPT 1", "Campak")
- `usia_bulan_min`: Usia minimal pemberian (dalam bulan)
- `usia_bulan_max`: Usia maksimal pemberian (dalam bulan)
- `deskripsi`: Deskripsi/keterangan imunisasi
- `created_at`: Timestamp pembuatan data

---

## Relasi Antar Tabel

```
users (1) -----> (0..1) orang_tua
orang_tua (1) -----> (0..*) balita
balita (1) -----> (0..*) pemeriksaan
```

**Penjelasan:**
1. Satu user (role=orangtua) dapat memiliki 0 atau 1 data di tabel orang_tua
2. Satu orang_tua dapat memiliki banyak balita
3. Satu balita dapat memiliki banyak pemeriksaan
4. Jadwal posyandu bersifat independent (tidak berelasi dengan tabel lain)

---

## Sample Data

### Users
```sql
INSERT INTO users (id, username, password, nama, email, role) VALUES
('1', 'kader1', '$2a$10$...', 'Ibu Siti Aminah', 'siti@posyandu.id', 'kader'),
('2', 'orangtua1', '$2a$10$...', 'Bapak Ahmad Dahlan', 'ahmad@email.com', 'orangtua');
```

### Orang Tua
```sql
INSERT INTO orang_tua (id, nama_ayah, nama_ibu, alamat, telepon, user_id) VALUES
('ot1', 'Ahmad Dahlan', 'Siti Nurhaliza', 'Jl. Melati No. 123, Jakarta', '081234567890', '2');
```

### Balita
```sql
INSERT INTO balita (id, nama, tanggal_lahir, jenis_kelamin, nik, orangtua_id) VALUES
('b1', 'Aisyah Putri Dahlan', '2023-03-15', 'P', '3175012345670001', 'ot1');
```

### Pemeriksaan
```sql
INSERT INTO pemeriksaan (id, balita_id, tanggal, berat_badan, tinggi_badan, lingkar_kepala, imunisasi, vitamin, catatan) VALUES
('p1', 'b1', '2026-01-15', 12.5, 85.0, 46.0, 'DPT 3', 'Vitamin A', 'Perkembangan baik');
```

### Jadwal Posyandu
```sql
INSERT INTO jadwal_posyandu (id, tanggal, waktu, lokasi, keterangan) VALUES
('j1', '2026-05-20', '08:00 - 12:00', 'Balai RW 05, Kelurahan Melati', 'Pemeriksaan rutin dan imunisasi');
```

---

## Normalisasi Database

Database ini sudah mengikuti prinsip normalisasi:

1. **1NF (First Normal Form)**: Semua kolom berisi nilai atomic (tidak ada array atau data nested)
2. **2NF (Second Normal Form)**: Tidak ada partial dependency (semua atribut non-key bergantung penuh pada primary key)
3. **3NF (Third Normal Form)**: Tidak ada transitive dependency (tidak ada atribut non-key yang bergantung pada atribut non-key lain)

---

## Keamanan Database

Untuk implementasi produksi, pastikan:

1. **Password Hashing**: Gunakan bcrypt atau argon2 untuk hash password
2. **Input Validation**: Validasi semua input untuk mencegah SQL Injection
3. **Prepared Statements**: Gunakan prepared statements/parameterized queries
4. **Role-Based Access Control**: Implementasi RBAC untuk membatasi akses data
5. **Encryption**: Enkripsi data sensitif (NIK, dll) jika diperlukan
6. **Backup**: Lakukan backup database secara berkala
7. **Audit Trail**: Pertimbangkan menambahkan tabel audit untuk tracking perubahan data

---

## Migrasi dari localStorage ke Database

Aplikasi ini saat ini menggunakan localStorage. Untuk migrasi ke database MySQL/PostgreSQL:

1. Install backend framework (Laravel/Node.js/CodeIgniter)
2. Setup koneksi database
3. Jalankan migration file untuk membuat tabel
4. Implementasi API endpoints untuk CRUD
5. Update frontend untuk consume API instead of localStorage
6. Implementasi autentikasi dengan JWT atau session

---

## Teknologi Backend yang Disarankan

### Laravel (PHP)
- Eloquent ORM untuk query builder
- Built-in authentication
- Migration dan seeding
- API Resource untuk response formatting

### Node.js + Express
- Sequelize/Prisma ORM
- JWT authentication
- Knex untuk migration
- Easy to integrate dengan React

### CodeIgniter 4 (PHP)
- Query Builder
- Model dengan validation
- RESTful API support
- Lightweight dan cepat
