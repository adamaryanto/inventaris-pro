import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/StatusPengajuanUser.css';
import axios from 'axios';
function StatusPengajuan() {
  const [pengajuan,setPengajuan] = useState([])

  useEffect(()=>{
    const userId = localStorage.getItem('userId')
    axios.get(`http://localhost:5000/users/${userId}/peminjaman`)
    .then((res)=>{
      setPengajuan(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])

  return (
    <div className="status-container">
      <h2>⏳ Status Pengajuan</h2>
      <table className="status-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Barang</th>
            <th>Jumlah</th>
            <th>Tanggal Pengajuan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pengajuan.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.barang}</td>
              <td>{item.jumlah}</td>
              <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
              <td>
                <span className={`badge ${item.status.toLowerCase().replaceAll(' ', '-')}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
          {pengajuan.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Belum ada pengajuan.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StatusPengajuan;
