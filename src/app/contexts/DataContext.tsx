import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OrangTua {
  id: string;
  nama_ayah: string;
  nama_ibu: string;
  alamat: string;
  telepon: string;
  user_id?: string;
}

export interface Balita {
  id: string;
  nama: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  orangtua_id: string;
  foto?: string;
  nik_anak?: string;
  no_kk?: string;
  bbl?: number;
  tbl?: number;
  anak_ke?: number;
}

export interface Pemeriksaan {
  id: string;
  balita_id: string;
  tanggal: string;
  berat_badan: number;
  tinggi_badan: number;
  lingkar_kepala: number;
  lingkar_lengan?: number;
  umur_bulan?: number;
  status_bb?: 'N' | 'T' | 'O';
  keluhan?: string;
  diagnosa?: string;
  catatan?: string;
  imunisasi?: string;
  vitamin?: string;
}

export interface JadwalPosyandu {
  id: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  keterangan?: string;
}

export type EdukasiTipe = 'artikel' | 'video' | 'pdf' | 'gambar' | 'info';

export interface EdukasiKonten {
  id: string;
  judul: string;
  kategori: string;
  deskripsi: string;
  tipe: EdukasiTipe;
  link_youtube?: string;
  link_artikel?: string;
  url_gambar?: string;
  url_pdf?: string;
  isi_teks?: string;
  dibuat_pada: string;
  diperbarui_pada: string;
}

interface DataContextType {
  orangtua: OrangTua[];
  balita: Balita[];
  pemeriksaan: Pemeriksaan[];
  jadwal: JadwalPosyandu[];
  edukasi: EdukasiKonten[];
  addOrangTua: (data: Omit<OrangTua, 'id'>) => void;
  updateOrangTua: (id: string, data: Partial<OrangTua>) => void;
  deleteOrangTua: (id: string) => void;
  addBalita: (data: Omit<Balita, 'id'>) => void;
  updateBalita: (id: string, data: Partial<Balita>) => void;
  deleteBalita: (id: string) => void;
  addPemeriksaan: (data: Omit<Pemeriksaan, 'id'>) => void;
  updatePemeriksaan: (id: string, data: Partial<Pemeriksaan>) => void;
  deletePemeriksaan: (id: string) => void;
  addJadwal: (data: Omit<JadwalPosyandu, 'id'>) => void;
  updateJadwal: (id: string, data: Partial<JadwalPosyandu>) => void;
  deleteJadwal: (id: string) => void;
  addEdukasi: (data: Omit<EdukasiKonten, 'id' | 'dibuat_pada' | 'diperbarui_pada'>) => void;
  updateEdukasi: (id: string, data: Partial<EdukasiKonten>) => void;
  deleteEdukasi: (id: string) => void;
  getBalitaByOrangTua: (orangtuaId: string) => Balita[];
  getPemeriksaanByBalita: (balitaId: string) => Pemeriksaan[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  orangtua: 'smart_posyandu_orangtua',
  balita: 'smart_posyandu_balita',
  pemeriksaan: 'smart_posyandu_pemeriksaan',
  jadwal: 'smart_posyandu_jadwal',
  edukasi: 'smart_posyandu_edukasi'
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orangtua, setOrangTua] = useState<OrangTua[]>([]);
  const [balita, setBalita] = useState<Balita[]>([]);
  const [pemeriksaan, setPemeriksaan] = useState<Pemeriksaan[]>([]);
  const [jadwal, setJadwal] = useState<JadwalPosyandu[]>([]);
  const [edukasi, setEdukasi] = useState<EdukasiKonten[]>([]);

  useEffect(() => {
    const loadedOrangTua = localStorage.getItem(STORAGE_KEYS.orangtua);
    const loadedBalita = localStorage.getItem(STORAGE_KEYS.balita);
    const loadedPemeriksaan = localStorage.getItem(STORAGE_KEYS.pemeriksaan);
    const loadedJadwal = localStorage.getItem(STORAGE_KEYS.jadwal);
    const loadedEdukasi = localStorage.getItem(STORAGE_KEYS.edukasi);

    if (loadedOrangTua) setOrangTua(JSON.parse(loadedOrangTua));
    if (loadedBalita) setBalita(JSON.parse(loadedBalita));
    if (loadedPemeriksaan) setPemeriksaan(JSON.parse(loadedPemeriksaan));
    if (loadedJadwal) setJadwal(JSON.parse(loadedJadwal));
    if (loadedEdukasi) setEdukasi(JSON.parse(loadedEdukasi));

    if (!loadedOrangTua || !loadedBalita || !loadedPemeriksaan || !loadedJadwal || !loadedEdukasi) {
      initializeSampleData(
        !!loadedOrangTua,
        !!loadedBalita,
        !!loadedPemeriksaan,
        !!loadedJadwal,
        !!loadedEdukasi
      );
    }
  }, []);

  const initializeSampleData = (
    hasOrangTua: boolean,
    hasBalita: boolean,
    hasPemeriksaan: boolean,
    hasJadwal: boolean,
    hasEdukasi: boolean
  ) => {
    if (!hasOrangTua) {
      const sampleOrangTua: OrangTua[] = [
        {
          id: 'ot1',
          nama_ayah: 'Ahmad Dahlan',
          nama_ibu: 'Sulastri',
          alamat: 'Jl. Melati No. 123, Jakarta',
          telepon: '081234567890',
          user_id: 'ot1'
        },
        {
          id: 'ot2',
          nama_ayah: 'Budi Santoso',
          nama_ibu: 'Wulandari',
          alamat: 'Jl. Mawar No. 45, Jakarta',
          telepon: '081298765432',
          user_id: 'ot2'
        }
      ];
      setOrangTua(sampleOrangTua);
      localStorage.setItem(STORAGE_KEYS.orangtua, JSON.stringify(sampleOrangTua));
    }

    if (!hasBalita) {
      const sampleBalita: Balita[] = [
        {
          id: 'b1',
          nama: 'Aisyah Putri Dahlan',
          tanggal_lahir: '2023-03-15',
          jenis_kelamin: 'P',
          orangtua_id: 'ot1',
          nik_anak: '3175012345670001',
          no_kk: '3175010101010001',
          bbl: 3.2,
          tbl: 49,
          anak_ke: 1
        },
        {
          id: 'b2',
          nama: 'Muhammad Rizki Santoso',
          tanggal_lahir: '2022-08-20',
          jenis_kelamin: 'L',
          orangtua_id: 'ot2',
          nik_anak: '3175012345670002',
          no_kk: '3175010101010002',
          bbl: 3.5,
          tbl: 51,
          anak_ke: 2
        }
      ];
      setBalita(sampleBalita);
      localStorage.setItem(STORAGE_KEYS.balita, JSON.stringify(sampleBalita));
    }

    if (!hasPemeriksaan) {
      const samplePemeriksaan: Pemeriksaan[] = [
        {
          id: 'p1',
          balita_id: 'b1',
          tanggal: '2026-01-15',
          berat_badan: 12.5,
          tinggi_badan: 85,
          lingkar_kepala: 46,
          lingkar_lengan: 15.5,
          umur_bulan: 34,
          status_bb: 'N',
          imunisasi: 'DPT 3',
          vitamin: 'Vitamin A',
          catatan: 'Perkembangan baik'
        },
        {
          id: 'p2',
          balita_id: 'b1',
          tanggal: '2026-02-15',
          berat_badan: 12.8,
          tinggi_badan: 86,
          lingkar_kepala: 46.5,
          lingkar_lengan: 15.8,
          umur_bulan: 35,
          status_bb: 'N',
          vitamin: 'Vitamin A',
          catatan: 'Nafsu makan baik'
        },
        {
          id: 'p3',
          balita_id: 'b1',
          tanggal: '2026-03-15',
          berat_badan: 13.2,
          tinggi_badan: 87.5,
          lingkar_kepala: 47,
          lingkar_lengan: 16.0,
          umur_bulan: 36,
          status_bb: 'N',
          catatan: 'Sehat'
        },
        {
          id: 'p4',
          balita_id: 'b2',
          tanggal: '2026-01-10',
          berat_badan: 14.5,
          tinggi_badan: 92,
          lingkar_kepala: 48,
          lingkar_lengan: 16.5,
          umur_bulan: 41,
          status_bb: 'N',
          imunisasi: 'Campak',
          catatan: 'Aktif dan sehat'
        }
      ];
      setPemeriksaan(samplePemeriksaan);
      localStorage.setItem(STORAGE_KEYS.pemeriksaan, JSON.stringify(samplePemeriksaan));
    }

    if (!hasJadwal) {
      const sampleJadwal: JadwalPosyandu[] = [
        {
          id: 'j1',
          tanggal: '2026-06-15',
          waktu: '08:00 - 12:00',
          lokasi: 'Balai RW 05, Kelurahan Melati',
          keterangan: 'Pemeriksaan rutin dan imunisasi'
        },
        {
          id: 'j2',
          tanggal: '2026-07-20',
          waktu: '08:00 - 12:00',
          lokasi: 'Balai RW 05, Kelurahan Melati',
          keterangan: 'Pemeriksaan rutin dan pemberian vitamin A'
        }
      ];
      setJadwal(sampleJadwal);
      localStorage.setItem(STORAGE_KEYS.jadwal, JSON.stringify(sampleJadwal));
    }

    if (!hasEdukasi) {
      const now = new Date().toISOString();
      const sampleEdukasi: EdukasiKonten[] = [
        {
          id: 'e1',
          judul: 'Menu MPASI Bergizi untuk Bayi 6-12 Bulan',
          kategori: 'gizi',
          deskripsi: 'Panduan lengkap memberikan MPASI yang tepat untuk bayi Anda mulai usia 6 bulan.',
          tipe: 'artikel',
          link_artikel: 'https://www.who.int/news-room/fact-sheets/detail/complementary-feeding',
          isi_teks: 'Makanan Pendamping ASI (MPASI) yang tepat sangat penting untuk tumbuh kembang bayi. Mulai dari bubur halus hingga makanan lembut yang bervariasi. Pastikan MPASI mengandung zat gizi makro dan mikro yang cukup.',
          dibuat_pada: now,
          diperbarui_pada: now
        },
        {
          id: 'e2',
          judul: 'Jadwal Imunisasi Lengkap 0-5 Tahun',
          kategori: 'imunisasi',
          deskripsi: 'Jadwal imunisasi dasar yang wajib untuk melindungi buah hati dari penyakit berbahaya.',
          tipe: 'info',
          isi_teks: 'Imunisasi melindungi anak dari penyakit berbahaya. Jadwal: 0 bln: HB-0 | 1 bln: BCG+Polio 1 | 2 bln: DPT-HB-Hib 1+Polio 2 | 3 bln: DPT-HB-Hib 2+Polio 3 | 4 bln: DPT-HB-Hib 3+Polio 4 | 9 bln: Campak/MR | 18 bln: DPT-HB-Hib 4+Campak/MR 2',
          dibuat_pada: now,
          diperbarui_pada: now
        },
        {
          id: 'e3',
          judul: 'Cara Mencegah Stunting Sejak Dini',
          kategori: 'stunting',
          deskripsi: 'Langkah penting mencegah stunting pada anak Indonesia sejak masa kehamilan.',
          tipe: 'video',
          link_youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          isi_teks: 'Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis. Pencegahan harus dimulai sejak kehamilan dengan memastikan nutrisi ibu terpenuhi, ASI eksklusif 6 bulan, dan MPASI bergizi.',
          dibuat_pada: now,
          diperbarui_pada: now
        },
        {
          id: 'e4',
          judul: 'Nutrisi Penting untuk Ibu Hamil',
          kategori: 'ibu-hamil',
          deskripsi: 'Panduan nutrisi lengkap selama masa kehamilan untuk kesehatan ibu dan janin.',
          tipe: 'artikel',
          link_artikel: 'https://www.kemkes.go.id/',
          isi_teks: 'Gizi ibu hamil sangat menentukan kesehatan bayi. Pastikan asupan asam folat, zat besi, kalsium, protein, dan omega-3 terpenuhi. Minum air putih minimal 8 gelas per hari.',
          dibuat_pada: now,
          diperbarui_pada: now
        },
        {
          id: 'e5',
          judul: 'Tanda-Tanda Gizi Buruk pada Balita',
          kategori: 'gizi',
          deskripsi: 'Deteksi dini gizi buruk untuk penanganan cepat dan tepat.',
          tipe: 'info',
          isi_teks: 'Kenali tanda gizi buruk: berat badan tidak naik/turun, LILA kurang dari standar, anak kurus dan lemas, rambut mudah rontok dan kusam, kulit kering dan bersisik, perut buncit namun kaki dan tangan kurus, mudah sakit.',
          dibuat_pada: now,
          diperbarui_pada: now
        },
        {
          id: 'e6',
          judul: 'Stimulasi Tumbuh Kembang Anak',
          kategori: 'tumbuh-kembang',
          deskripsi: 'Cara menstimulasi tumbuh kembang anak usia 0-5 tahun secara optimal.',
          tipe: 'video',
          link_youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          isi_teks: 'Stimulasi tumbuh kembang meliputi stimulasi motorik kasar, motorik halus, kognitif, bahasa, dan sosial-emosional. Lakukan setiap hari melalui bermain bersama anak.',
          dibuat_pada: now,
          diperbarui_pada: now
        }
      ];
      setEdukasi(sampleEdukasi);
      localStorage.setItem(STORAGE_KEYS.edukasi, JSON.stringify(sampleEdukasi));
    }
  };

  const addOrangTua = (data: Omit<OrangTua, 'id'>) => {
    const newOrangTua = { ...data, id: Date.now().toString() };
    const updated = [...orangtua, newOrangTua];
    setOrangTua(updated);
    localStorage.setItem(STORAGE_KEYS.orangtua, JSON.stringify(updated));
  };

  const updateOrangTua = (id: string, data: Partial<OrangTua>) => {
    const updated = orangtua.map(item => (item.id === id ? { ...item, ...data } : item));
    setOrangTua(updated);
    localStorage.setItem(STORAGE_KEYS.orangtua, JSON.stringify(updated));
  };

  const deleteOrangTua = (id: string) => {
    const updated = orangtua.filter(item => item.id !== id);
    setOrangTua(updated);
    localStorage.setItem(STORAGE_KEYS.orangtua, JSON.stringify(updated));
  };

  const addBalita = (data: Omit<Balita, 'id'>) => {
    const newBalita = { ...data, id: Date.now().toString() };
    const updated = [...balita, newBalita];
    setBalita(updated);
    localStorage.setItem(STORAGE_KEYS.balita, JSON.stringify(updated));
  };

  const updateBalita = (id: string, data: Partial<Balita>) => {
    const updated = balita.map(item => (item.id === id ? { ...item, ...data } : item));
    setBalita(updated);
    localStorage.setItem(STORAGE_KEYS.balita, JSON.stringify(updated));
  };

  const deleteBalita = (id: string) => {
    const updated = balita.filter(item => item.id !== id);
    setBalita(updated);
    localStorage.setItem(STORAGE_KEYS.balita, JSON.stringify(updated));
  };

  const addPemeriksaan = (data: Omit<Pemeriksaan, 'id'>) => {
    const newPemeriksaan = { ...data, id: Date.now().toString() };
    const updated = [...pemeriksaan, newPemeriksaan];
    setPemeriksaan(updated);
    localStorage.setItem(STORAGE_KEYS.pemeriksaan, JSON.stringify(updated));
  };

  const updatePemeriksaan = (id: string, data: Partial<Pemeriksaan>) => {
    const updated = pemeriksaan.map(item => (item.id === id ? { ...item, ...data } : item));
    setPemeriksaan(updated);
    localStorage.setItem(STORAGE_KEYS.pemeriksaan, JSON.stringify(updated));
  };

  const deletePemeriksaan = (id: string) => {
    const updated = pemeriksaan.filter(item => item.id !== id);
    setPemeriksaan(updated);
    localStorage.setItem(STORAGE_KEYS.pemeriksaan, JSON.stringify(updated));
  };

  const addJadwal = (data: Omit<JadwalPosyandu, 'id'>) => {
    const newJadwal = { ...data, id: Date.now().toString() };
    const updated = [...jadwal, newJadwal];
    setJadwal(updated);
    localStorage.setItem(STORAGE_KEYS.jadwal, JSON.stringify(updated));
  };

  const updateJadwal = (id: string, data: Partial<JadwalPosyandu>) => {
    const updated = jadwal.map(item => (item.id === id ? { ...item, ...data } : item));
    setJadwal(updated);
    localStorage.setItem(STORAGE_KEYS.jadwal, JSON.stringify(updated));
  };

  const deleteJadwal = (id: string) => {
    const updated = jadwal.filter(item => item.id !== id);
    setJadwal(updated);
    localStorage.setItem(STORAGE_KEYS.jadwal, JSON.stringify(updated));
  };

  const addEdukasi = (data: Omit<EdukasiKonten, 'id' | 'dibuat_pada' | 'diperbarui_pada'>) => {
    const now = new Date().toISOString();
    const newEdukasi: EdukasiKonten = { ...data, id: Date.now().toString(), dibuat_pada: now, diperbarui_pada: now };
    const updated = [...edukasi, newEdukasi];
    setEdukasi(updated);
    localStorage.setItem(STORAGE_KEYS.edukasi, JSON.stringify(updated));
  };

  const updateEdukasi = (id: string, data: Partial<EdukasiKonten>) => {
    const now = new Date().toISOString();
    const updated = edukasi.map(item =>
      item.id === id ? { ...item, ...data, diperbarui_pada: now } : item
    );
    setEdukasi(updated);
    localStorage.setItem(STORAGE_KEYS.edukasi, JSON.stringify(updated));
  };

  const deleteEdukasi = (id: string) => {
    const updated = edukasi.filter(item => item.id !== id);
    setEdukasi(updated);
    localStorage.setItem(STORAGE_KEYS.edukasi, JSON.stringify(updated));
  };

  const getBalitaByOrangTua = (orangtuaId: string) => {
    return balita.filter(b => b.orangtua_id === orangtuaId);
  };

  const getPemeriksaanByBalita = (balitaId: string) => {
    return pemeriksaan.filter(p => p.balita_id === balitaId).sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
  };

  return (
    <DataContext.Provider
      value={{
        orangtua,
        balita,
        pemeriksaan,
        jadwal,
        edukasi,
        addOrangTua,
        updateOrangTua,
        deleteOrangTua,
        addBalita,
        updateBalita,
        deleteBalita,
        addPemeriksaan,
        updatePemeriksaan,
        deletePemeriksaan,
        addJadwal,
        updateJadwal,
        deleteJadwal,
        addEdukasi,
        updateEdukasi,
        deleteEdukasi,
        getBalitaByOrangTua,
        getPemeriksaanByBalita
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
