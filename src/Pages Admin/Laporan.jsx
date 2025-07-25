import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/Laporan.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

function Laporan() {
  const [laporanData, setLaporanData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/peminjaman/riwayat')
      .then((res) => {
        setLaporanData(res.data);
      })
      .catch((err) => {
        console.error("Gagal ambil jumlah pengguna:", err);
      });
  }, []);

  const [filterDari, setFilterDari] = useState('');
  const [filterSampai, setFilterSampai] = useState('');

  const handleTandaiSelesai = (id) => {
    axios.put(`http://localhost:5000/peminjaman/${id}/selesai`)
    .then(() => {
      const updated = laporanData.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Selesai',
              tanggal_kembali: new Date().toISOString().slice(0, 10),
            }
          : item
      );
      setLaporanData(updated);
    })
    .catch((err) => {
      console.error("Gagal tandai selesai:", err);
    });
  };

  const filteredData = laporanData.filter((item) => {
    if (!filterDari && !filterSampai) return true;
    const pinjamDate = new Date(item.tanggal_pinjam);
    const fromDate = filterDari ? new Date(filterDari) : null;
    const toDate = filterSampai ? new Date(filterSampai) : null;
    if (fromDate && pinjamDate < fromDate) return false;
    if (toDate && pinjamDate > toDate) return false;
    return true;
  });

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text("Laporan Peminjaman Barang", 14, 22);

    const tableColumn = ["No", "Nama", "Barang", "Jumlah", "Tgl Pinjam", "Tgl Kembali", "Status"];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const itemData = [
        index + 1,
        item.nama_user,
        item.nama_barang,
        item.jumlah,
        item.tanggal_pinjam,
        item.tanggal_kembali || '-',
        item.status,
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('laporan-peminjaman.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, "LaporanPeminjaman.xlsx");
  };

  return (
    <div className="laporan-container">
      <div className="laporan-header">
        <h2>📊 Laporan Peminjaman</h2>
        <div>
          <button className="export-btn" onClick={exportToPdf}>Export PDF</button>
          <button className="export-btn" onClick={exportToExcel}>Export Excel</button>
        </div>
      </div>

      <div className="filter-container">
        <label>
          Dari:
          <input type="date" value={filterDari} onChange={(e) => setFilterDari(e.target.value)} />
        </label>
        <label>
          Sampai:
          <input type="date" value={filterSampai} onChange={(e) => setFilterSampai(e.target.value)} />
        </label>
      </div>

      <table className="table-laporan">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Barang</th>
            <th>Jumlah</th>
            <th>Tanggal Pinjam</th>
            <th>Tanggal Kembali</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nama_user}</td>
              <td>{item.nama_barang}</td>
              <td>{item.jumlah}</td>
              <td>{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
              <td>{item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</td>
              <td>
                <span className={`status ${item.status === 'Selesai' ? 'selesai' : 'belum'}`}>
                  {item.status}
                </span>
              </td>
              <td>
                {item.status !== 'Selesai' && (
                  <button className="btn-selesai" onClick={() => handleTandaiSelesai(item.id)}>
                    Tandai Selesai
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                Data tidak ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Laporan;
