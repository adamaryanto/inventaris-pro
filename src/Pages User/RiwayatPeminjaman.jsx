import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/RiwayatPeminjamanUser.css';
import axios from 'axios';
function RiwayatPeminjaman() {
  const [riwayatData,setRiwayatData] = useState([])
  
  
    useEffect(()=>{
      axios.get('http://localhost:5000/peminjaman/riwayat')
      .then((res) => {
        // PERBAIKAN DI SINI
        setRiwayatData(res.data); 
      })
      .catch((err) => {
        console.error("Gagal ambil jumlah pengguna:", err);
      });

      

    },[])

  return (
    <div className="riwayat-container">
      <h2>📋 Riwayat Peminjaman</h2>
      <table className="riwayat-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Barang</th>
            <th>Jumlah</th>
            <th>Tanggal Pinjam</th>
            <th>Tanggal Kembali</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {riwayatData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nama_user}</td>
              <td>{item.nama_barang}</td>
               <td>{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
               <td>{item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</td>
              <td>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
          {riwayatData.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RiwayatPeminjaman;
