import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/AjukanUser.css';
import axios from 'axios';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

function Ajukan() {
  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)
  const userId= decoded.id
  const [form, setForm] = useState({
    barang_id: '',
    jumlah: 1,
    tanggal_pinjam: '',
    tanggal_kembali: '',
    user_id: userId,
    keterangan: 'tes',
  });




  const [listBarang, setListBarang] = useState([]);

  useEffect(() => {
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
      [name]: name === 'barang_id' ? parseInt(value) : value,
    }));
  };

  function tambahAjukan(e){
    e.preventDefault()
    console.log(form)
    axios.post('http://localhost:5000/peminjaman', form)
    .then((res)=>{
      toast.success(res.data.message)
      console.log(userId)
    })
    .catch((err)=>{
      const msg = err.response?.data?.message || 'Terjadi Kesalahan';
      toast.error(msg);
    })
  }

  const getStockBarang = () => {
    const barangDipilih = listBarang.find(
      (barang) => barang.id === parseInt(form.barang_id)
    );
    return barangDipilih ? barangDipilih.stok : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data yang diajukan:', form);
    // TODO: Kirim ke backend pakai axios
  };


  return (
    <div className="ajukan-container">
      <h2>📤 Ajukan Peminjaman</h2>
      <form className="form-ajukan" onSubmit={tambahAjukan}>
        Nama Barang:
        <select
          name="barang_id"
          value={form.barang_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Pilih Barang --</option>
          {listBarang.map((barang) => (
            <option key={barang.id} value={barang.id}>
              {barang.nama}
            </option>
          ))}
        </select>

        <select
          name="jumlah"
          value={form.jumlah}
          onChange={handleChange}
          required
        >
          <option value="">-- Pilih Jumlah --</option>
          {[...Array(getStockBarang())].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        {form.namaBarang && (
          <p>Stok tersedia: {getStockBarang()}</p>
        )}

        <label>
          Tanggal Pinjam:
          <input
            type="date"
            name="tanggal_pinjam"
            value={form.tanggal_pinjam}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Tanggal Kembali:
          <input
            type="date"
            name="tanggal_kembali"
            value={form.tanggal_kembali}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Keterangan (Opsional):
          <textarea
            name="keterangan"
            value={form.keterangan}
            onChange={handleChange}
            rows={3}
            placeholder="Contoh: Untuk presentasi meeting"
          />
        </label>

        <button type="submit" className="btn-ajukan" >
          Ajukan Sekarang
        </button>
      </form>
    </div>
  );
}

export default Ajukan;
