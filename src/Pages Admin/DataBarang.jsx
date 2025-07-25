import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/DataBarang.css';
import axios from 'axios';
import { toast } from 'sonner';

function DataBarang() {
  const [listBarang, setListBarang] = useState([]);
  const [formTambahVisible, setFormTambahVisible] = useState(false);
  const [formEditVisible, setFormEditVisible] = useState(false);

  const [inputNama, setInputNama] = useState('');
  const [inputLokasi, setInputLokasi] = useState('');
  const [inputStok, setInputStok] = useState('');
  const [inputKategori, setInputKategori] = useState('');
  const [inputKode, setInputKode] = useState('');

  const [idBarangEdit,setIdBarangEdit] = useState('')

  const [barangEdit,setBarangEdit] = useState({
    nama:'',
    lokasi:'',
    stok:'',
    kategori:'',
    kode:'',
  })
  const dataEdit = {
    nama: barangEdit.nama,
    lokasi:barangEdit.lokasi,
    stok:barangEdit.stok,
    kategori:barangEdit.kategori,
    kodeBarang:barangEdit.kode
  }
  const dataBarang = {
    nama: inputNama,
    lokasi: inputLokasi,
    stok: inputStok,
    kategori: inputKategori,
    kodeBarang: inputKode
  };

  function handleDelete(id) {
    if (window.confirm('Yakin Ingin Menghapus Barang Ini??')) {
      axios.delete(`http://localhost:5000/barang/${id}`)
        .then((res) => {
          toast.success(res.data.message);
          setListBarang((prev) => prev.filter((item) => item.id !== id));
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || 'Gagal Menghapus Barang');
          console.log(err);
        });
    }
  }

  useEffect(() => {
    axios.get('http://localhost:5000/barang')
      .then((res) => {
        setListBarang(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [listBarang]);

  function tambahBarang(e) {
    e.preventDefault();
    axios.post('http://localhost:5000/barang', dataBarang)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Terjadi Kesalahan';
        toast.error(msg);
      });
      setFormTambahVisible(false)
    console.log(dataBarang);
    console.log(listBarang);
  }

  function editBarang(e) {
    e.preventDefault();
    axios.put(`http://localhost:5000/barang/${idBarangEdit}`, dataEdit)
    .then((ress)=>{
      toast.success('Item Berhasil Di Ubah')
      setFormEditVisible(false)
    })
    .catch((err)=>{
      const msg = err.response?.data?.message || 'Gagal update data';
      toast.error(msg);
    })
    console.log(dataEdit)
  }

  return (
    <div className="data-barang-container">
      <div className="header-barang">
        <h2>📦 Data Barang</h2>
        <button className="tambah-btn" onClick={() => setFormTambahVisible(true)}>
          + Tambah Barang
        </button>
      </div>

      {formTambahVisible && (
        <form className="form-barang" onSubmit={tambahBarang}>
          <div className="form-group">
            <input className="input-field" type="text" placeholder="Kode Barang" onChange={(e) => setInputKode(e.target.value)} />
            <input className="input-field" type="text" placeholder="Nama Barang" onChange={(e) => setInputNama(e.target.value)} />
            <input className="input-field" type="text" placeholder="Lokasi Barang" onChange={(e) => setInputLokasi(e.target.value)} />
            <input className="input-field" type="number" placeholder="Jumlah Barang" onChange={(e) => setInputStok(e.target.value)} />
            <input className="input-field" type="text" placeholder="Kategori" onChange={(e) => setInputKategori(e.target.value)} />
          </div>
          <div className="btnTambahGroup">
            <button className="submit-btn">Kirim</button>
            <button className="btnBatal" onClick={() => setFormTambahVisible(false)}>Cancel</button>
          </div>
        </form>
      )}

      {formEditVisible && (
        <form className="form-barang" onSubmit={editBarang} >
          <div className="form-group">
            <input className="input-field" type="text" placeholder="Kode Barang" value={barangEdit.kode} onChange={(e) => setBarangEdit({...barangEdit,kode: e.target.value})} />
            <input className="input-field" type="text" placeholder="Nama Barang" value={barangEdit.nama} onChange={(e) => setBarangEdit({...barangEdit,nama: e.target.value})} />
            <input className="input-field" type="text" placeholder="Lokasi Barang" value={barangEdit.lokasi} onChange={(e) => setBarangEdit({...barangEdit,lokasi: e.target.value})} />
            <input className="input-field" type="number" placeholder="Jumlah Barang" value={barangEdit.stok} onChange={(e) => setBarangEdit({...barangEdit,stok: e.target.value})} />
            <input className="input-field" type="text" placeholder="Kategori" value={barangEdit.kategori} onChange={(e) => setBarangEdit({...barangEdit,kategori: e.target.value})}/>
          </div>
          <div className="btnTambahGroup">
            <button className="submit-btn"  >Edit</button>
            <button className="btnBatal" onClick={() => setFormEditVisible(false)}>Cancel</button>
          </div>
        </form>
      )}

      <table className="table-barang">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>Stok</th>
            <th>Lokasi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {listBarang.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nama}</td>
              <td>{item.kategori}</td>
              <td>{item.stok}</td>
              <td>{item.lokasi}</td>
              <td>
                <button className="edit-btn" onClick={() => {
                  setFormEditVisible(true); setIdBarangEdit(item.id);
                    setBarangEdit({
                    nama: item.nama,
                    lokasi: item.lokasi,
                    stok: item.stok,
                    kategori: item.kategori,
                    kode: item.kodeBarang,
                  });
                  }}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataBarang;
