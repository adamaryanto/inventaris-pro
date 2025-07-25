import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/DashboardUser.css';
import axios from 'axios';

function DashboardUser() {

  const [totalPeminjaman,setTotalPeminjaman] = useState(0)
  const [pengajuanDiproses,setPengajuanDiproses]= useState(0)
  const [riwayatSelesai,setRiwayatSelesai] = useState(0)
  useEffect(()=>{
    const userId = localStorage.getItem('userId')
    axios.get(`http://localhost:5000/users/${userId}/peminjaman/statistik`)
    .then((res)=>{
      setTotalPeminjaman(res.data.total_peminjaman)
      setPengajuanDiproses(res.data.pengajuan_diproses)
      setRiwayatSelesai(res.data.riwayat_selesai)
    })
  },[])
  return (
    <div className="dashboard-user">
      <h1>Selamat Datang di Dashboard Pengguna</h1>
      <p>Hai, ini adalah halaman utama untuk pengguna. Silakan pilih menu di sidebar untuk mengajukan peminjaman atau melihat status Anda.</p>

      <div className="cards-container">
        <div className="user-card blue">
          <p className="label">Total Peminjaman</p>
          <p className="value">{totalPeminjaman}</p>
        </div>

        <div className="user-card green">
          <p className="label">Pengajuan Diproses</p>
          <p className="value">{pengajuanDiproses}</p>
        </div>

        <div className="user-card orange">
          <p className="label">Riwayat Selesai</p>
          <p className="value">{riwayatSelesai}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardUser;
