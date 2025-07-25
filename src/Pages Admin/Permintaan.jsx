import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/Permintaan.css';
import axios from 'axios';
import { toast } from 'sonner';

function Permintaan() {
  const [dataPermintaan,setDataPermintaan] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/peminjaman')
    .then((res)=>{
      setDataPermintaan(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])
  function onAcc(id){
    
    axios.put(`http://localhost:5000/peminjaman/${id}/setujui`)
    
    
    .then((res)=>{
      toast.success('Peminjaman disetujui');
    })
    .catch((err)=>{
      toast.error(err)
    },[])
  }
  function onReject(id){
    axios.put(`http://localhost:5000/peminjaman/${id}/tolak`)
    .then((res)=>{
      toast.success('Peminjaman Di Tolak')
    })
    .catch((err)=>{
      toast.error(err)
    })
  }
  return (
    <div className="permintaan-container">
      <h2>📄 Permintaan Peminjaman</h2>

      <table className="table-permintaan">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Pengguna</th>
            <th>Barang</th>
            <th>Jumlah</th>
            <th>Tanggal Peminjaman</th>
            <th>Tanggal Kembalikan</th>
            <th>Keterangan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          
          {dataPermintaan.filter(item=>item.status === 'pending')
          .map((item, index) => (
            
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nama_user}</td>
              <td>{item.nama_barang}</td>
              <td>{item.jumlah}</td>
              <td>{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
              <td>{item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</td>
              <td>{item.keterangan}</td>
              <td>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>
              <td>
                {item.status === 'pending' ? (
                  <div className='btnAction'>
                    <button className="setujui-btn" onClick={()=> onAcc(item.id)}>Setujui</button>
                    <button className="tolak-btn" onClick={()=> onReject(item.id)}>Tolak</button>
                  </div>
                ) : (
                  <i>-</i>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Permintaan;
