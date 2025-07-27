import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaBars,
  FaBox,
  FaClipboardList,
  FaExchangeAlt,
  FaUsers,
  FaChartPie,
  FaCog,
  FaTachometerAlt,
  FaSignOutAlt,
  FaUndo
} from 'react-icons/fa';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

function LayoutAdmin() {
  // State untuk sidebar di mode desktop (lebar/sempit)
  const [collapsed, setCollapsed] = useState(false);
  // State untuk sidebar di mode mobile (buka/tutup)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi toggle untuk sidebar desktop
  const toggleDesktopSidebar = () => setCollapsed(!collapsed);
  // Fungsi toggle untuk sidebar mobile
  const toggleMobileSidebar = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
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

  const menuItems = [
    { path: '/dashboard-admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/dashboard-admin/data-barang', icon: <FaBox />, label: 'Data Barang' },
    { path: '/dashboard-admin/permintaan', icon: <FaClipboardList />, label: 'Permintaan Peminjaman' },
    { path: '/dashboard-admin/pengembalian', icon: <FaUndo />, label: 'Konfirmasi Pengembalian' },
    { path: '/dashboard-admin/riwayat', icon: <FaExchangeAlt />, label: 'Riwayat Peminjaman' },
    { path: '/dashboard-admin/manajemen-user', icon: <FaUsers />, label: 'Manajemen User' },
    { path: '/dashboard-admin/laporan', icon: <FaChartPie />, label: 'Laporan / Export' },
    { path: '/dashboard-admin/pengaturan', icon: <FaCog />, label: 'Pengaturan Akun' },
  ];

  function handleLogout() {
    // Menggunakan window.confirm karena confirm() mungkin tidak berfungsi di beberapa environment
    if (window.confirm("Yakin ingin logout?")) {
      localStorage.clear(); // Bersihkan semua localStorage untuk keamanan
      navigate('/');
    }
  }

  return (
    <div className="flex h-screen font-sans bg-[#f7f0ff]">
      {/* Overlay yang hanya muncul di mode mobile saat sidebar terbuka */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[999] md:hidden" 
          onClick={toggleMobileSidebar}>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        bg-[#6a0dad] text-white 
        flex flex-col justify-between flex-shrink-0
        transition-all duration-300 ease-in-out
        fixed md:relative h-full z-[1000] 
        ${isMobileMenuOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'}
        md:translate-x-0 
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
        <div>
          <div className={`
            flex items-center justify-between 
            p-4 border-b border-[#5a009d]
          `}>
            {!collapsed && (
              <div className="opacity-100 transition-opacity duration-300 whitespace-nowrap">
                <p className="font-bold text-base">{name}</p>
                <p className="text-xs text-[#e0cffc]">{role}</p>
              </div>
            )}
            {/* Tombol ini hanya untuk mode desktop */}
            <button className="hidden md:block bg-transparent border-none text-white text-xl cursor-pointer p-2" onClick={toggleDesktopSidebar}>
              <FaBars />
            </button>
          </div>

          <ul className="list-none p-0 m-0 flex-grow overflow-y-auto">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center text-[#e0cffc] no-underline gap-4 px-6 py-3.5 text-[0.95rem] whitespace-nowrap 
                    transition-colors duration-200 
                    hover:bg-[#5a009d] hover:text-white
                    ${location.pathname === item.path ? 'bg-[#4a008d] text-white font-bold' : ''}
                  `}
                  // Saat link di mobile diklik, tutup sidebar
                  onClick={() => { if (isMobileMenuOpen) setIsMobileMenuOpen(false); }}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span className="opacity-100 transition-opacity duration-300">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div 
          className="px-6 py-4 flex items-center cursor-pointer gap-4 border-t border-[#5a009d] text-[0.95rem] whitespace-nowrap hover:bg-[#5a009d]" 
          title='Logout' 
          onClick={handleLogout}
        >
          <span className="text-lg"><FaSignOutAlt /></span>
          {!collapsed && <span className="opacity-100 transition-opacity duration-300">Logout</span>}
        </div>
      </div>

      {/* Konten Halaman */}
      <div className="flex-grow p-6 overflow-y-auto relative z-10">
        {/* Tombol "hamburger" yang hanya muncul di mobile untuk MEMBUKA menu */}
        <button 
          className="md:hidden absolute top-4 left-4 z-20 bg-[#6a0dad] text-white border-none rounded-full w-11 h-11 text-xl cursor-pointer shadow-md flex justify-center items-center" 
          onClick={toggleMobileSidebar}
        >
          <FaBars />
        </button>
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutAdmin;
