import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function ProfileAdmin() {
  // Semua state dan logika tidak diubah
  const [user, setUser] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        axios.get(`http://localhost:5000/profile?userId=${userId}`)
            .then((res) => {
                setUser(res.data.fullName);
            })
            .catch((err) => {
                console.error("Gagal ambil profil:", err);
            });
    }
  }, []);

  function onSave(e) {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    
    const dataPassword = {
      currentPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    };

    axios.patch(`http://localhost:5000/users/${userId}/password`, dataPassword)
      .then((res) => {
        toast.success('Password Berhasil Di Ubah');
        // Kosongkan field setelah berhasil
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Gagal mengubah password.";
        toast.error(message);
        console.error(err);
      });
  }

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 text-center">⚙️ Pengaturan Akun</h2>
      <p className="text-center text-gray-500 mt-0 mb-8">Halo, {user}! Di sini Anda bisa mengubah pengaturan akun Anda.</p>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h3 className="mt-0 mb-6 pb-4 border-b border-gray-200 text-xl font-bold text-gray-800">Ubah Password</h3>
        <form className="pengaturan-form" onSubmit={onSave}>
          
          <div className="flex flex-col mb-6">
            <label className="font-bold text-gray-600 mb-2">Password Saat Ini</label>
            <input 
              type="password" 
              placeholder="Masukkan password lama Anda" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex flex-col mb-6">
            <label className="font-bold text-gray-600 mb-2">Password Baru</label>
            <input 
              type="password" 
              placeholder="Masukkan password baru" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex flex-col mb-6">
            <label className="font-bold text-gray-600 mb-2">Konfirmasi Password Baru</label>
            <input 
              type="password" 
              placeholder="Ulangi password baru Anda" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end mt-8">
            <button 
              type="submit" 
              className="py-3 px-6 border-none rounded-md cursor-pointer font-bold transition-colors duration-200 bg-blue-600 text-white text-base hover:bg-blue-700"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileAdmin;
