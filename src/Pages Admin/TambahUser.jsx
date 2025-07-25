import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Impor useNavigate
import { FaArrowLeft } from 'react-icons/fa';      // 2. Impor ikon panah
import '../Kumpulan.css/TambahUser.css';
import { toast } from 'sonner';
import axios from 'axios';

function TambahUser() {
  const navigate = useNavigate(); // 3. Inisialisasi hook navigasi

  const [fullName,setFullname] = useState('')
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')

  const dataAkun = {
    fullName:fullName,
    username:username,
    email: email,
    password: password,
    confirmPassword: confirmPassword
  }
  function onRegis(e){
    e.preventDefault()
    
    axios.post('http://localhost:5000/register',dataAkun)
    .then((res)=>{
        toast.success(res.data.message)
        setFullname('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    })
    .catch((err)=>{
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Gagal terhubung ke server.');
        }
    })

  }
  return (
    <div className="form-container-fullscreen"> {/* Ganti nama class agar lebih jelas */}
      
      {/* 4. Tambahkan elemen panah kembali */}
      <div className="back-arrow" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </div>

      <form className="form-box" onSubmit={onRegis}>
        <h2>Tambah Pengguna Baru</h2>
        <div className="form-group">
          <label>Nama Lengkap</label>
          <input type="text" placeholder="Masukkan nama lengkap" onChange={(e)=> setFullname(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input type="text" placeholder="Masukkan username" onChange={(e)=> setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Masukkan email" onChange={(e)=> setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Masukkan password" onChange={(e)=> setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Konfirmasi Password</label>
          <input type="password" placeholder="Ulangi password" onChange={(e)=> setConfirmPassword(e.target.value)} required />
        </div>

        <button type="submit" className="btn-submit" >Tambah User</button>
      </form>
    </div>
  );
}

export default TambahUser;