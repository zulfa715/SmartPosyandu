import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import type { EdukasiKonten, EdukasiTipe } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen, Apple, Syringe, TrendingUp, Heart, Play, FileText, ArrowRight,
  Plus, Edit2, Trash2, X, ExternalLink, Youtube, Image as ImageIcon, Info, Link
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

const KATEGORI_OPTIONS = [
  { value: 'gizi', label: 'Gizi Balita', icon: Apple },
  { value: 'imunisasi', label: 'Imunisasi', icon: Syringe },
  { value: 'stunting', label: 'Pencegahan Stunting', icon: TrendingUp },
  { value: 'ibu-hamil', label: 'Ibu Hamil', icon: Heart },
  { value: 'tumbuh-kembang', label: 'Tumbuh Kembang', icon: BookOpen },
  { value: 'lainnya', label: 'Lainnya', icon: FileText }
];

const TIPE_OPTIONS: { value: EdukasiTipe; label: string; icon: React.ElementType }[] = [
  { value: 'artikel', label: 'Artikel / Link', icon: Link },
  { value: 'video', label: 'Video YouTube', icon: Youtube },
  { value: 'info', label: 'Informasi Teks', icon: Info },
  { value: 'gambar', label: 'Gambar', icon: ImageIcon },
  { value: 'pdf', label: 'File PDF', icon: FileText }
];

const EMPTY_FORM: Omit<EdukasiKonten, 'id' | 'dibuat_pada' | 'diperbarui_pada'> = {
  judul: '',
  kategori: 'gizi',
  deskripsi: '',
  tipe: 'info',
  link_youtube: '',
  link_artikel: '',
  url_gambar: '',
  url_pdf: '',
  isi_teks: ''
};

function getYouTubeEmbedId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function EdukasiKesehatan() {
  const { edukasi, addEdukasi, updateEdukasi, deleteEdukasi } = useData();
  const { user } = useAuth();
  const isKader = user?.role === 'kader';

  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<EdukasiKonten | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  const filtered = useMemo(() => {
    if (filterKategori === 'all') return edukasi;
    return edukasi.filter(e => e.kategori === filterKategori);
  }, [edukasi, filterKategori]);

  const openAdd = () => {
    setFormData({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: EdukasiKonten) => {
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      tipe: item.tipe,
      link_youtube: item.link_youtube ?? '',
      link_artikel: item.link_artikel ?? '',
      url_gambar: item.url_gambar ?? '',
      url_pdf: item.url_pdf ?? '',
      isi_teks: item.isi_teks ?? ''
    });
    setEditingId(item.id);
    setSelectedItem(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      link_youtube: formData.link_youtube || undefined,
      link_artikel: formData.link_artikel || undefined,
      url_gambar: formData.url_gambar || undefined,
      url_pdf: formData.url_pdf || undefined,
      isi_teks: formData.isi_teks || undefined
    };

    if (editingId) {
      updateEdukasi(editingId, payload);
      toast.success('Konten edukasi berhasil diperbarui');
    } else {
      addEdukasi(payload);
      toast.success('Konten edukasi berhasil ditambahkan');
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    deleteEdukasi(id);
    setDeleteConfirmId(null);
    if (selectedItem?.id === id) setSelectedItem(null);
    toast.success('Konten edukasi berhasil dihapus');
  };

  const getTipeIcon = (tipe: EdukasiTipe) => {
    const found = TIPE_OPTIONS.find(t => t.value === tipe);
    return found ? found.icon : FileText;
  };

  const getKategoriLabel = (kat: string) => {
    return KATEGORI_OPTIONS.find(k => k.value === kat)?.label ?? kat;
  };

  // Detail View
  if (selectedItem && !showForm) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedItem(null)}
          className="flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 font-medium transition-colors"
        >
          <ArrowRight size={20} className="rotate-180" />
          Kembali ke Daftar
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800 p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm mb-3">
                  {getKategoriLabel(selectedItem.kategori)}
                </span>
                <h1 className="text-2xl font-bold text-white">{selectedItem.judul}</h1>
                <p className="text-pink-100 mt-2 text-sm">
                  Diperbarui: {format(new Date(selectedItem.diperbarui_pada), 'd MMMM yyyy', { locale: id })}
                </p>
              </div>
              {isKader && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(selectedItem)}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(selectedItem.id)}
                    className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-lg">{selectedItem.deskripsi}</p>

            {selectedItem.tipe === 'video' && selectedItem.link_youtube && (
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Youtube className="text-red-600" size={20} /> Video Edukasi
                </h3>
                {(() => {
                  const vid = getYouTubeEmbedId(selectedItem.link_youtube);
                  return vid ? (
                    <div className="rounded-xl overflow-hidden aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${vid}`}
                        className="w-full h-full"
                        allowFullScreen
                        title={selectedItem.judul}
                      />
                    </div>
                  ) : (
                    <a
                      href={selectedItem.link_youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:underline"
                    >
                      <ExternalLink size={16} /> Buka Video di YouTube
                    </a>
                  );
                })()}
              </div>
            )}

            {selectedItem.tipe === 'gambar' && selectedItem.url_gambar && (
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Gambar Edukasi</h3>
                <img
                  src={selectedItem.url_gambar}
                  alt={selectedItem.judul}
                  className="rounded-xl max-w-full"
                />
              </div>
            )}

            {selectedItem.link_artikel && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Baca Artikel Lengkap</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-sm">{selectedItem.link_artikel}</p>
                </div>
                <a
                  href={selectedItem.link_artikel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <ExternalLink size={14} /> Buka
                </a>
              </div>
            )}

            {selectedItem.url_pdf && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">File PDF</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-sm">{selectedItem.url_pdf}</p>
                </div>
                <a
                  href={selectedItem.url_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <ExternalLink size={14} /> Buka PDF
                </a>
              </div>
            )}

            {selectedItem.isi_teks && (
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Informasi Kesehatan</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedItem.isi_teks}</p>
              </div>
            )}
          </div>
        </div>

        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Hapus Konten Edukasi?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Konten ini akan dihapus permanen dan tidak dapat dikembalikan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                  Batal
                </button>
                <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Edukasi Kesehatan</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isKader
              ? 'Kelola konten edukasi untuk orang tua – Posyandu Teratai 4'
              : 'Informasi dan artikel kesehatan ibu dan anak – Posyandu Teratai 4'}
          </p>
        </div>
        {isKader && (
          <button
            onClick={openAdd}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Plus size={20} />
            Tambah Edukasi
          </button>
        )}
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Pusat Informasi Kesehatan</h2>
            <p className="text-pink-100">
              {isKader
                ? 'Tambah, edit, dan hapus konten edukasi untuk orang tua di Posyandu Teratai 4'
                : 'Akses artikel, tips, dan video edukasi terpercaya untuk kesehatan ibu dan anak'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterKategori('all')}
          className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
            filterKategori === 'all'
              ? 'bg-pink-500 border-pink-500 text-white'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300 dark:hover:border-pink-600'
          }`}
        >
          Semua ({edukasi.length})
        </button>
        {KATEGORI_OPTIONS.map(kat => {
          const count = edukasi.filter(e => e.kategori === kat.value).length;
          if (!isKader && count === 0) return null;
          return (
            <button
              key={kat.value}
              onClick={() => setFilterKategori(kat.value)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                filterKategori === kat.value
                  ? 'bg-pink-500 border-pink-500 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300 dark:hover:border-pink-600'
              }`}
            >
              {kat.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => {
            const TipeIcon = getTipeIcon(item.tipe);
            const embedId = item.tipe === 'video' && item.link_youtube ? getYouTubeEmbedId(item.link_youtube) : null;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                {embedId ? (
                  <div className="relative h-44 bg-gray-900 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${embedId}/mqdefault.jpg`}
                      alt={item.judul}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="text-white ml-1" size={26} />
                      </div>
                    </div>
                  </div>
                ) : item.url_gambar ? (
                  <div className="h-44 overflow-hidden">
                    <img src={item.url_gambar} alt={item.judul} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-pink-200 to-peach-200 dark:from-pink-900 dark:to-orange-900 flex items-center justify-center">
                    <TipeIcon className="text-white opacity-70" size={64} />
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
                      {getKategoriLabel(item.kategori)}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium flex items-center gap-1">
                      <TipeIcon size={10} />
                      {TIPE_OPTIONS.find(t => t.value === item.tipe)?.label ?? item.tipe}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-pink-600">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                    {item.deskripsi}
                  </p>

                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="flex-1 flex items-center justify-center gap-2 text-pink-600 dark:text-pink-400 font-medium text-sm hover:text-pink-700 transition-colors"
                    >
                      Selengkapnya <ArrowRight size={14} />
                    </button>

                    {isKader && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          title="Edit"
                          className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          title="Hapus"
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <FileText className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="font-medium">Belum ada konten edukasi</p>
          {isKader && (
            <button onClick={openAdd} className="mt-3 text-pink-600 dark:text-pink-400 hover:underline font-medium">
              Tambah konten pertama
            </button>
          )}
        </div>
      )}

      {/* Disclaimer */}
      {!isKader && (
        <div className="bg-blue-50 dark:bg-gray-700 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Disclaimer</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Informasi dalam halaman ini bersifat edukatif dan tidak menggantikan konsultasi medis profesional.
            Untuk kondisi kesehatan spesifik, selalu konsultasikan dengan dokter, bidan, atau tenaga kesehatan terlatih di Posyandu Teratai 4.
          </p>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600 dark:text-red-400" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Hapus Konten Edukasi?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingId ? 'Edit Konten Edukasi' : 'Tambah Konten Edukasi'}
              </h2>
              <button onClick={closeForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Judul Edukasi *
                </label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Judul konten edukasi"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    {KATEGORI_OPTIONS.map(k => (
                      <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jenis Konten *
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={e => setFormData({ ...formData, tipe: e.target.value as EdukasiTipe })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    {TIPE_OPTIONS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi Singkat *
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={2}
                  placeholder="Deskripsi singkat konten ini"
                  required
                />
              </div>

              {(formData.tipe === 'video') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Youtube className="text-red-500" size={16} /> Link YouTube
                  </label>
                  <input
                    type="url"
                    value={formData.link_youtube}
                    onChange={e => setFormData({ ...formData, link_youtube: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              )}

              {(formData.tipe === 'artikel') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Link size={16} /> Link Artikel
                  </label>
                  <input
                    type="url"
                    value={formData.link_artikel}
                    onChange={e => setFormData({ ...formData, link_artikel: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="https://www.contoh-artikel-kesehatan.com/..."
                  />
                </div>
              )}

              {formData.tipe === 'gambar' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <ImageIcon size={16} /> URL Gambar
                  </label>
                  <input
                    type="url"
                    value={formData.url_gambar}
                    onChange={e => setFormData({ ...formData, url_gambar: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="https://contoh.com/gambar-edukasi.jpg"
                  />
                </div>
              )}

              {formData.tipe === 'pdf' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FileText size={16} /> URL File PDF
                  </label>
                  <input
                    type="url"
                    value={formData.url_pdf}
                    onChange={e => setFormData({ ...formData, url_pdf: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="https://contoh.com/dokumen.pdf"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Isi / Informasi Kesehatan
                </label>
                <textarea
                  value={formData.isi_teks}
                  onChange={e => setFormData({ ...formData, isi_teks: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={5}
                  placeholder="Tulis informasi kesehatan di sini. Bisa berupa tips, jadwal, panduan, dll."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  {editingId ? 'Perbarui Edukasi' : 'Simpan Edukasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
