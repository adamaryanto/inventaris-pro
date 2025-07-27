Inventaris Pro - Aplikasi Manajemen Inventaris
Inventaris Pro adalah aplikasi web yang dirancang untuk memudahkan pengelolaan dan peminjaman barang dalam sebuah organisasi atau perusahaan. Aplikasi ini dibangun dengan React.js untuk frontend dan Node.js/Express untuk backend, serta dilengkapi dengan sistem otentikasi berbasis peran (Admin dan User).

Tampilan Aplikasi
Berikut adalah tampilan halaman login dari aplikasi Inventaris Pro:

Fitur Utama
Aplikasi ini memiliki dua peran utama dengan fitur yang berbeda:

👤 Fitur untuk User (Pengguna)
Dashboard: Melihat ringkasan statistik peminjaman pribadi.

Ajukan Peminjaman: Membuat permintaan peminjaman barang yang tersedia.

Status Pengajuan: Memantau status permintaan yang diajukan (Pending, Disetujui, Ditolak).

Riwayat Peminjaman: Melihat semua riwayat transaksi peminjaman yang pernah dilakukan.

Pengembalian Barang: Mengajukan proses pengembalian barang yang telah selesai dipinjam.

Profil: Mengelola detail informasi akun pribadi.

👑 Fitur untuk Admin
Semua fitur User.

Dashboard Admin: Melihat statistik keseluruhan inventaris, jumlah pengguna, dan permintaan yang masuk.

Manajemen Data Barang: Menambah, mengubah, dan menghapus data barang di inventaris.

Konfirmasi Permintaan: Menyetujui atau menolak permintaan peminjaman dari pengguna.

Konfirmasi Pengembalian: Memverifikasi dan menyelesaikan proses pengembalian barang dari pengguna.

Manajemen User: Mengelola data pengguna dan mengubah peran (role) mereka.

Laporan / Export: Membuat laporan peminjaman dan mengekspor data ke format PDF atau Excel.

Teknologi yang Digunakan
Frontend:

React.js: Library utama untuk membangun antarmuka pengguna.

Tailwind CSS: Framework CSS untuk styling yang cepat dan responsif.

React Router: Untuk routing dan navigasi halaman.

Axios: Untuk melakukan permintaan HTTP ke backend.

Chart.js: Untuk menampilkan data statistik dalam bentuk grafik.

Sonner: Untuk menampilkan notifikasi (toast).

jsPDF & XLSX: Untuk fungsionalitas ekspor data.

Backend:

Node.js: Lingkungan eksekusi JavaScript di sisi server.

Express.js: Framework untuk membangun API.

MySQL: Database untuk menyimpan semua data aplikasi.

JWT (JSON Web Tokens): Untuk otentikasi dan otorisasi yang aman.

Bcrypt: Untuk hashing password.

CORS: Untuk mengelola akses lintas domain.

Cara Menjalankan Proyek
Untuk menjalankan proyek ini di lingkungan lokal, ikuti langkah-langkah berikut:

1. Backend Setup
# Masuk ke direktori Backend
cd Backend

# Instal semua dependensi yang dibutuhkan
npm install

# Jalankan server backend (biasanya di port 5000)
node server.js

Pastikan Anda sudah membuat database MySQL dan mengisi detail koneksi di file konfigurasi backend.

2. Frontend Setup
# Buka terminal baru, masuk ke direktori frontend (root proyek)
# (Jangan tutup terminal backend)
cd .. 

# Instal semua dependensi yang dibutuhkan
npm install

# Jalankan aplikasi React (biasanya di port 5173)
npm run dev

Setelah kedua server berjalan, buka http://localhost:5173 di browser Anda untuk melihat aplikasinya.
