import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../Kumpulan.css/LayoutUser.css';
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
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const toggleMenu = () => setOpen(!open);
  const navigate = useNavigate()
     useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
           // redirect ke login kalau belum login
        }
      }, []);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    { path: '/dashboard-user', icon: <FaHome />, label: 'Dashboard' },
    { path: '/dashboard-user/ajukan', icon: <FaUpload />, label: 'Ajukan Peminjaman' },
    { path: '/dashboard-user/riwayat', icon: <FaListAlt />, label: 'Riwayat Peminjaman' },
    { path: '/dashboard-user/pengembalian', icon: <FaUndo />, label: 'Pengembalian Barang' },
    { path: '/dashboard-user/status', icon: <FaHourglassHalf />, label: 'Status Pengajuan' },
    { path: '/dashboard-user/profil', icon: <FaUser />, label: 'Profil' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
        
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        
        <div className="sidebar-header">
          {!collapsed && (
            <div>
              <p className="user-name">User</p>
              <p className="user-role">Pengguna</p>
            </div>
          )}
          <button className="toggle-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>

        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
          
        <div className="logout-section" onClick={handleLogout}>
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutUser;
