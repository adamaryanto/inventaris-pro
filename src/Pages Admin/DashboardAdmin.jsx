import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Impor Fa-icons Anda tetap di sini...
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
} from 'react-icons/fa';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // <-- Tambahkan ini
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2'; // Tambahkan Line
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // <-- Tambahkan ini
  PointElement, 
  Title,
  Tooltip,
  Legend
);

function DashboardAdmin() {
  const [statistikBarang, setStatistikBarang] = useState({
    total_tersedia: 0,
    hampir_habis: 0,
  });

  const [chartType, setChartType] = useState('bar');
  const [jumlahPengguna, setJumlahPengguna] = useState(0); // Inisialisasi dengan 0
  const [permintaan, setPermintaan] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    // Ambil data peminjaman
    axios.get('http://localhost:5000/peminjaman')
      .then((res) => {
        setPermintaan(res.data);
      })
      .catch((err) => {
        console.error("Gagal ambil data peminjaman:", err);
      });

    // Ambil statistik barang
    axios.get('http://localhost:5000/barang/statistik')
      .then((res) => {
        setStatistikBarang(res.data);
      })
      .catch((err) => {
        console.error("Gagal ambil statistik barang:", err);
      });

    // Ambil jumlah pengguna
    axios.get('http://localhost:5000/users/count')
      .then((res) => {
        // PERBAIKAN DI SINI
        setJumlahPengguna(res.data.total_users); 
      })
      .catch((err) => {
        console.error("Gagal ambil jumlah pengguna:", err);
      });

    // Ambil nama profil pengguna
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:5000/profile?userId=${userId}`)
        .then((res) => {
          setName(res.data.fullName);
        })
        .catch((err) => {
          console.error("Gagal ambil profil:", err);
        });
    }
  }, []); // Dependensi array kosong agar useEffect hanya jalan sekali

  const totalPermintaan = permintaan.filter(item => item.status === 'pending').length;

   const chartData = {
    labels: ['Total Tersedia', 'Hampir Habis', 'Barang Habis', 'Permintaan Pending','jumlah Pengguna'],
    datasets: [
      {
        label: 'Jumlah Statistik',
        data: [
          statistikBarang.total_tersedia, 
          statistikBarang.hampir_habis, 
          statistikBarang.barang_habis,
          totalPermintaan,
          jumlahPengguna
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)', 
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

    const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ringkasan Statistik Inventaris',
      },
    },
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Selamat datang kembali, {name}</p>

      <div className="stat-card-container">
        <div className="stat-card blue">
          <div className="icon">📄</div>
          <div>
            <p className="label">Permintaan Peminjaman</p>
            <p className="value">{totalPermintaan}</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="icon">📦</div>
          <div>
            <p className="label">Total Barang Tersedia</p>
            <p className="value">{statistikBarang.total_tersedia}</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="icon">👥</div>
          <div>
            <p className="label">Pengguna</p>
            <p className="value">{jumlahPengguna}</p>
          </div>
        </div>

        <div className="stat-card red">
          <div className="icon">⚠️</div>
          <div>
            <p className="label">Hampir Habis</p>
            <p className="value">{statistikBarang.hampir_habis}</p>
          </div>
        </div>
        <div className="stat-card red">
          <div className="icon">⚠️</div>
          <div>
            <p className="label">Barang Habis</p>
            <p className="value">{statistikBarang.barang_habis}</p>
          </div>
        </div>
      </div>
         <div className="chart-toggle-buttons">
        <button 
          className={chartType === 'bar' ? 'active' : ''} 
          onClick={() => setChartType('bar')}
        >
          Column Chart
        </button>
        <button 
          className={chartType === 'line' ? 'active' : ''} 
          onClick={() => setChartType('line')}
        >
          Line Chart
        </button>
      </div>
      <div className="chart-container">
        {chartType === 'bar' ? (
          <Bar options={chartOptions} data={chartData} />
        ) : (
          <Line options={chartOptions} data={chartData} />
        )}
      </div>

    </div>
  );
}

export default DashboardAdmin;