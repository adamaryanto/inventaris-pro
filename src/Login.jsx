import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Fungsionalitas login tidak diubah sama sekali
  function onLogin(e) {
    e.preventDefault();
    const dataLogin = {
      identifier: username,
      password
    };
    axios.post('http://localhost:5000/login', dataLogin)
      .then((res) => {
        toast.success('Berhasil Login');
        const userId = res.data.user.id;
        localStorage.setItem('userId', userId);
        console.log("Respon backend (res.data):", res.data);
        console.log("TOKEN dari res.data.token:", res.data.token);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.user.username);

        const role = res.data.user.role;
        if (role === 'admin') {
          navigate('/dashboard-admin');
        } else if (role === 'user') {
          navigate('/dashboard-user');
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
          console.error("DETAIL:", err.response.data);
        } else {
          toast('Login Gagal');
          console.error("ERROR:", err);
        }
      });
  }

  return (
    // Container: flex-col & bg ungu di mobile, sm:flex-row di desktop
    <div className="flex h-screen flex-col sm:flex-row font-sans">
      
      {/* Sisi Kiri: Tersembunyi di mobile, tampil di desktop (sm:flex) */}
      <div className="hidden sm:flex w-1/2 bg-[#2f195f] text-white justify-center items-center">
        <img
          src="/src/Assets/Gemini_Generated_Image_6n9v4j6n9v4j6n9v-removebg-preview.png"
          alt="Logo"
          className="w-[310px] h-[310px]"
        />
      </div>

      {/* Sisi Kanan: Latar belakang berubah sesuai ukuran layar. Ditambahkan flex-1 agar memenuhi sisa layar di mobile */}
      <div className="w-full sm:w-1/2 bg-[#2f195f] sm:bg-white flex flex-1 justify-center items-center p-5">
        
        {/* Form Box: Styling berubah sesuai ukuran layar */}
        <div className="w-full max-w-xs p-6 sm:p-10 bg-transparent sm:bg-white sm:shadow-lg rounded-none sm:rounded-xl">
          
          <form onSubmit={onLogin}>
            {/* Logo Mobile: Tampil di mobile (block), tersembunyi di desktop (sm:hidden) */}
            <img
              src="/src/Assets/Gemini_Generated_Image_6n9v4j6n9v4j6n9v-removebg-preview.png"
              alt="Logo Mobile"
              className="block sm:hidden w-32 h-32 mx-auto mb-5"
            />

            {/* Judul: Warna teks berubah sesuai ukuran layar */}
            <h2 className="text-center text-white sm:text-[#2f195f] mb-6 text-2xl font-bold">
              Login
            </h2>
            
            <input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2.5 px-4 mb-4 border border-gray-300 rounded-full outline-none focus:border-[#2f195f] focus:ring-2 focus:ring-[#2f195f]/20 bg-white text-black sm:text-inherit"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-full outline-none focus:border-[#2f195f] focus:ring-2 focus:ring-[#2f195f]/20 bg-white text-black sm:text-inherit"
            />
            
            {/* Tombol Forgot Password */}
            <button 
              type="button" 
              className="block ml-auto -mt-1 mb-5 text-xs bg-transparent border-none text-white sm:text-[#2f195f] font-semibold cursor-pointer transition-colors duration-200 hover:text-gray-400"
            >
              Forgot Password?
            </button>

            {/* Grup Tombol */}
            <div className="flex justify-between gap-2.5">
              <button 
                type="submit" 
                className="flex-1 py-2.5 border-none rounded-full text-white font-bold cursor-pointer transition-colors duration-300 bg-[#2f195f] hover:bg-[#1e0f3d]"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
