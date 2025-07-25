import React from 'react';
import '../Kumpulan.css/DashboardUser.css';

function DashboardUser() {
  return (
    <div className="dashboard-user">
      <h1>Selamat Datang di Dashboard Pengguna</h1>
      <p>Hai, ini adalah halaman utama untuk pengguna. Silakan pilih menu di sidebar untuk mengajukan peminjaman atau melihat status Anda.</p>

      <div className="cards-container">
        <div className="user-card blue">
          <p className="label">Total Peminjaman</p>
          <p className="value">4</p>
        </div>

        <div className="user-card green">
          <p className="label">Pengajuan Diproses</p>
          <p className="value">1</p>
        </div>

        <div className="user-card orange">
          <p className="label">Riwayat Selesai</p>
          <p className="value">3</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardUser;
