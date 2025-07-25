import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/PengembalianBarangUser.css'; // Nama file CSS baru
import axios from 'axios';
import { toast } from 'sonner';
function PengembalianBarangUser() {
  // Data dummy untuk contoh tampilan
  const [barangDipinjam,setBarangDipinjam] = useState([])

  useEffect(()=>{
    const userId = localStorage.getItem('userId')
    axios.get(`http://localhost:5000/users/${userId}/peminjaman/disetujui`)
    .then((res)=>{
      setBarangDipinjam(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])

  function onReturn(id){
    axios.patch(`http://localhost:5000/peminjaman/${id}/ajukan-pengembalian`)
    .then((ress)=>{
      toast.success('Barang Berhasil Di Kembalikan')
      
    })
    .catch((err)=>{
      toast.error(err)
    })
  }
  
  return (
    <div className="user-pengembalian-container">
      <h2>Barang Pinjaman Anda</h2>
      <p>Ajukan pengembalian untuk barang yang sudah selesai Anda gunakan.</p>

      <div className="card-list-pengembalian">
        {barangDipinjam.map((item) => (
          <div className="kartu-barang" key={item.id}>
            <div className="kartu-header">
              <h3>{item.namaBarang}</h3>
              <span className="jumlah">Jumlah: {item.jumlah}</span>
            </div>
            <div className="kartu-body">
              <div className="detail-item">
                <span>Tanggal Pinjam:</span>
                <p>{item.tanggalPinjam}</p>
              </div>
              <div className="detail-item">
                <span>Wajib Kembali:</span>
                <p>{item.tanggalKembali}</p>
              </div>
            </div>
            <div className="kartu-footer">
              <button className="btn-kembalikan" onClick={()=>onReturn(item.id)}>
                Ajukan Pengembalian
              </button>
            </div>
          </div>
        ))} 
      </div>
    </div>
  );
}

export default PengembalianBarangUser;