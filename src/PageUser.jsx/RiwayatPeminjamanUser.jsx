import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RiwayatPeminjamanUser() {
  const [riwayatData, setRiwayatData] = useState([]);
 
  // Logika untuk mengambil data tidak diubah
  useEffect(() => {
    // Mengambil userId dari localStorage untuk fetch data riwayat pengguna yang spesifik
    const userId = localStorage.getItem('userId'); 
    if (userId) {
        axios.get(`http://localhost:5000/peminjaman/riwayat/${userId}`)
            .then((res) => {
                setRiwayatData(res.data); 
            })
            .catch((err) => {
                console.error("Gagal mengambil riwayat peminjaman:", err);
            });
    }
  }, []);

  // Objek untuk memetakan status ke kelas warna Tailwind
  const statusStyles = {
    disetujui: 'bg-green-100 text-green-800',
    dipinjam: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-orange-100 text-orange-800',
    selesai: 'bg-blue-100 text-blue-800',
    ditolak: 'bg-red-100 text-red-800',
    'menunggu konfirmasi pengembalian': 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg font-sans">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Riwayat Peminjaman</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-center">No</th>
              <th className="border border-gray-300 p-3 text-center">Nama Barang</th>
              <th className="border border-gray-300 p-3 text-center">Jumlah</th>
              <th className="border border-gray-300 p-3 text-center">Tanggal Pinjam</th>
              <th className="border border-gray-300 p-3 text-center">Tanggal Kembali</th>
              <th className="border border-gray-300 p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {riwayatData.length > 0 ? (
              riwayatData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.nama_barang}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.jumlah}</td>
                  <td className="border border-gray-300 p-3 text-center">{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className={`font-bold px-2 py-1 rounded-md inline-block capitalize ${statusStyles[item.status.toLowerCase()] || 'bg-gray-200 text-gray-800'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border border-gray-300 p-4 text-center text-gray-500">
                  Tidak ada data riwayat peminjaman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RiwayatPeminjamanUser;
