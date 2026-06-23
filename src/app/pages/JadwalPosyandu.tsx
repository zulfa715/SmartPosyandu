import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Plus, Edit, Trash2, X, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

export default function JadwalPosyandu() {
  const { jadwal, addJadwal, updateJadwal, deleteJadwal } = useData();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tanggal: '',
    waktu: '',
    lokasi: '',
    keterangan: ''
  });

  const isKader = user?.role === 'kader';

  const sortedJadwal = jadwal.sort(
    (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
  );

  const upcomingJadwal = sortedJadwal.filter(j => new Date(j.tanggal) >= new Date());
  const pastJadwal = sortedJadwal.filter(j => new Date(j.tanggal) < new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      updateJadwal(editId, formData);
      toast.success('Jadwal berhasil diperbarui');
    } else {
      addJadwal(formData);
      toast.success('Jadwal berhasil ditambahkan');
    }

    resetForm();
  };

  const handleEdit = (id: string) => {
    const jadwalData = jadwal.find(j => j.id === id);
    if (jadwalData) {
      setFormData({
        tanggal: jadwalData.tanggal,
        waktu: jadwalData.waktu,
        lokasi: jadwalData.lokasi,
        keterangan: jadwalData.keterangan || ''
      });
      setEditId(id);
      setShowModal(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      deleteJadwal(id);
      toast.success('Jadwal berhasil dihapus');
    }
  };

  const resetForm = () => {
    setFormData({
      tanggal: '',
      waktu: '',
      lokasi: '',
      keterangan: ''
    });
    setEditId(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jadwal Posyandu</h1>
          <p className="text-gray-600">
            {isKader ? 'Kelola jadwal kegiatan posyandu' : 'Lihat jadwal posyandu terdekat'}
          </p>
        </div>
        {isKader && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Tambah Jadwal
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Jadwal Mendatang</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {upcomingJadwal.length > 0 ? (
            upcomingJadwal.map((j) => (
              <div
                key={j.id}
                className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {format(new Date(j.tanggal), 'EEEE', { locale: id })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(j.tanggal), 'd MMMM yyyy', { locale: id })}
                      </p>
                    </div>
                  </div>
                  {isKader && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(j.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(j.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>{j.waktu}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{j.lokasi}</span>
                  </div>
                  {j.keterangan && (
                    <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                      <p className="text-sm text-blue-900">{j.keterangan}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-gray-500">
              Belum ada jadwal mendatang
            </div>
          )}
        </div>
      </div>

      {pastJadwal.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Riwayat Jadwal</h2>
          <div className="space-y-3">
            {pastJadwal.reverse().map((j) => (
              <div
                key={j.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                    <Calendar className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(j.tanggal), 'd MMMM yyyy', { locale: id })}
                    </p>
                    <p className="text-sm text-gray-600">{j.lokasi}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{j.waktu}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && isKader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editId ? 'Edit Jadwal' : 'Tambah Jadwal'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal *
                </label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu *
                </label>
                <input
                  type="text"
                  value={formData.waktu}
                  onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Contoh: 08:00 - 12:00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi *
                </label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Contoh: Balai RW 05, Kelurahan Melati"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                  placeholder="Keterangan tambahan (opsional)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  {editId ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
