import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RiwayatPeminjamanAdmin() {
  const [riwayatData, setRiwayatData] = useState([]);

  // Logika untuk mengambil data tidak diubah
  useEffect(() => {
    axios.get('http://localhost:5000/peminjaman/riwayat')
      .then((res) => {
        setRiwayatData(res.data); 
      })
      .catch((err) => {
        console.error("Gagal mengambil riwayat:", err);
      });
  }, []);

  // Objek untuk memetakan status ke kelas warna Tailwind
  const statusStyles = {
    selesai: 'bg-green-500 text-white',
    dipinjam: 'bg-blue-500 text-white',
    pending: 'bg-yellow-500 text-white',
    ditolak: 'bg-red-500 text-white',
    'menunggu konfirmasi pengembalian': 'bg-purple-500 text-white',
  };

  return (
    <div className="p-6 bg-gray-50 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🔁 Riwayat Peminjaman (Semua)</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-600 border-b">No</th>
              <th className="p-3 text-left font-semibold text-gray-600 border-b">Nama Peminjam</th>
              <th className="p-3 text-left font-semibold text-gray-600 border-b">Barang</th>
              <th className="p-3 text-left font-semibold text-gray-600 border-b">Jumlah</th>
              <th className="p-3 text-left font-semibold text-gray-600 border-b">Tanggal Pinjam</th>
              <th className="p-3 text-left font-semibold text-gray-600 border-b">Tanggal Kembali</th>
              <th className="p-3 text-left font-semibold text-gray-600 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {riwayatData.length > 0 ? (
              riwayatData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200">{index + 1}</td>
                  <td className="p-3 border-b border-gray-200">{item.nama_user}</td>
                  <td className="p-3 border-b border-gray-200">{item.nama_barang}</td>
                  <td className="p-3 border-b border-gray-200">{item.jumlah}</td>
                  <td className="p-3 border-b border-gray-200">{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                  <td className="p-3 border-b border-gray-200">{item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="p-3 border-b border-gray-200">
                    <span className={`py-1 px-2.5 rounded text-xs font-bold capitalize ${statusStyles[item.status.toLowerCase()] || 'bg-gray-400 text-white'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Tidak ada data riwayat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RiwayatPeminjamanAdmin;
