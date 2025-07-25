import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/ProfileAdmin.css'; // Jangan lupa impor file CSS
import axios from 'axios';
import { toast } from 'sonner';
function Pengaturan() {
  // Data dummy untuk contoh, bisa diambil dari state atau localStorage
  const [user,setUser] = useState('')
  const [oldPassword,setOldPassword] = useState('')
  const [newPassword,setNewPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')


  useEffect(()=>{
    const userId = localStorage.getItem('userId')
    axios.get(`http://localhost:5000/profile?userId=${userId}`)
    .then((res) => {
      setUser(res.data.fullName);
    })
    .catch((err) => {
      console.error("Gagal ambil profil:", err);
    });
 
    console.log(userId)
    
  },[])

  function onSave(e){
    e.preventDefault()
    const userId = localStorage.getItem('userId')

      const dataPassword = {
      currentPassword:oldPassword,
      newPassword:newPassword,
      confirmPassword:confirmPassword
      }

    axios.patch(`http://localhost:5000/users/${userId}/password`,dataPassword)
    .then((res)=>{
      toast.success('Password Berhasil Di Ubah')
    })
    .catch((err)=>{
      toast.error(err)
    })
  }
  return (
    <div className="pengaturan-container">
      <h2>⚙️ Pengaturan Akun</h2>
      <p className="greeting">Halo, {user}! Di sini Anda bisa mengubah pengaturan akun Anda.</p>

      <div className="pengaturan-card">
        <h3>Ubah Password</h3>
        <form className="pengaturan-form" onSubmit={onSave}>
          <div className="form-group">
            <label>Password Saat Ini</label>
            <input type="password" placeholder="Masukkan password lama Anda" onChange={(e)=>setOldPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password Baru</label>
            <input type="password" placeholder="Masukkan password baru" onChange={(e)=>setNewPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Konfirmasi Password Baru</label>
            <input type="password" placeholder="Ulangi password baru Anda" onChange={(e)=>setConfirmPassword(e.target.value)} />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" >Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Pengaturan;