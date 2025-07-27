import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function PengembalianBarangUser() {
  const [barangDipinjam, setBarangDipinjam] = useState([]);

  // Logika untuk mengambil data tidak diubah
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:5000/users/${userId}/peminjaman/disetujui`)
      .then((res) => {
        setBarangDipinjam(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Logika untuk pengembalian barang tidak diubah
  function onReturn(id) {
    axios.patch(`http://localhost:5000/peminjaman/${id}/ajukan-pengembalian`)
      .then((ress) => {
        toast.success('Barang Berhasil Di Kembalikan');
        // Refresh data setelah berhasil
        const userId = localStorage.getItem('userId');
        axios.get(`http://localhost:5000/users/${userId}/peminjaman/disetujui`)
          .then((res) => {
            setBarangDipinjam(res.data);
          });
      })
      .catch((err) => {
        toast.error('Gagal mengajukan pengembalian.');
        console.error(err);
      });
  }
  
  return (
    <div className="p-8 bg-gray-50 font-sans min-h-screen">
      <h2 className="text-3xl text-gray-900 mb-2 font-bold">Barang Pinjaman Anda</h2>
      <p className="text-base text-gray-500 mt-0 mb-8">
        Ajukan pengembalian untuk barang yang sudah selesai Anda gunakan.
      </p>

      {/* Layout untuk daftar kartu */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {barangDipinjam.length > 0 ? (
            barangDipinjam.map((item) => (
            <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden" key={item.id}>
              
              {/* Header Kartu */}
              <div className="p-5 border-b border-gray-200">
                <h3 className="m-0 text-lg font-bold text-gray-800">{item.namaBarang}</h3>
                <span className="text-sm text-gray-500">Jumlah: {item.jumlah}</span>
              </div>
              
              {/* Body Kartu */}
              <div className="p-5 flex-grow">
                <div className="mb-4">
                  <span className="text-xs text-gray-500 font-medium">Tanggal Pinjam:</span>
                  <p className="text-base text-gray-700 font-semibold m-0 mt-1">{new Date(item.tanggalPinjam).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium">Wajib Kembali:</span>
                  <p className="text-base text-gray-700 font-semibold m-0 mt-1">{new Date(item.tanggalKembali).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              
              {/* Footer Kartu */}
              <div className="p-5 bg-gray-50">
                <button 
                  className="w-full py-3 px-4 bg-blue-600 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-blue-700"
                  onClick={() => onReturn(item.id)}
                >
                  Ajukan Pengembalian
                </button>
              </div>
            </div>
          ))
        ) : (
            <p className="text-gray-500 col-span-full">Tidak ada barang yang sedang Anda pinjam.</p>
        )}
      </div>
    </div>
  );
}

export default PengembalianBarangUser;
