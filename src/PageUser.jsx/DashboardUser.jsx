import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardUser() {

  const [totalPeminjaman, setTotalPeminjaman] = useState(0);
  const [pengajuanDiproses, setPengajuanDiproses] = useState(0);
  const [riwayatSelesai, setRiwayatSelesai] = useState(0);

  // Logika untuk mengambil data tidak diubah
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:5000/users/${userId}/peminjaman/statistik`)
      .then((res) => {
        setTotalPeminjaman(res.data.total_peminjaman);
        setPengajuanDiproses(res.data.pengajuan_diproses);
        setRiwayatSelesai(res.data.riwayat_selesai);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl mb-2.5 text-[#2c3e50]">Selamat Datang di Dashboard Pengguna</h1>
      <p className="text-base text-gray-600">Hai, ini adalah halaman utama untuk pengguna. Silakan pilih menu di sidebar untuk mengajukan peminjaman atau melihat status Anda.</p>

      <div className="flex flex-wrap gap-5 mt-8">
        
        {/* Card Total Peminjaman */}
        <div className="bg-white p-5 rounded-xl shadow-lg flex-1 min-w-[220px] max-w-[300px] transition duration-200 ease-in-out hover:-translate-y-1 border-l-[5px] border-l-[#3498db]">
          <p className="text-sm text-gray-500 mb-2">Total Peminjaman</p>
          <p className="text-2xl font-bold text-gray-800">{totalPeminjaman}</p>
        </div>

        {/* Card Pengajuan Diproses */}
        <div className="bg-white p-5 rounded-xl shadow-lg flex-1 min-w-[220px] max-w-[300px] transition duration-200 ease-in-out hover:-translate-y-1 border-l-[5px] border-l-[#2ecc71]">
          <p className="text-sm text-gray-500 mb-2">Pengajuan Diproses</p>
          <p className="text-2xl font-bold text-gray-800">{pengajuanDiproses}</p>
        </div>

        {/* Card Riwayat Selesai */}
        <div className="bg-white p-5 rounded-xl shadow-lg flex-1 min-w-[220px] max-w-[300px] transition duration-200 ease-in-out hover:-translate-y-1 border-l-[5px] border-l-[#f39c12]">
          <p className="text-sm text-gray-500 mb-2">Riwayat Selesai</p>
          <p className="text-2xl font-bold text-gray-800">{riwayatSelesai}</p>
        </div>

      </div>
    </div>
  );
}

export default DashboardUser;
