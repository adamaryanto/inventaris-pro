import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StatusPengajuanUser() {
  const [pengajuan, setPengajuan] = useState([]);

  // Logika untuk mengambil data tidak diubah
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        axios.get(`http://localhost:5000/users/${userId}/peminjaman`)
            .then((res) => {
                setPengajuan(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
  }, []);

  // Objek untuk memetakan status ke kelas warna Tailwind
  const statusStyles = {
    'menunggu persetujuan': 'bg-yellow-100 text-yellow-800',
    'disetujui': 'bg-green-100 text-green-800',
    'ditolak': 'bg-red-100 text-red-800',
    // Tambahkan status lain jika ada
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg font-sans">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">⏳ Status Pengajuan</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-center">No</th>
              <th className="border border-gray-300 p-3 text-center">Barang</th>
              <th className="border border-gray-300 p-3 text-center">Jumlah</th>
              <th className="border border-gray-300 p-3 text-center">Tanggal Pengajuan</th>
              <th className="border border-gray-300 p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {pengajuan.length > 0 ? (
              pengajuan.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.barang}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.jumlah}</td>
                  <td className="border border-gray-300 p-3 text-center">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className={`font-bold px-2.5 py-1.5 rounded-md inline-block capitalize ${statusStyles[item.status.toLowerCase()] || 'bg-gray-200 text-gray-800'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border border-gray-300 p-4 text-center text-gray-500">
                  Belum ada pengajuan yang Anda buat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StatusPengajuanUser;
