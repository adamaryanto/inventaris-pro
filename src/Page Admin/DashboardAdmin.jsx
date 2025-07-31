import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Registrasi komponen ChartJS tidak diubah
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, 
  Title,
  Tooltip,
  Legend
);

function DashboardAdmin() {
  // Semua state dan logika useEffect tidak diubah
  const [statistikBarang, setStatistikBarang] = useState({
    total_tersedia: 0,
    hampir_habis: 0,
    barang_habis: 0,
  });
  const [chartType, setChartType] = useState('bar');
  const [jumlahPengguna, setJumlahPengguna] = useState(0);
  const [permintaan, setPermintaan] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/peminjaman')
      .then((res) => setPermintaan(res.data))
      .catch((err) => console.error("Gagal ambil data peminjaman:", err));

    axios.get('http://localhost:5000/barang/statistik')
      .then((res) => setStatistikBarang(res.data))
      .catch((err) => console.error("Gagal ambil statistik barang:", err));

    axios.get('http://localhost:5000/users/count')
      .then((res) => setJumlahPengguna(res.data.total_users))
      .catch((err) => console.error("Gagal ambil jumlah pengguna:", err));

    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:5000/profile?userId=${userId}`)
        .then((res) => setName(res.data.fullName))
        .catch((err) => console.error("Gagal ambil profil:", err));
    }
  }, []);

  const totalPermintaan = permintaan.filter(item => item.status === 'pending').length;

  const chartData = {
    labels: ['Total Tersedia', 'Hampir Habis', 'Barang Habis', 'Permintaan Pending', 'Jumlah Pengguna'],
    datasets: [{
      label: 'Jumlah Statistik',
      data: [
        statistikBarang.total_tersedia, 
        statistikBarang.hampir_habis, 
        statistikBarang.barang_habis,
        totalPermintaan,
        jumlahPengguna
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)',
        'rgba(153, 102, 255, 0.6)', 'rgba(75, 192, 192, 0.6)', 
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)',
        'rgba(153, 102, 255, 1)', 'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Ringkasan Statistik Inventaris' },
    },
  };
  
  // Kelas dasar untuk kartu statistik
  const baseCardClasses = "flex items-center p-6 rounded-xl shadow-md transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg";
  const baseIconClasses = "flex justify-center items-center w-12 h-12 text-2xl rounded-full mr-5";
  
  return (
    <div className="font-sans">
      <h1 className="text-3xl text-gray-900 mb-2 font-bold">Dashboard</h1>
      <p className="text-lg text-gray-500 mt-0 mb-8">Selamat datang kembali, {name}</p>

      {/* Container untuk kartu statistik */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 bg-white p-4 shadow-md rounded-3xl">
        
        <div className={`${baseCardClasses} bg-sky-100`}>
          <div className={`${baseIconClasses} bg-sky-200 text-sky-800`}>📄</div>
          <div>
            <p className="text-sm text-gray-600 m-0">Permintaan Peminjaman</p>
            <p className="text-3xl font-bold m-0 mt-1 text-sky-700">{totalPermintaan}</p>
          </div>
        </div>

        <div className={`${baseCardClasses} bg-emerald-50`}>
          <div className={`${baseIconClasses} bg-emerald-200 text-emerald-800`}>📦</div>
          <div>
            <p className="text-sm text-gray-600 m-0">Total Barang Tersedia</p>
            <p className="text-3xl font-bold m-0 mt-1 text-emerald-700">{statistikBarang.total_tersedia}</p>
          </div>
        </div>

        <div className={`${baseCardClasses} bg-violet-50`}>
          <div className={`${baseIconClasses} bg-violet-200 text-violet-800`}>👥</div>
          <div>
            <p className="text-sm text-gray-600 m-0">Pengguna</p>
            <p className="text-3xl font-bold m-0 mt-1 text-violet-700">{jumlahPengguna}</p>
          </div>
        </div>

        <div className={`${baseCardClasses} bg-amber-50`}>
          <div className={`${baseIconClasses} bg-amber-200 text-amber-800`}>⚠️</div>
          <div>
            <p className="text-sm text-gray-600 m-0">Hampir Habis</p>
            <p className="text-3xl font-bold m-0 mt-1 text-amber-700">{statistikBarang.hampir_habis}</p>
          </div>
        </div>
        
        <div className={`${baseCardClasses} bg-red-50`}>
          <div className={`${baseIconClasses} bg-red-200 text-red-800`}>🚫</div>
          <div>
            <p className="text-sm text-gray-600 m-0">Barang Habis</p>
            <p className="text-3xl font-bold m-0 mt-1 text-red-700">{statistikBarang.barang_habis}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2.5 mt-10 mb-[-20px]">
        <button 
          className={`py-2 px-4 border border-gray-300 bg-gray-100 rounded-md cursor-pointer font-semibold text-gray-600 ${chartType === 'bar' ? 'bg-violet-600 text-white border-violet-600' : ''}`} 
          onClick={() => setChartType('bar')}
        >
          Column Chart
        </button>
        <button 
          className={`py-2 px-4 border border-gray-300 bg-gray-100 rounded-md cursor-pointer font-semibold text-gray-600 ${chartType === 'line' ? 'bg-violet-600 text-white border-violet-600' : ''}`} 
          onClick={() => setChartType('line')}
        >
          Line Chart
        </button>
      </div>

      <div className="w-[90%] max-w-5xl my-10 mx-auto p-5 bg-white rounded-xl shadow-md">
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
