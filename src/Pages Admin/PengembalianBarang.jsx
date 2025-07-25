import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/PengembalianBarang.css'; // Jangan lupa impor file CSS
import axios from 'axios';
import { toast } from 'sonner';

function PengembalianBarang() {
  const [daftarKonfirmasi, setDaftarKonfirmasi] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/peminjaman/menunggu-konfirmasi')
    .then((res)=>{
        setDaftarKonfirmasi(res.data)
    })
    .catch((err)=>{
        console.log(err)
    })
  },[])

  function handleConfirm(id){
    axios.patch(`http://localhost:5000/peminjaman/${id}/konfirmasi-kembali`)
    .then((res)=>{
        toast.success(res.data.message)
        setDaftarKonfirmasi(prev=>prev.filter(item=>item.id!==item.id))
    })
    .catch((err)=>{
        toast.error(err.response?.data?.message || 'Gagal menyetujui.');
    })
  }

  return (
    <div className="pengembalian-container">
      <h2>↩️ Pengembalian Barang</h2>
      <p>Daftar barang yang telah dikembalikan oleh pengguna.</p>
      
      <table className="table-pengembalian">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Peminjam</th>
            <th>Nama Barang</th>
            <th>Jumlah</th>
            <th>Tanggal Pinjam</th>
            <th>Tanggal Kembali</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {daftarKonfirmasi.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nama_user}</td>
              <td>{item.nama_barang}</td>
              <td>{item.jumlah}</td>
              <td>{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
              <td>{item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</td>
              <td className='btnGroup'>
                <button className='btnTerima' onClick={()=>handleConfirm(item.id)}>Setujui</button>
                <button className='btnReject'>Tolak</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PengembalianBarang;