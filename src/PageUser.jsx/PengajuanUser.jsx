import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

function PengajuanUser() {
  const [form, setForm] = useState({
    barang_id: '',
    jumlah: 1,
    tanggal_pinjam: '',
    tanggal_kembali: '',
    user_id: '',
    keterangan: '',
  });

  const [listBarang, setListBarang] = useState([]);

  // Mengambil data barang dan mengatur user_id saat komponen dimuat
  useEffect(() => {
    // Mengambil dan decode token untuk mendapatkan userId
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            setForm(prev => ({ ...prev, user_id: userId }));
        }
    } catch (error) {
        console.error("Gagal decode token:", error);
        toast.error("Sesi tidak valid, silakan login kembali.");
    }

    // Mengambil daftar barang
    axios
      .get('http://localhost:5000/barang')
      .then((res) => {
        setListBarang(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      // Pastikan value diubah menjadi angka jika nama field adalah barang_id atau jumlah
      [name]: (name === 'barang_id' || name === 'jumlah') && value !== '' ? parseInt(value) : value,
    }));
  };

  function tambahAjukan(e) {
    e.preventDefault();
    console.log(form);
    axios.post('http://localhost:5000/peminjaman', form)
      .then((res) => {
        toast.success(res.data.message);
        // Reset form setelah berhasil
        setForm({
            barang_id: '',
            jumlah: 1,
            tanggal_pinjam: '',
            tanggal_kembali: '',
            user_id: form.user_id, // Pertahankan user_id
            keterangan: '',
        });
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Terjadi Kesalahan';
        toast.error(msg);
      });
  }

  const getStockBarang = () => {
    if (!form.barang_id) return 0;
    const barangDipilih = listBarang.find(
      (barang) => barang.id === form.barang_id
    );
    return barangDipilih ? barangDipilih.stok : 0;
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto font-sans">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📤 Ajukan Peminjaman</h2>
      <form className="flex flex-col gap-5" onSubmit={tambahAjukan}>
        
        {/* Input Nama Barang */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-700 mb-1">Nama Barang</label>
          <select
            name="barang_id"
            value={form.barang_id}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">-- Pilih Barang --</option>
            {listBarang.map((barang) => (
              <option key={barang.id} value={barang.id}>
                {barang.nama} (Stok: {barang.stok})
              </option>
            ))}
          </select>
        </div>

        {/* Input Jumlah */}
        <div className="flex flex-col">
            <label className="font-bold text-gray-700 mb-1">Jumlah</label>
            <input
                type="number"
                name="jumlah"
                value={form.jumlah}
                onChange={handleChange}
                required
                min="1"
                max={getStockBarang()}
                className="p-2.5 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={!form.barang_id || getStockBarang() === 0}
            />
        </div>

        {/* Input Tanggal Pinjam */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-700 mb-1">Tanggal Pinjam</label>
          <input
            type="date"
            name="tanggal_pinjam"
            value={form.tanggal_pinjam}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Input Tanggal Kembali */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-700 mb-1">Tanggal Kembali</label>
          <input
            type="date"
            name="tanggal_kembali"
            value={form.tanggal_kembali}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Input Keterangan */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-700 mb-1">Keterangan (Opsional)</label>
          <textarea
            name="keterangan"
            value={form.keterangan}
            onChange={handleChange}
            rows={3}
            placeholder="Contoh: Untuk presentasi meeting"
            className="p-2.5 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white border-none py-3 px-4 rounded-md cursor-pointer font-bold text-base transition-colors hover:bg-blue-700 mt-2">
          Ajukan Sekarang
        </button>
      </form>
    </div>
  );
}

export default PengajuanUser;
