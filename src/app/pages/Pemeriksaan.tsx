import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import type { Pemeriksaan as PemeriksaanType } from '../contexts/DataContext';
import { Plus, X, Activity, Edit2, Trash2, Eye, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

type ModalMode = 'add' | 'edit' | 'detail';

const EMPTY_FORM = {
  balita_id: '',
  tanggal: format(new Date(), 'yyyy-MM-dd'),
  berat_badan: '',
  tinggi_badan: '',
  lingkar_kepala: '',
  lingkar_lengan: '',
  umur_bulan: '',
  status_bb: '' as '' | 'N' | 'T' | 'O',
  keluhan: '',
  diagnosa: '',
  catatan: '',
  imunisasi: '',
  vitamin: ''
};

export default function Pemeriksaan() {
  const { balita, pemeriksaan, addPemeriksaan, updatePemeriksaan, deletePemeriksaan } = useData();
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const pemeriksaanList = pemeriksaan
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .map(p => ({
      ...p,
      balita: balita.find(b => b.id === p.balita_id)
    }));

  const openAdd = () => {
    setFormData({ ...EMPTY_FORM, tanggal: format(new Date(), 'yyyy-MM-dd') });
    setSelectedId(null);
    setModalMode('add');
  };

  const openEdit = (p: PemeriksaanType) => {
    setFormData({
      balita_id: p.balita_id,
      tanggal: p.tanggal,
      berat_badan: String(p.berat_badan),
      tinggi_badan: String(p.tinggi_badan),
      lingkar_kepala: String(p.lingkar_kepala),
      lingkar_lengan: p.lingkar_lengan != null ? String(p.lingkar_lengan) : '',
      umur_bulan: p.umur_bulan != null ? String(p.umur_bulan) : '',
      status_bb: p.status_bb ?? '',
      keluhan: p.keluhan ?? '',
      diagnosa: p.diagnosa ?? '',
      catatan: p.catatan ?? '',
      imunisasi: p.imunisasi ?? '',
      vitamin: p.vitamin ?? ''
    });
    setSelectedId(p.id);
    setModalMode('edit');
  };

  const openDetail = (p: PemeriksaanType) => {
    setSelectedId(p.id);
    setModalMode('detail');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      balita_id: formData.balita_id,
      tanggal: formData.tanggal,
      berat_badan: parseFloat(formData.berat_badan),
      tinggi_badan: parseFloat(formData.tinggi_badan),
      lingkar_kepala: parseFloat(formData.lingkar_kepala),
      lingkar_lengan: formData.lingkar_lengan ? parseFloat(formData.lingkar_lengan) : undefined,
      umur_bulan: formData.umur_bulan ? parseInt(formData.umur_bulan) : undefined,
      status_bb: (formData.status_bb || undefined) as 'N' | 'T' | 'O' | undefined,
      keluhan: formData.keluhan || undefined,
      diagnosa: formData.diagnosa || undefined,
      catatan: formData.catatan || undefined,
      imunisasi: formData.imunisasi || undefined,
      vitamin: formData.vitamin || undefined
    };

    if (modalMode === 'add') {
      addPemeriksaan(payload);
      toast.success('Data pemeriksaan berhasil ditambahkan');
    } else if (modalMode === 'edit' && selectedId) {
      updatePemeriksaan(selectedId, payload);
      toast.success('Data pemeriksaan berhasil diperbarui');
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    deletePemeriksaan(id);
    setDeleteConfirmId(null);
    toast.success('Data pemeriksaan berhasil dihapus');
  };

  const selectedPemeriksaan = selectedId
    ? pemeriksaan.find(p => p.id === selectedId)
    : null;

  const selectedBalitaDetail = selectedPemeriksaan
    ? balita.find(b => b.id === selectedPemeriksaan.balita_id)
    : null;

  const StatusBadge = ({ status }: { status?: 'N' | 'T' | 'O' }) => {
    if (status === 'N') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
        <ArrowUp size={12} /> Naik (N)
      </span>
    );
    if (status === 'T') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
        <ArrowDown size={12} /> Turun (T)
      </span>
    );
    if (status === 'O') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs font-medium">
        <Minus size={12} /> Tidak Ada (O)
      </span>
    );
    return <span className="text-gray-400 text-xs">-</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Pemeriksaan Balita</h1>
          <p className="text-gray-600 dark:text-gray-400">Posyandu Teratai 4 – Kelola data pemeriksaan</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Input Pemeriksaan
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Riwayat Pemeriksaan</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Semua data pemeriksaan balita</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Tanggal', 'Nama Balita', 'Umur', 'BB (kg)', 'TB (cm)', 'LK (cm)', 'LILA (cm)', 'Status BB', 'Imunisasi', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pemeriksaanList.length > 0 ? (
                pemeriksaanList.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {format(new Date(p.tanggal), 'd MMM yyyy', { locale: id })}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.balita?.nama ?? '-'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {p.balita?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {p.umur_bulan != null ? `${p.umur_bulan} bln` : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {p.berat_badan}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {p.tinggi_badan}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {p.lingkar_kepala}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {p.lingkar_lengan ?? '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={p.status_bb} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{p.imunisasi ?? '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openDetail(p)}
                          title="Lihat Detail"
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          title="Edit"
                          className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          title="Hapus"
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Activity className="mx-auto mb-2 text-gray-300" size={40} />
                    Belum ada data pemeriksaan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Hapus Pemeriksaan</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Apakah Anda yakin ingin menghapus data pemeriksaan ini?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modalMode === 'detail' && selectedPemeriksaan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Detail Pemeriksaan</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
                <p className="text-sm font-medium text-pink-700 dark:text-pink-300 mb-1">Balita</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{selectedBalitaDetail?.nama}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedBalitaDetail?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Tanggal Pemeriksaan', value: format(new Date(selectedPemeriksaan.tanggal), 'd MMMM yyyy', { locale: id }) },
                  { label: 'Umur (saat periksa)', value: selectedPemeriksaan.umur_bulan != null ? `${selectedPemeriksaan.umur_bulan} bulan` : '-' },
                  { label: 'Berat Badan', value: `${selectedPemeriksaan.berat_badan} kg` },
                  { label: 'Tinggi Badan', value: `${selectedPemeriksaan.tinggi_badan} cm` },
                  { label: 'Lingkar Kepala', value: `${selectedPemeriksaan.lingkar_kepala} cm` },
                  { label: 'LILA / Lingkar Lengan', value: selectedPemeriksaan.lingkar_lengan != null ? `${selectedPemeriksaan.lingkar_lengan} cm` : '-' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Status Berat Badan</p>
                <StatusBadge status={selectedPemeriksaan.status_bb} />
              </div>

              {(selectedPemeriksaan.imunisasi || selectedPemeriksaan.vitamin) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Imunisasi</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedPemeriksaan.imunisasi ?? '-'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vitamin</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedPemeriksaan.vitamin ?? '-'}</p>
                  </div>
                </div>
              )}

              {selectedPemeriksaan.keluhan && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Keluhan</p>
                  <p className="text-gray-900 dark:text-gray-100">{selectedPemeriksaan.keluhan}</p>
                </div>
              )}

              {selectedPemeriksaan.diagnosa && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Diagnosa</p>
                  <p className="text-gray-900 dark:text-gray-100">{selectedPemeriksaan.diagnosa}</p>
                </div>
              )}

              {selectedPemeriksaan.catatan && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Catatan</p>
                  <p className="text-gray-900 dark:text-gray-100">{selectedPemeriksaan.catatan}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { closeModal(); openEdit(selectedPemeriksaan); }}
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {modalMode === 'add' ? 'Input Pemeriksaan Baru' : 'Edit Pemeriksaan'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pilih Balita *
                  </label>
                  <select
                    value={formData.balita_id}
                    onChange={(e) => setFormData({ ...formData, balita_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">-- Pilih Balita --</option>
                    {balita.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama} ({b.jenis_kelamin === 'L' ? 'L' : 'P'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tanggal Pemeriksaan *
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Umur (bulan)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={formData.umur_bulan}
                    onChange={(e) => setFormData({ ...formData, umur_bulan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Contoh: 24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Berat Badan (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.berat_badan}
                    onChange={(e) => setFormData({ ...formData, berat_badan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Contoh: 12.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tinggi Badan (cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.tinggi_badan}
                    onChange={(e) => setFormData({ ...formData, tinggi_badan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Contoh: 85"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lingkar Kepala (cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.lingkar_kepala}
                    onChange={(e) => setFormData({ ...formData, lingkar_kepala: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Contoh: 46"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LILA / Lingkar Lengan Atas (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.lingkar_lengan}
                    onChange={(e) => setFormData({ ...formData, lingkar_lengan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Contoh: 15.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status Berat Badan
                  </label>
                  <select
                    value={formData.status_bb}
                    onChange={(e) => setFormData({ ...formData, status_bb: e.target.value as '' | 'N' | 'T' | 'O' })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-- Pilih Status --</option>
                    <option value="N">N – Naik</option>
                    <option value="T">T – Turun</option>
                    <option value="O">O – Tidak ada data bulan sebelumnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imunisasi</label>
                  <input
                    type="text"
                    value={formData.imunisasi}
                    onChange={(e) => setFormData({ ...formData, imunisasi: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Contoh: BCG, DPT 1, Campak"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vitamin</label>
                  <input
                    type="text"
                    value={formData.vitamin}
                    onChange={(e) => setFormData({ ...formData, vitamin: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Contoh: Vitamin A"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keluhan</label>
                  <textarea
                    value={formData.keluhan}
                    onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={2}
                    placeholder="Keluhan yang disampaikan orang tua"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diagnosa</label>
                  <textarea
                    value={formData.diagnosa}
                    onChange={(e) => setFormData({ ...formData, diagnosa: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={2}
                    placeholder="Diagnosa atau kondisi balita"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catatan</label>
                  <textarea
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Catatan tambahan tentang pemeriksaan"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  {modalMode === 'add' ? 'Simpan Pemeriksaan' : 'Perbarui Pemeriksaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
