import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function DataBarang() {
  // Semua state dan logika tidak diubah
  const [listBarang, setListBarang] = useState([]);
  const [formTambahVisible, setFormTambahVisible] = useState(false);
  const [formEditVisible, setFormEditVisible] = useState(false);

  const [inputNama, setInputNama] = useState('');
  const [inputLokasi, setInputLokasi] = useState('');
  const [inputStok, setInputStok] = useState('');
  const [inputKategori, setInputKategori] = useState('');
  const [inputKode, setInputKode] = useState('');

  const [idBarangEdit, setIdBarangEdit] = useState('');

  const [barangEdit, setBarangEdit] = useState({
    nama: '',
    lokasi: '',
    stok: '',
    kategori: '',
    kode: '',
  });
  
  const dataEdit = {
    nama: barangEdit.nama,
    lokasi: barangEdit.lokasi,
    stok: barangEdit.stok,
    kategori: barangEdit.kategori,
    kodeBarang: barangEdit.kode
  };
  
  const dataBarang = {
    nama: inputNama,
    lokasi: inputLokasi,
    stok: inputStok,
    kategori: inputKategori,
    kodeBarang: inputKode
  };

  // Fungsi untuk mengambil data barang
  const fetchDataBarang = () => {
    axios.get('http://localhost:5000/barang')
      .then((res) => {
        setListBarang(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchDataBarang();
  }, []);

  function handleDelete(id) {
    if (window.confirm('Yakin Ingin Menghapus Barang Ini??')) {
      axios.delete(`http://localhost:5000/barang/${id}`)
        .then((res) => {
          toast.success(res.data.message);
          fetchDataBarang(); // Ambil ulang data setelah hapus
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || 'Gagal Menghapus Barang');
          console.log(err);
        });
    }
  }

  function tambahBarang(e) {
    e.preventDefault();
    axios.post('http://localhost:5000/barang', dataBarang)
      .then((res) => {
        toast.success(res.data.message);
        setFormTambahVisible(false);
        fetchDataBarang(); // Ambil ulang data setelah tambah
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Terjadi Kesalahan';
        toast.error(msg);
      });
  }

  function editBarang(e) {
    e.preventDefault();
    axios.put(`http://localhost:5000/barang/${idBarangEdit}`, dataEdit)
      .then((ress) => {
        toast.success('Item Berhasil Di Ubah');
        setFormEditVisible(false);
        fetchDataBarang(); // Ambil ulang data setelah edit
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Gagal update data';
        toast.error(msg);
      });
  }

  const commonInputClasses = "flex-1 p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-4 md:p-8 bg-gray-50 font-sans rounded-lg">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 m-0">📦 Data Barang</h2>
        <button 
          className="w-full md:w-auto bg-blue-600 text-white py-2.5 px-5 rounded-md text-base font-semibold cursor-pointer transition-colors hover:bg-blue-700"
          onClick={() => { setFormTambahVisible(true); setFormEditVisible(false); }}
        >
          + Tambah Barang
        </button>
      </div>

      {/* Form Tambah Barang */}
{formTambahVisible && (
    // Lapisan Overlay: menutupi seluruh layar dengan latar belakang blur
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        
        {/* Konten Form: Diletakkan di tengah oleh parent-nya */}
        <form 
            className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl" 
            onSubmit={tambahBarang}
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah Barang Baru</h2>
            
            <div className="flex flex-col gap-4">
                <input 
                    className={commonInputClasses} 
                    type="text" 
                    placeholder="Kode Barang" 
                    onChange={(e) => setInputKode(e.target.value)} 
                    required 
                />
                <input 
                    className={commonInputClasses} 
                    type="text" 
                    placeholder="Nama Barang" 
                    onChange={(e) => setInputNama(e.target.value)} 
                    required 
                />
                <input 
                    className={commonInputClasses} 
                    type="text" 
                    placeholder="Lokasi Barang" 
                    onChange={(e) => setInputLokasi(e.target.value)} 
                    required 
                />
                <input 
                    className={commonInputClasses} 
                    type="number" 
                    placeholder="Jumlah Barang" 
                    onChange={(e) => setInputStok(e.target.value)} 
                    required 
                />
                <input 
                    className={commonInputClasses} 
                    type="text" 
                    placeholder="Kategori" 
                    onChange={(e) => setInputKategori(e.target.value)} 
                    required 
                />
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-3 mt-6">
                <button 
                    type="button" 
                    className="w-full md:w-auto py-2.5 px-5 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition-colors" 
                    onClick={() => setFormTambahVisible(false)}
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="w-full md:w-auto py-2.5 px-5 bg-emerald-500 text-white rounded-md font-semibold hover:bg-emerald-600 transition-colors"
                >
                    Kirim
                </button>
            </div>
        </form>
    </div>
)}

      {/* Form Edit Barang */}
{formEditVisible && (
    // Lapisan Overlay: Latar belakang diubah menjadi blur
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        
        {/* Konten Form: Diletakkan di tengah oleh parent-nya */}
        <form 
            className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl" 
            onSubmit={editBarang}
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Barang</h2>
            
            <div className="flex flex-col gap-4">
                <input 
                    className={commonInputClasses} 
                    type="text" 
                    placeholder="Kode Barang" 
                    value={barangEdit.kode} 
                    onChange={(e) => setBarangEdit({ ...barangEdit, kode: e.target.value })} 
                    required 
                />
                <input 
                    className={commonInputClasses} 
                    type="text" 
                    placeholder="Nama Barang" 
                    value={barangEdit.nama} 
                    onChange={(e) => setBarangEdit({ ...barangEdit, nama: e.target.value })} 
                    required 
                />
                <input 
                    className={commonInputClasses} 
                    type="text" 
                    placeholder="Lokasi Barang" 
                    value={barangEdit.lokasi} 
                    onChange={(e) => setBarangEdit({ ...barangEdit, lokasi: e.target.value })} 
                    required 
                />
                <input 
                    className={commonInputClasses} 
                    type="number" 
                    placeholder="Jumlah Barang" 
                    value={barangEdit.stok} 
                    onChange={(e) => setBarangEdit({ ...barangEdit, stok: e.target.value })} 
                    required 
                />
                <input 
                    className={commonInputClasses} 
                    type="text" 
                    placeholder="Kategori" 
                    value={barangEdit.kategori} 
                    onChange={(e) => setBarangEdit({ ...barangEdit, kategori: e.target.value })} 
                    required 
                />
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-3 mt-6">
                <button 
                    type="button" 
                    className="w-full md:w-auto py-2.5 px-5 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition-colors" 
                    onClick={() => setFormEditVisible(false)}
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="w-full md:w-auto py-2.5 px-5 bg-emerald-500 text-white rounded-md font-semibold hover:bg-emerald-600 transition-colors"
                >
                    Edit
                </button>
            </div>
        </form>
    </div>
)}

      {/* Tabel Data Barang */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full min-w-[700px] border-collapse bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase whitespace-nowrap">No</th>
              <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase whitespace-nowrap">Nama Barang</th>
              <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase whitespace-nowrap">Kategori</th>
              <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase whitespace-nowrap">Stok</th>
              <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase whitespace-nowrap">Lokasi</th>
              <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {listBarang.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 border-b border-gray-200 text-gray-700 whitespace-nowrap">{index + 1}</td>
                <td className="p-4 border-b border-gray-200 text-gray-700 whitespace-nowrap">{item.nama}</td>
                <td className="p-4 border-b border-gray-200 text-gray-700 whitespace-nowrap">{item.kategori}</td>
                <td className="p-4 border-b border-gray-200 text-gray-700 whitespace-nowrap">{item.stok}</td>
                <td className="p-4 border-b border-gray-200 text-gray-700 whitespace-nowrap">{item.lokasi}</td>
                <td className="p-4 border-b border-gray-200 text-gray-700 whitespace-nowrap">
                  <button 
                    className="py-2 px-3 mr-2 bg-amber-400 text-white rounded-md font-medium transition-opacity hover:opacity-85"
                    onClick={() => {
                      setFormEditVisible(true); 
                      setFormTambahVisible(false);
                      setIdBarangEdit(item.id);
                      setBarangEdit({
                        nama: item.nama,
                        lokasi: item.lokasi,
                        stok: item.stok,
                        kategori: item.kategori,
                        kode: item.kodeBarang,
                      });
                    }}>
                      Edit
                  </button>
                  <button 
                    className="py-2 px-3 bg-red-500 text-white rounded-md font-medium transition-opacity hover:opacity-85"
                    onClick={() => handleDelete(item.id)}>
                      Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataBarang;
