import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/LayoutAdmin.css';
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
    if (confirm("Yakin ingin logout?")) {
      localStorage.clear(); // Bersihkan semua localStorage untuk keamanan
      navigate('/');
    }
  }

  return (
    <div className="dashboard-container">
      {/* Overlay yang hanya muncul di mode mobile saat sidebar terbuka */}
      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={toggleMobileSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && (
            <div className="user-info">
              <p className="user-name">{name}</p>
              <p className="user-role">{role}</p>
            </div>
          )}
          {/* Tombol ini hanya untuk mode desktop */}
          <button className="toggle-btn desktop-only" onClick={toggleDesktopSidebar}>
            <FaBars />
          </button>
        </div>

        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
                // Saat link di mobile diklik, tutup sidebar
                onClick={() => { if (isMobileMenuOpen) setIsMobileMenuOpen(false) }}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <div className="logout-section" title='Logout' onClick={handleLogout}>
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>

      {/* Konten Halaman */}
      <div className="content">
        {/* Tombol "hamburger" yang hanya muncul di mobile untuk MEMBUKA menu */}
        <button className="mobile-toggle-btn" onClick={toggleMobileSidebar}>
          <FaBars />
        </button>
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutAdmin;