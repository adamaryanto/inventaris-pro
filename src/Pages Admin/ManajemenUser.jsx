import React, { useEffect, useState } from 'react';
import '../Kumpulan.css/ManajemenUser.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

function ManajemenUser() {
  const navigate = useNavigate();
  const [dataUser, setDataUser] = useState([]);
  
  // State untuk mengontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State untuk menyimpan data user yang dipilih untuk diedit
  const [selectedUser, setSelectedUser] = useState(null);
  // State untuk menyimpan nilai role baru dari dropdown di modal
  const [newRole, setNewRole] = useState('');

  // Mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then((res) => {
        setDataUser(res.data);
      })
      .catch((err) => {
        console.log(err.response ? err.response.data.message : err.message);
      });
  }, []);

  // Fungsi untuk membuka modal dan menyiapkan data
  const handleOpenModal = (test) => {
    setSelectedUser(test);
    setNewRole(test.role); // Atur nilai awal dropdown sesuai role user
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
        // Update data di tabel tanpa refresh
        setDataUser(dataUser.map(user => 
          user.id === selectedUser.id ? { ...user, role: newRole } : user
        ));
      })
      .catch(err => toast.error('Gagal update role'));

    handleCloseModal(); // Tutup modal setelah logika selesai
  };

  const handleDelete = (userId,userName)=>{
    axios.delete(`http://localhost:5000/users/${userId}`)
    .then((res)=>{
      toast.success(res.data.message)
      setDataUser(currentUser => currentUser.filter(user=> user.id!==user.Id))
    })
    .catch(err => {
          toast.error(err.response ? err.response.data.message : 'Gagal menghapus pengguna.');
        });
  }
  return (
    <div className="user-container">
      <div className='header-user'>
        <h2>👥 Manajemen Pengguna</h2>
        <button className="tambah-btn" onClick={() => navigate('/tambah-user')}>
          + Tambah User
        </button>
      </div>
      <table className="table-user">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataUser.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role ${user.role.toLowerCase()}`}>{user.role}</span>
              </td>
              <td>
                <button className="ubah-btn" onClick={() => handleOpenModal(user)}>Ubah Role</button>
                <button className="hapus-btn" onClick={()=>handleDelete(user.id, user.full_name)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Elemen Modal (Pop-up) akan muncul jika isModalOpen adalah true */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            <h3>Ubah Role untuk: {selectedUser.full_name}</h3>
            
            <div className="modal-form-group">
              <label htmlFor="role-select">Pilih Role Baru</label>
              <select 
                id="role-select" 
                className="role-dropdown-modal"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="batal-btn-modal" onClick={handleCloseModal}>Batal</button>
              <button className="simpan-btn-modal" onClick={handleSimpan}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManajemenUser;