import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

function Laporan() {
  // Semua state dan logika tidak diubah
  const [laporanData, setLaporanData] = useState([]);
  const [filterDari, setFilterDari] = useState('');
  const [filterSampai, setFilterSampai] = useState('');

  const fetchData = () => {
    axios.get('http://localhost:5000/peminjaman/riwayat')
      .then((res) => {
        setLaporanData(res.data);
      })
      .catch((err) => {
        console.error("Gagal mengambil data laporan:", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTandaiSelesai = (id) => {
    axios.put(`http://localhost:5000/peminjaman/${id}/selesai`)
      .then(() => {
        toast.success("Status peminjaman berhasil diubah menjadi Selesai.");
        fetchData(); // Ambil ulang data untuk sinkronisasi
      })
      .catch((err) => {
        console.error("Gagal tandai selesai:", err);
        toast.error("Gagal mengubah status peminjaman.");
      });
  };

  const filteredData = laporanData.filter((item) => {
    if (!filterDari && !filterSampai) return true;
    const pinjamDate = new Date(item.tanggal_pinjam);
    // Set jam ke 0 untuk perbandingan tanggal yang akurat
    if (filterDari) pinjamDate.setHours(0, 0, 0, 0);
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
        new Date(item.tanggal_pinjam).toLocaleDateString('id-ID'),
        item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-',
        item.status,
      ];
      tableRows.push(itemData);
    });
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save('laporan-peminjaman.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map((item, index) => ({
            No: index + 1,
            Nama: item.nama_user,
            Barang: item.nama_barang,
            Jumlah: item.jumlah,
            'Tanggal Pinjam': new Date(item.tanggal_pinjam).toLocaleDateString('id-ID'),
            'Tanggal Kembali': item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-',
            Status: item.status,
        }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, "LaporanPeminjaman.xlsx");
  };

  const statusStyles = {
    selesai: 'bg-green-500 text-white',
    dipinjam: 'bg-blue-500 text-white',
    pending: 'bg-yellow-500 text-white',
    ditolak: 'bg-red-500 text-white',
    'menunggu konfirmasi pengembalian': 'bg-purple-500 text-white',
  };

  return (
    <div className="p-6 bg-gray-50 font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">� Laporan Peminjaman</h2>
        <div className="flex gap-3">
          <button className="py-2 px-4 bg-red-600 text-white rounded-md font-bold transition-colors hover:bg-red-700" onClick={exportToPdf}>Export PDF</button>
          <button className="py-2 px-4 bg-green-600 text-white rounded-md font-bold transition-colors hover:bg-green-700" onClick={exportToExcel}>Export Excel</button>
        </div>
      </div>

      <div className="my-4 p-4 bg-white rounded-lg shadow-sm flex flex-col md:flex-row gap-5 items-center">
        <label className="flex flex-col font-medium text-gray-700">
          Dari Tanggal:
          <input type="date" value={filterDari} onChange={(e) => setFilterDari(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md" />
        </label>
        <label className="flex flex-col font-medium text-gray-700">
          Sampai Tanggal:
          <input type="date" value={filterSampai} onChange={(e) => setFilterSampai(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md" />
        </label>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-200 p-3 text-left font-bold text-gray-600">No</th>
              <th className="border-b border-gray-200 p-3 text-left font-bold text-gray-600">Nama</th>
              <th className="border-b border-gray-200 p-3 text-left font-bold text-gray-600">Barang</th>
              <th className="border-b border-gray-200 p-3 text-left font-bold text-gray-600">Jumlah</th>
              <th className="border-b border-gray-200 p-3 text-left font-bold text-gray-600">Tgl Pinjam</th>
              <th className="border-b border-gray-200 p-3 text-left font-bold text-gray-600">Tgl Kembali</th>
              <th className="border-b border-gray-200 p-3 text-left font-bold text-gray-600">Status</th>
              <th className="border-b border-gray-200 p-3 text-left font-bold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 p-3">{index + 1}</td>
                  <td className="border-b border-gray-200 p-3">{item.nama_user}</td>
                  <td className="border-b border-gray-200 p-3">{item.nama_barang}</td>
                  <td className="border-b border-gray-200 p-3">{item.jumlah}</td>
                  <td className="border-b border-gray-200 p-3">{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                  <td className="border-b border-gray-200 p-3">{item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="border-b border-gray-200 p-3">
                    <span className={`py-1 px-2.5 rounded-md text-xs font-bold capitalize ${statusStyles[item.status.toLowerCase()] || 'bg-gray-500 text-white'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="border-b border-gray-200 p-3">
                    {item.status.toLowerCase() === 'menunggu konfirmasi pengembalian' && (
                      <button className="py-1.5 px-3 bg-green-500 text-white rounded-md text-xs font-bold transition-colors hover:bg-green-600" onClick={() => handleTandaiSelesai(item.id)}>
                        Tandai Selesai
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Laporan;
