import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

function ManajemenUser() {
  const navigate = useNavigate();
  const [dataUser, setDataUser] = useState([]);
  
  // State untuk mengontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Fungsi untuk mengambil data pengguna
  const fetchData = () => {
    axios.get('http://localhost:5000/users')
      .then((res) => {
        setDataUser(res.data);
      })
      .catch((err) => {
        console.log(err.response ? err.response.data.message : err.message);
      });
  };

  // Mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk membuka modal dan menyiapkan data
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Fungsi yang akan dipanggil saat tombol "Simpan" di modal diklik
  const handleSimpan = () => {
    if (!selectedUser) return;
    
    axios.patch(`http://localhost:5000/users/${selectedUser.id}/role`, { role: newRole })
      .then(res => {
        toast.success(res.data.message);
        fetchData(); // Ambil ulang data untuk sinkronisasi
      })
      .catch(err => toast.error('Gagal update role'));

    handleCloseModal();
  };

  const handleDelete = (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
        axios.delete(`http://localhost:5000/users/${userId}`)
        .then((res) => {
            toast.success(res.data.message);
            fetchData(); // Ambil ulang data setelah hapus
        })
        .catch(err => {
            toast.error(err.response ? err.response.data.message : 'Gagal menghapus pengguna.');
        });
    }
  };

  // Objek untuk memetakan role ke kelas warna Tailwind
  const roleStyles = {
    admin: 'bg-green-500 text-white',
    user: 'bg-gray-500 text-white',
  };

  return (
    <div className="p-6 font-sans">
      <div className='flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4'>
        <h2 className="text-2xl font-bold text-gray-800">👥 Manajemen Pengguna</h2>
        <button 
          className="py-2 px-4 bg-blue-600 text-white rounded-md font-semibold transition-colors hover:bg-blue-700" 
          onClick={() => navigate('/tambah-user')}
        >
          + Tambah User
        </button>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-bold text-gray-600 border-b">No</th>
              <th className="p-3 text-left font-bold text-gray-600 border-b">Nama</th>
              <th className="p-3 text-left font-bold text-gray-600 border-b">Email</th>
              <th className="p-3 text-left font-bold text-gray-600 border-b">Role</th>
              <th className="p-3 text-left font-bold text-gray-600 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataUser.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">{index + 1}</td>
                <td className="p-3 border-b border-gray-200">{user.full_name}</td>
                <td className="p-3 border-b border-gray-200">{user.email}</td>
                <td className="p-3 border-b border-gray-200">
                  <span className={`py-1 px-2.5 rounded text-xs font-bold capitalize ${roleStyles[user.role.toLowerCase()] || 'bg-gray-400 text-white'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3 border-b border-gray-200">
                  <button className="py-1.5 px-3 mr-2 bg-blue-500 text-white rounded font-bold transition-colors hover:bg-blue-600" onClick={() => handleOpenModal(user)}>Ubah Role</button>
                  <button className="py-1.5 px-3 bg-red-500 text-white rounded font-bold transition-colors hover:bg-red-600" onClick={() => handleDelete(user.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Elemen Modal (Pop-up) */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative animate-in fade-in-90 scale-95">
            <button className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-600" onClick={handleCloseModal}>&times;</button>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Ubah Role untuk: {selectedUser.full_name}</h3>
            
            <div className="mb-5">
              <label htmlFor="role-select" className="block mb-2 font-bold text-gray-700">Pilih Role Baru</label>
              <select 
                id="role-select" 
                className="w-full p-2.5 border border-gray-300 rounded-md text-base"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="py-2 px-5 bg-gray-200 text-gray-800 rounded-md font-bold transition-colors hover:bg-gray-300" onClick={handleCloseModal}>Batal</button>
              <button className="py-2 px-5 bg-blue-600 text-white rounded-md font-bold transition-colors hover:bg-blue-700" onClick={handleSimpan}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManajemenUser;
