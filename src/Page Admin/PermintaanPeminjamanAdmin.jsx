import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function PermintaanPeminjamanAdmin() {
  const [dataPermintaan, setDataPermintaan] = useState([]);

  // Fungsi untuk mengambil data permintaan
  const fetchData = () => {
    axios.get('http://localhost:5000/peminjaman')
      .then((res) => {
        setDataPermintaan(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk menyetujui permintaan
  function onAcc(id) {
    axios.put(`http://localhost:5000/peminjaman/${id}/setujui`)
      .then((res) => {
        toast.success('Peminjaman disetujui');
        fetchData(); // Ambil ulang data untuk memperbarui UI
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Gagal menyetujui.');
      });
  }

  // Fungsi untuk menolak permintaan
  function onReject(id) {
    axios.put(`http://localhost:5000/peminjaman/${id}/tolak`)
      .then((res) => {
        toast.success('Peminjaman Di Tolak');
        fetchData(); // Ambil ulang data untuk memperbarui UI
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Gagal menolak.');
      });
  }

  // Objek untuk gaya status
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    // Tambahkan gaya untuk status lain jika perlu
  };

  return (
    <div className="p-8 bg-gray-50 font-sans rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mt-0 mb-6">📄 Permintaan Peminjaman</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">No</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Nama Pengguna</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Barang</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Jumlah</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Tgl Pinjam</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Tgl Kembali</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Keterangan</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataPermintaan.filter(item => item.status === 'pending').length > 0 ? (
              dataPermintaan.filter(item => item.status === 'pending').map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 border-b border-gray-200 text-gray-700 align-middle">{index + 1}</td>
                  <td className="p-4 border-b border-gray-200 text-gray-700 align-middle">{item.nama_user}</td>
                  <td className="p-4 border-b border-gray-200 text-gray-700 align-middle">{item.nama_barang}</td>
                  <td className="p-4 border-b border-gray-200 text-gray-700 align-middle">{item.jumlah}</td>
                  <td className="p-4 border-b border-gray-200 text-gray-700 align-middle">{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                  <td className="p-4 border-b border-gray-200 text-gray-700 align-middle">{item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="p-4 border-b border-gray-200 text-gray-700 align-middle">{item.keterangan}</td>
                  <td className="p-4 border-b border-gray-200 text-gray-700 align-middle">
                    <span className={`py-1.5 px-3 rounded-full text-xs font-semibold capitalize ${statusStyles[item.status.toLowerCase()] || 'bg-gray-200 text-gray-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-gray-700 align-middle">
                    <div className='flex gap-2'>
                      <button className="py-2 px-4 bg-emerald-500 text-white rounded-md font-semibold text-sm transition-opacity hover:opacity-85" onClick={() => onAcc(item.id)}>Setujui</button>
                      <button className="py-2 px-4 bg-red-500 text-white rounded-md font-semibold text-sm transition-opacity hover:opacity-85" onClick={() => onReject(item.id)}>Tolak</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                        Tidak ada permintaan peminjaman baru.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PermintaanPeminjamanAdmin;
