import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'sonner';
import axios from 'axios';

function TambahUser() {
  const navigate = useNavigate();

  // Semua state dan logika tidak diubah
  const [fullName, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dataAkun = {
    fullName: fullName,
    username: username,
    email: email,
    password: password,
    confirmPassword: confirmPassword
  };

  function onRegis(e) {
    e.preventDefault();
    
    axios.post('http://localhost:5000/register', dataAkun)
      .then((res) => {
        toast.success(res.data.message);
        // Mengosongkan form setelah berhasil
        setFullname('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Gagal terhubung ke server.');
        }
      });
  }

  return (
    <div className="relative w-full min-h-screen p-5 md:p-10 bg-gray-100 flex justify-center items-start md:items-center">
      
      {/* Tombol panah untuk kembali */}
      <div 
        className="absolute top-5 left-5 md:top-10 md:left-10 text-2xl text-gray-700 cursor-pointer transition-colors hover:text-blue-600 z-10" 
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </div>

      <form className="w-full max-w-2xl bg-white p-6 md:p-10 rounded-xl shadow-lg" onSubmit={onRegis}>
        <h2 className="text-center mb-6 text-2xl md:text-3xl font-semibold text-gray-800">Tambah Pengguna Baru</h2>
        
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Nama Lengkap</label>
          <input 
            type="text" 
            placeholder="Masukkan nama lengkap" 
            value={fullName}
            onChange={(e) => setFullname(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md text-base transition focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Username</label>
          <input 
            type="text" 
            placeholder="Masukkan username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md text-base transition focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Email</label>
          <input 
            type="email" 
            placeholder="Masukkan email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md text-base transition focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Password</label>
          <input 
            type="password" 
            placeholder="Masukkan password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md text-base transition focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Konfirmasi Password</label>
          <input 
            type="password" 
            placeholder="Ulangi password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md text-base transition focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button type="submit" className="w-full py-3.5 px-4 bg-blue-600 border-none text-white text-lg font-bold rounded-md cursor-pointer transition hover:bg-blue-700">
          Tambah User
        </button>
      </form>
    </div>
  );
}

export default TambahUser;
