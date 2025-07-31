import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUpload,
  FaListAlt,
  FaHourglassHalf,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaUndo
} from 'react-icons/fa';

function LayoutUser() {
  // State untuk sidebar desktop (lebar/sempit)
  const [collapsed, setCollapsed] = useState(false);
  // State untuk sidebar mobile (buka/tutup)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // redirect ke login kalau belum login
    }
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:5000/profile?userId=${userId}`)
        .then((res) => {
          setName(res.data.fullName);
          setRole(res.data.role);
        })
        .catch((err) => {
          console.error("Gagal ambil profil:", err);
        });
    }
  }, [navigate]);

  // Fungsi toggle untuk sidebar desktop
  const toggleSidebar = () => setCollapsed(!collapsed);
  // Fungsi toggle untuk sidebar mobile
  const toggleMobileSidebar = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const menuItems = [
    { path: '/dashboard-user', icon: <FaHome />, label: 'Dashboard' },
    { path: '/dashboard-user/ajukan', icon: <FaUpload />, label: 'Ajukan Peminjaman' },
    { path: '/dashboard-user/riwayat', icon: <FaListAlt />, label: 'Riwayat Peminjaman' },
    { path: '/dashboard-user/pengembalian', icon: <FaUndo />, label: 'Pengembalian Barang' },
    { path: '/dashboard-user/status', icon: <FaHourglassHalf />, label: 'Status Pengajuan' },
    { path: '/dashboard-user/profil', icon: <FaUser />, label: 'Profil' },
  ];

  const handleLogout = () => {
    // Menggunakan window.confirm untuk kompatibilitas yang lebih baik
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Hapus juga item lain yang relevan
        localStorage.removeItem('userName');
        navigate('/');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fa] font-sans">
      {/* Overlay untuk mobile saat menu terbuka */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        bg-[#2c3e50] text-white 
        flex flex-col justify-between 
        transition-all duration-300 ease-in-out
        fixed md:relative h-screen z-50 
        
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 
        ${collapsed ? 'w-[70px]' : 'w-[250px]'}
      `}>
        <div>
          {/* Header Sidebar */}
          <div className="flex items-center justify-between p-4 bg-[#1a252f] font-bold">
            {!collapsed && (
              <div className="whitespace-nowrap transition-opacity duration-300">
                <p className="text-base m-0">{name}</p>
                <p className="text-xs text-gray-400">{role}</p>
              </div>
            )}
            <button className="bg-transparent border-none text-white text-xl cursor-pointer" onClick={toggleSidebar}>
              <FaBars />
            </button>
          </div>

          {/* Menu List */}
          <ul className="list-none p-0 m-0">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-5 py-3 text-white no-underline 
                    transition-colors duration-200 ease-in-out
                    hover:bg-[#34495e]
                    ${location.pathname === item.path ? 'bg-[#34495e]' : ''}
                  `}
                  onClick={() => { if (isMobileMenuOpen) setIsMobileMenuOpen(false); }}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span className="ml-2.5 whitespace-nowrap">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Logout Section */}
        <div 
          className="px-5 py-4 cursor-pointer flex items-center bg-[#e74c3c] text-white transition-colors duration-200 ease-in-out hover:bg-[#c0392b]" 
          onClick={handleLogout}
        >
          <span className="text-lg"><FaSignOutAlt /></span>
          {!collapsed && <span className="ml-2.5 whitespace-nowrap">Logout</span>}
        </div>
      </div>

      {/* Konten Utama */}
      <div className="flex-grow p-6 relative">
        {/* Tombol hamburger untuk mobile */}
        <button 
            className="md:hidden fixed top-5 left-5 z-20 bg-[#2c3e50] text-white p-3 rounded-full shadow-lg"
            onClick={toggleMobileSidebar}
        >
            <FaBars />
        </button>
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutUser;
