import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Baby, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

export default function DataBalita() {
  const { balita, orangtua, addBalita, updateBalita, deleteBalita, addOrangTua } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nama: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    nik: '',
    orangtua_id: '',
    nama_ayah: '',
    nama_ibu: '',
    alamat: '',
    telepon: ''
  });

  const filteredBalita = balita.filter(b =>
    b.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.nik?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let orangtuaId = formData.orangtua_id;

    if (!orangtuaId && formData.nama_ayah && formData.nama_ibu) {
      const newOrangTuaId = Date.now().toString();
      addOrangTua({
        nama_ayah: formData.nama_ayah,
        nama_ibu: formData.nama_ibu,
        alamat: formData.alamat,
        telepon: formData.telepon
      });
      orangtuaId = newOrangTuaId;
    }

    if (!orangtuaId) {
      toast.error('Data orang tua harus diisi');
      return;
    }

    const balitaData = {
      nama: formData.nama,
      tanggal_lahir: formData.tanggal_lahir,
      jenis_kelamin: formData.jenis_kelamin,
      nik: formData.nik,
      orangtua_id: orangtuaId
    };

    if (editId) {
      updateBalita(editId, balitaData);
      toast.success('Data balita berhasil diperbarui');
    } else {
      addBalita(balitaData);
      toast.success('Data balita berhasil ditambahkan');
    }

    resetForm();
  };

  const handleEdit = (id: string) => {
    const balitaData = balita.find(b => b.id === id);
    if (balitaData) {
      const orangtuaData = orangtua.find(o => o.id === balitaData.orangtua_id);
      setFormData({
        nama: balitaData.nama,
        tanggal_lahir: balitaData.tanggal_lahir,
        jenis_kelamin: balitaData.jenis_kelamin,
        nik: balitaData.nik || '',
        orangtua_id: balitaData.orangtua_id,
        nama_ayah: orangtuaData?.nama_ayah || '',
        nama_ibu: orangtuaData?.nama_ibu || '',
        alamat: orangtuaData?.alamat || '',
        telepon: orangtuaData?.telepon || ''
      });
      setEditId(id);
      setShowModal(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data balita ini?')) {
      deleteBalita(id);
      toast.success('Data balita berhasil dihapus');
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      tanggal_lahir: '',
      jenis_kelamin: 'L',
      nik: '',
      orangtua_id: '',
      nama_ayah: '',
      nama_ibu: '',
      alamat: '',
      telepon: ''
    });
    setEditId(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Balita</h1>
          <p className="text-gray-600">Kelola data balita posyandu</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Balita
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau NIK balita..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Balita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Lahir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Kelamin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orang Tua
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBalita.length > 0 ? (
                filteredBalita.map((b) => {
                  const parent = orangtua.find(o => o.id === b.orangtua_id);
                  return (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <Baby className="text-pink-600" size={20} />
                          </div>
                          <div className="font-medium text-gray-900">{b.nama}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {b.nik || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(b.tanggal_lahir), 'd MMMM yyyy', { locale: id })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {b.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {parent ? `${parent.nama_ibu} / ${parent.nama_ayah}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(b.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data balita
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editId ? 'Edit Data Balita' : 'Tambah Data Balita'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-4">Data Balita</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIK
                    </label>
                    <input
                      type="text"
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_lahir}
                      onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kelamin *
                    </label>
                    <select
                      value={formData.jenis_kelamin}
                      onChange={(e) =>
                        setFormData({ ...formData, jenis_kelamin: e.target.value as 'L' | 'P' })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-4">Data Orang Tua</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Ayah *
                    </label>
                    <input
                      type="text"
                      value={formData.nama_ayah}
                      onChange={(e) => setFormData({ ...formData, nama_ayah: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Ibu *
                    </label>
                    <input
                      type="text"
                      value={formData.nama_ibu}
                      onChange={(e) => setFormData({ ...formData, nama_ibu: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telepon *
                    </label>
                    <input
                      type="tel"
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat *
                    </label>
                    <input
                      type="text"
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
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
