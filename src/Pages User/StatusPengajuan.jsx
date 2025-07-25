import React from 'react';
import '../Kumpulan.css/StatusPengajuanUser.css';

function StatusPengajuan() {
  const pengajuan = [
    {
      id: 1,
      barang: 'Laptop ASUS',
      jumlah: 1,
      tanggal: '2025-07-01',
      status: 'Menunggu Persetujuan',
    },
    {
      id: 2,
      barang: 'Kamera Canon',
      jumlah: 1,
      tanggal: '2025-06-28',
      status: 'Disetujui',
    },
    {
      id: 3,
      barang: 'Proyektor Epson',
      jumlah: 1,
      tanggal: '2025-06-26',
      status: 'Ditolak',
    },
  ];

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
              <td>{item.tanggal}</td>
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
