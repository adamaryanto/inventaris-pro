# 📦 Inventaris Pro

Inventaris Pro adalah aplikasi web manajemen inventaris berbasis MERN Stack (MySQL, Express, React, Node.js) yang dirancang untuk memudahkan proses peminjaman dan pengembalian barang. Aplikasi ini memiliki dua peran utama: Admin dan User, dengan fitur yang disesuaikan untuk masing-masing peran.



## ✨ Fitur Utama

### Sebagai Admin
- **Dashboard Interaktif**: Menampilkan statistik utama seperti jumlah barang, pengguna, permintaan baru, dan barang hampir habis dalam bentuk kartu dan chart (Bar & Line).
- **Manajemen Barang (CRUD)**: Menambah, melihat, mengedit, dan menghapus data barang dalam inventaris.
- **Manajemen Pengguna**: Melihat, menambah, mengedit role, dan menghapus data pengguna.
- **Proses Peminjaman**: Menyetujui atau menolak permintaan peminjaman dari user. Stok barang akan berkurang secara otomatis.
- **Konfirmasi Pengembalian**: Mengonfirmasi pengembalian barang dari user. Stok barang akan bertambah kembali.
- **Riwayat**: Melihat seluruh riwayat transaksi peminjaman dan pengembalian.
- **Laporan**: Mengekspor data laporan peminjaman ke dalam format **PDF** dan **Excel**.

### Sebagai User
- **Melihat Daftar Barang**: Melihat semua barang yang tersedia untuk dipinjam.
- **Mengajukan Peminjaman**: Membuat permintaan untuk meminjam barang.
- **Melihat Status**: Memantau status pengajuan peminjaman (Pending, Disetujui, Ditolak).
- **Mengajukan Pengembalian**: Mengirim notifikasi ke admin untuk proses pengembalian barang.
- **Melihat Riwayat**: Melihat riwayat peminjaman pribadi.
- **Pengaturan Akun**: Mengubah password pribadi.

---

## 🚀 Teknologi yang Digunakan

### Frontend
- **React.js**: Library utama untuk membangun antarmuka pengguna.
- **React Router**: Untuk navigasi antar halaman.
- **Axios**: Untuk melakukan permintaan HTTP ke backend.
- **Chart.js**: Untuk visualisasi data dalam bentuk chart.
- **jsPDF & jspdf-autotable**: Untuk membuat laporan PDF.
- **SheetJS (xlsx)**: Untuk membuat laporan Excel.
- **Sonner**: Untuk menampilkan notifikasi (toast).

### Backend
- **Node.js**: Lingkungan eksekusi JavaScript di sisi server.
- **Express.js**: Framework untuk membangun API.
- **MySQL2**: Driver untuk menghubungkan aplikasi dengan database MySQL.
- **JWT (JSON Web Token)**: Untuk autentikasi pengguna yang aman.
- **Bcrypt**: Untuk hashing (enkripsi) password.
- **CORS**: Untuk mengelola akses API dari domain yang berbeda.

### Database
- **MySQL**

---

## 🛠️ Instalasi dan Menjalankan Proyek

Untuk menjalankan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut:

### 1. Backend Setup
```bash
# Masuk ke folder Backend
cd Backend

# Instal semua dependensi yang dibutuhkan
npm install

# Buat file .env dan atur koneksi database Anda
# (Contoh: DB_HOST=localhost, DB_USER=root, DB_PASSWORD=, DB_NAME=inventaris_pro)

# Import file .sql ke database MySQL Anda untuk membuat tabel yang diperlukan

# Jalankan server backend
node server.js
