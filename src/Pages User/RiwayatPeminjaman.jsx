import React from 'react';
import '../Kumpulan.css/RiwayatPeminjamanUser.css';

function RiwayatPeminjaman() {
  const riwayat = [
    {
      id: 1,
      barang: 'Laptop ASUS',
      jumlah: 1,
      tanggalPinjam: '2025-06-20',
      tanggalKembali: '2025-06-25',
      status: 'Disetujui',
    },
    {
      id: 2,
      barang: 'Proyektor Epson',
      jumlah: 1,
      tanggalPinjam: '2025-06-22',
      tanggalKembali: null,
      status: 'Dipinjam',
    },
    {
      id: 3,
      barang: 'Kursi Kantor',
      jumlah: 2,
      tanggalPinjam: '2025-06-25',
      tanggalKembali: null,
      status: 'Pending',
    },
  ];

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
          {riwayat.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.barang}</td>
              <td>{item.jumlah}</td>
              <td>{item.tanggalPinjam}</td>
              <td>{item.tanggalKembali || '-'}</td>
              <td>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
          {riwayat.length === 0 && (
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
