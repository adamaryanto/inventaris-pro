import React from 'react';
import '../Kumpulan.css/ProfileUser.css'

function Profile() {
  // Contoh data user (bisa diganti dengan data dari backend/localStorage)
  const user = {
    nama: 'Nabila Amira',
    username: 'nabila123',
    email: 'nabila@example.com',
    role: 'user',
    bergabung: '2024-11-10'
  };

  return (
    <div className="profile-container">
      <h2>👤 Profil Pengguna</h2>

      <div className="profile-card">
        <div className="profile-row">
          <span className="label">Nama Lengkap:</span>
          <span className="value">{user.nama}</span>
        </div>
        <div className="profile-row">
          <span className="label">Username:</span>
          <span className="value">{user.username}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email:</span>
          <span className="value">{user.email}</span>
        </div>
        <div className="profile-row">
          <span className="label">Role:</span>
          <span className="value">{user.role}</span>
        </div>
        <div className="profile-row">
          <span className="label">Bergabung Sejak:</span>
          <span className="value">{user.bergabung}</span>
        </div>

        <div className="profile-buttons">
          <button className="edit-btn">Edit Profil</button>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
