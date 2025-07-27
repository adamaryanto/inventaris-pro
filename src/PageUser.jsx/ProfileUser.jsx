import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function ProfileUser() {
  // Data user asli (bisa dari backend/localStorage)
  const [user, setUser] = useState({
    nama: '',
    username: '',
    email: '',
    role: 'user',
    bergabung: ''
  });

  // State untuk mengontrol mode edit
  const [isEditing, setIsEditing] = useState(false);
  // State untuk menampung data yang sedang diedit di form
  const [editData, setEditData] = useState({
    nama: user.nama,
    username: user.username,
    email: user.email
  });

  // Fungsi untuk menangani perubahan pada input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    const id = localStorage.getItem('userId');
    axios.get(`http://localhost:5000/users/${id}/detail`)
      .then((res) => {
        // Menggunakan nama properti yang konsisten dari backend
        const userData = {
            nama: res.data.fullName,
            username: res.data.username,
            email: res.data.email,
            role: res.data.role,
            bergabung: new Date(res.data.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric'
            })
        };
        setUser(userData);
        setEditData(userData);
      })
      .catch((err) => {
        console.error("Gagal mengambil profil:", err);
      });
  }, []);
  
  // Fungsi untuk menyimpan perubahan (logika backend ditambahkan di sini)
  const handleSave = (e) => {
    e.preventDefault();
    console.log("Data yang disimpan:", editData);
    const dataUpdate = {
      fullName: editData.nama,
      username: editData.username,
      email: editData.email // Memungkinkan email diubah
    };
    const id = localStorage.getItem('userId');
    axios.put(`http://localhost:5000/users/${id}`, dataUpdate)
      .then((res) => {
        toast.success('Profil Berhasil Diperbarui');
        setUser(prevUser => ({ ...prevUser, ...editData })); // Update tampilan lokal
        setIsEditing(false); // Kembali ke mode tampilan
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : 'Gagal menyimpan perubahan.';
        toast.error(message);
        console.log(err);
      });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-lg font-sans">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">👤 Profil Pengguna</h2>

      {/* Tampilkan form edit jika isEditing true, jika tidak tampilkan profil biasa */}
      {isEditing ? (
        // --- FORM EDIT ---
        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          {/* Input Nama Lengkap */}
          <div className="flex flex-col">
            <label htmlFor="nama" className="font-bold text-gray-600 mb-1">Nama Lengkap:</label>
            <input 
              id="nama"
              name="nama"
              type="text" 
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              value={editData.nama} 
              onChange={handleInputChange} 
            />
          </div>
          {/* Input Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className="font-bold text-gray-600 mb-1">Username:</label>
            <input 
              id="username"
              name="username"
              type="text" 
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              value={editData.username} 
              onChange={handleInputChange} 
            />
          </div>
          {/* Input Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="font-bold text-gray-600 mb-1">Email:</label>
            <input 
              id="email"
              name="email"
              type="email" 
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              value={editData.email} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-md font-bold transition-colors hover:bg-gray-300" onClick={() => setIsEditing(false)}>Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-md font-bold transition-colors hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      ) : (
        // --- TAMPILAN PROFIL BIASA ---
        <div className="flex flex-col gap-4">
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="font-bold text-gray-600">Nama Lengkap:</span>
            <span className="text-gray-800">{user.nama}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="font-bold text-gray-600">Username:</span>
            <span className="text-gray-800">{user.username}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="font-bold text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="font-bold text-gray-600">Role:</span>
            <span className="text-gray-800 capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="font-bold text-gray-600">Bergabung Sejak:</span>
            <span className="text-gray-800">{user.bergabung}</span>
          </div>
          <div className="flex justify-end mt-8">
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-md font-bold transition-colors hover:bg-blue-700" onClick={() => setIsEditing(true)}>Edit Profil</button>
            {/* Tombol logout bisa ditambahkan di sini jika perlu */}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileUser;
