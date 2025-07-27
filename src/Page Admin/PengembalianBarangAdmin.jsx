import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function PengembalianBarangAdmin() {
  const [daftarKonfirmasi, setDaftarKonfirmasi] = useState([]);

  // Fungsi untuk mengambil data
  const fetchData = () => {
    axios.get('http://localhost:5000/peminjaman/menunggu-konfirmasi')
      .then((res) => {
        setDaftarKonfirmasi(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk konfirmasi pengembalian
  function handleConfirm(id) {
    axios.patch(`http://localhost:5000/peminjaman/${id}/konfirmasi-kembali`)
      .then((res) => {
        toast.success(res.data.message);
        // Ambil ulang data setelah konfirmasi berhasil untuk memperbarui daftar
        fetchData();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Gagal menyetujui.');
      });
  }

  // Fungsi untuk menolak pengembalian (contoh)
  function handleReject(id) {
    // Logika untuk menolak bisa ditambahkan di sini
    toast.info(`Fungsi tolak untuk item ${id} belum diimplementasikan.`);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg font-sans">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">↩️ Konfirmasi Pengembalian Barang</h2>
      <p className="text-base text-gray-500 mt-0 mb-8">
        Daftar barang yang telah dikembalikan oleh pengguna dan menunggu konfirmasi Anda.
      </p>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse mt-4 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-center font-bold text-gray-600 border-b">No</th>
              <th className="p-3 text-left font-bold text-gray-600 border-b">Nama Peminjam</th>
              <th className="p-3 text-left font-bold text-gray-600 border-b">Nama Barang</th>
              <th className="p-3 text-center font-bold text-gray-600 border-b">Jumlah</th>
              <th className="p-3 text-center font-bold text-gray-600 border-b">Tgl Pinjam</th>
              <th className="p-3 text-center font-bold text-gray-600 border-b">Tgl Kembali</th>
              <th className="p-3 text-center font-bold text-gray-600 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daftarKonfirmasi.length > 0 ? (
              daftarKonfirmasi.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 text-center border-b border-gray-200">{index + 1}</td>
                  <td className="p-3 text-left border-b border-gray-200">{item.nama_user}</td>
                  <td className="p-3 text-left border-b border-gray-200">{item.nama_barang}</td>
                  <td className="p-3 text-center border-b border-gray-200">{item.jumlah}</td>
                  <td className="p-3 text-center border-b border-gray-200">{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                  <td className="p-3 text-center border-b border-gray-200">{item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="p-3 text-center border-b border-gray-200">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="py-2 px-4 bg-emerald-500 text-white rounded-md font-semibold text-sm transition-opacity hover:opacity-85" 
                        onClick={() => handleConfirm(item.id)}
                      >
                        Setujui
                      </button>
                      <button 
                        className="py-2 px-4 bg-red-500 text-white rounded-md font-semibold text-sm transition-opacity hover:opacity-85"
                        onClick={() => handleReject(item.id)}
                      >
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                        Tidak ada pengajuan pengembalian yang menunggu konfirmasi.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PengembalianBarangAdmin;
