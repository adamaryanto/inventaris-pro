import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const SECRET_KEY = 'rahasia-super-aman';

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke database menggunakan Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventaris_pro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Endpoint: Register
// Endpoint: Register (dengan validasi username & email yang lebih detail)
app.post('/register', async (req, res) => {
  const { fullName, username, email, password, confirmPassword } = req.body;

  // Validasi input dasar
  if (!fullName || !username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password tidak cocok.' });
  }

  try {
    // 1. Cek apakah username atau email sudah ada di database
    const [existingUsers] = await pool.promise().query(
      'SELECT username, email FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    // 2. Jika ada data yang ditemukan, periksa satu per satu
    if (existingUsers.length > 0) {
      const isUsernameTaken = existingUsers.some(user => user.username === username);
      if (isUsernameTaken) {
        return res.status(409).json({ message: 'Username sudah digunakan. Harap gunakan username lain.' });
      }

      const isEmailTaken = existingUsers.some(user => user.email === email);
      if (isEmailTaken) {
        return res.status(409).json({ message: 'Email sudah terdaftar. Harap gunakan email lain.' });
      }
    }

    // 3. Jika lolos semua pengecekan, hash password dan simpan user baru
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.promise().query(
      'INSERT INTO users (full_name, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, username, email, hashedPassword, 'user']
    );

    res.status(201).json({ message: 'Registrasi berhasil.' });

  } catch (error) {
    console.error("Error saat registrasi:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// Endpoint: Login
app.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username/email dan password wajib diisi.' });
  }

  pool.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [identifier, identifier],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error.' });
      if (results.length === 0) {
        return res.status(401).json({ message: 'User tidak ditemukan.' });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ message: 'Password salah.' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Login berhasil.',
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    }
  );
});


// Tambah barang baru
app.post('/barang', (req, res) => {
  const { nama, kategori, stok, lokasi, kodeBarang } = req.body;

  if (!nama || !kategori || !stok || !lokasi || !kodeBarang) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  const checkQuery = 'SELECT * FROM barang WHERE kodeBarang = ?';
  pool.query(checkQuery, [kodeBarang], (err, results) => {
    if (err) {
      console.error('Gagal cek kode:', err);
      return res.status(500).json({ message: 'Server error saat cek kode barang.' });
    }

    if (results.length > 0) {
      const existing = results[0];
      if (existing.nama !== nama) {
        return res.status(400).json({ message: `Kode barang "${kodeBarang}" sudah dipakai untuk barang "${existing.nama}". Harap gunakan kode berbeda.` });
      }

      // Jika nama sama → update stok
      const updateQuery = 'UPDATE barang SET stok = stok + ? WHERE kodeBarang = ?';
      pool.query(updateQuery, [stok, kodeBarang], (err2) => {
        if (err2) {
          return res.status(500).json({ message: 'Gagal update stok.' });
        }
        return res.status(200).json({ message: 'Stok barang berhasil ditambahkan.' });
      });
    } else {
      // Insert baru
      const insertQuery = 'INSERT INTO barang (nama, kategori, stok, lokasi, kodeBarang) VALUES (?, ?, ?, ?, ?)';
      pool.query(insertQuery, [nama, kategori, stok, lokasi, kodeBarang], (err3, result) => {
        if (err3) {
          return res.status(500).json({ message: 'Gagal tambah barang.' });
        }
        return res.status(201).json({ message: 'Barang berhasil ditambahkan.', id: result.insertId });
      });
    }
  });
});

app.get('/barang', (req, res) => {
  pool.query('SELECT * FROM barang', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal mengambil data barang.' });
    }
    res.status(200).json(results);
  });
});

app.delete('/barang/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM barang WHERE id = ?';
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error('Gagal menghapus barang:', err);
      return res.status(500).json({ message: 'Gagal menghapus barang.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Barang berhasil dihapus.' });
  });
});

// Endpoint: Edit Barang
app.put('/barang/:id', (req, res) => {
  const { id } = req.params;
  const { nama, kategori, stok, lokasi, kodeBarang } = req.body;

  if (!nama || !kategori || !stok || !lokasi || !kodeBarang) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  const updateQuery = `
    UPDATE barang 
    SET nama = ?, kategori = ?, stok = ?, lokasi = ?, kodeBarang = ? 
    WHERE id = ?
  `;

  pool.query(updateQuery, [nama, kategori, stok, lokasi, kodeBarang, id], (err, result) => {
    if (err) {
      console.error('Gagal mengupdate barang:', err);
      return res.status(500).json({ message: 'Gagal mengupdate barang.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Barang berhasil diperbarui.' });
  });
});

// Ajukan peminjaman
app.post('/peminjaman', (req, res) => {
  const { user_id, barang_id, jumlah, tanggal_pinjam, tanggal_kembali, keterangan } = req.body;
  
  if (!user_id || !barang_id || !jumlah || !tanggal_pinjam || !tanggal_kembali) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  // Simpan ke DB
  const query = `
  INSERT INTO peminjaman (user_id, barang_id, jumlah, tanggal_pinjam, tanggal_kembali, keterangan, status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;
// Tambahkan 'pending' sebagai nilai untuk status
pool.query(query, [user_id, barang_id, jumlah, tanggal_pinjam, tanggal_kembali, keterangan, 'pending'], (err, result) => {
    if (err) {
      console.error('Gagal mengajukan peminjaman:', err);
      return res.status(500).json({ message: 'Gagal mengajukan peminjaman.' });
    }

    res.status(201).json({ message: 'Pengajuan peminjaman berhasil.' });
  });
});

app.get('/peminjaman', (req, res) => {
  const query = `
    SELECT 
      peminjaman.id,
      users.full_name AS nama_user,
      barang.nama AS nama_barang,
      peminjaman.jumlah,
      peminjaman.status,
      peminjaman.tanggal_pinjam,
      peminjaman.tanggal_kembali,
      peminjaman.keterangan
    FROM peminjaman
    JOIN users ON peminjaman.user_id = users.id
    JOIN barang ON peminjaman.barang_id = barang.id
    ORDER BY peminjaman.id DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Gagal mengambil data peminjaman:', err);
      return res.status(500).json({ message: 'Gagal mengambil data peminjaman.' });
    }

    res.status(200).json(results);
  });
});

// Endpoint: Setujui peminjaman (Versi baru dengan Transaction)
app.put('/peminjaman/:id/setujui', async (req, res) => {
  const { id } = req.params;
  const connection = await pool.promise().getConnection(); // Dapatkan koneksi untuk transaksi

  try {
    // Memulai transaction
    await connection.beginTransaction();

    // 1. Ambil detail peminjaman (barang_id & jumlah) dan pastikan statusnya 'pending'
    const [peminjamanRows] = await connection.execute(
      "SELECT barang_id, jumlah, status FROM peminjaman WHERE id = ?",
      [id]
    );

    if (peminjamanRows.length === 0) {
      throw new Error('Peminjaman tidak ditemukan.');
    }

    const peminjaman = peminjamanRows[0];
    if (peminjaman.status !== 'pending') {
      throw new Error('Hanya permintaan dengan status pending yang bisa disetujui.');
    }

    // 2. Kurangi stok barang di tabel 'barang'
    const updateStokQuery = `
      UPDATE barang 
      SET stok = stok - ? 
      WHERE id = ? AND stok >= ?
    `;
    const [updateResult] = await connection.execute(updateStokQuery, [
      peminjaman.jumlah,
      peminjaman.barang_id,
      peminjaman.jumlah, // Pastikan stok mencukupi sebelum dikurangi
    ]);

    // Jika tidak ada baris yang terpengaruh, berarti stok tidak cukup
    if (updateResult.affectedRows === 0) {
      throw new Error('Stok barang tidak mencukupi.');
    }

    // 3. Ubah status peminjaman menjadi 'disetujui'
    const updateStatusQuery = "UPDATE peminjaman SET status = 'disetujui' WHERE id = ?";
    await connection.execute(updateStatusQuery, [id]);

    // Jika semua berhasil, commit transaction
    await connection.commit();
    res.status(200).json({ message: 'Peminjaman disetujui dan stok telah diperbarui.' });

  } catch (error) {
    // Jika ada error, rollback semua perubahan
    await connection.rollback();
    console.error('Gagal menyetujui peminjaman:', error.message);
    res.status(400).json({ message: error.message || 'Gagal menyetujui peminjaman.' });

  } finally {
    // Selalu lepaskan koneksi setelah selesai
    if (connection) {
      connection.release();
    }
  }
});

// Endpoint: Tolak peminjaman
app.put('/peminjaman/:id/tolak', (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE peminjaman 
    SET status = 'ditolak' 
    WHERE id = ? AND status = 'pending'
  `;

  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error('Gagal mengubah status peminjaman:', err);
      return res.status(500).json({ message: 'Gagal mengubah status peminjaman.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan atau statusnya bukan pending.' });
    }

    res.status(200).json({ message: 'Status peminjaman berhasil diubah menjadi ditolak.' });
  });
});


// Ambil total barang tersedia & jumlah barang hampir habis
// Ambil statistik barang (tersedia, hampir habis, dan habis)
app.get('/barang/statistik', async (req, res) => {
  try {
    // Definisikan semua query yang dibutuhkan
    const queryTersedia = 'SELECT SUM(stok) AS total_tersedia FROM barang WHERE stok > 0';
    const queryHampirHabis = 'SELECT COUNT(*) AS hampir_habis FROM barang WHERE stok > 0 AND stok <= 3';
    const queryBarangHabis = 'SELECT COUNT(*) AS barang_habis FROM barang WHERE stok = 0';

    // Jalankan semua query secara bersamaan untuk efisiensi
    const [
      [resultTersedia],
      [resultHampirHabis],
      [resultBarangHabis]
    ] = await Promise.all([
      pool.promise().query(queryTersedia),
      pool.promise().query(queryHampirHabis),
      pool.promise().query(queryBarangHabis)
    ]);

    // Kirim respons dengan semua data statistik
    res.json({
      total_tersedia: resultTersedia[0].total_tersedia || 0,
      hampir_habis: resultHampirHabis[0].hampir_habis || 0,
      barang_habis: resultBarangHabis[0].barang_habis || 0
    });

  } catch (error) {
    console.error("Gagal mengambil statistik barang:", error);
    res.status(500).json({ message: 'Gagal mengambil statistik barang.' });
  }
});

// Endpoint untuk ambil data user dari token
app.get('/profile', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'userId tidak ditemukan di query' });
  }

  try {
    const [rows] = await pool.promise().execute(
      'SELECT full_name, role FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const user = rows[0];

    res.json({
      fullName: user.full_name,
      role: user.role
    });

  } catch (err) {
    console.error('Gagal ambil profil:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Endpoint: Jumlah semua pengguna
app.get('/users/count', async (req, res) => {
  try {
    const [rows] = await pool.promise().execute('SELECT COUNT(*) AS total_users FROM users');
    res.json({ total_users: rows[0].total_users });
  } catch (err) {
    console.error('Error mengambil jumlah pengguna:', err);
    res.status(500).json({ message: 'Gagal mengambil jumlah pengguna' });
  }
});



// Endpoint: Ambil semua riwayat peminjaman (selesai) untuk Admin
app.get('/peminjaman/riwayat', async (req, res) => {
  try {
    const query = `
      SELECT 
        peminjaman.id,
        users.full_name AS nama_user,
        barang.nama AS nama_barang,
        peminjaman.jumlah,
        peminjaman.status,
        peminjaman.tanggal_pinjam,
        peminjaman.tanggal_kembali,
        peminjaman.keterangan
      FROM peminjaman
      JOIN users ON peminjaman.user_id = users.id
      JOIN barang ON peminjaman.barang_id = barang.id
      -- Baris WHERE dihapus untuk menampilkan semua status
      ORDER BY peminjaman.id DESC
    `;

    const [results] = await pool.promise().query(query);
    res.status(200).json(results);

  } catch (error) {
    console.error('Gagal mengambil riwayat peminjaman:', error);
    res.status(500).json({ message: 'Gagal mengambil riwayat peminjaman.' });
  }
});

// Endpoint: Ambil semua pengguna, diurutkan berdasarkan nama
app.get('/users', async (req, res) => {
  try {
    // Query untuk mengambil data user dan diurutkan berdasarkan full_name (A-Z)
    // Penting: Jangan pernah mengambil kolom password
    const query = `
      SELECT id, full_name, username, email, role 
      FROM users 
      ORDER BY full_name ASC
    `;

    const [users] = await pool.promise().query(query);
    res.status(200).json(users);

  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
    res.status(500).json({ message: "Gagal mengambil data pengguna." });
  }
});


// Endpoint: Ubah role seorang pengguna
app.patch('/users/:id/role', async (req, res) => {
  const { id } = req.params;      // Ambil ID user dari URL
  const { role } = req.body;      // Ambil role baru dari body request

  // Validasi sederhana untuk memastikan role yang dikirim valid
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Role tidak valid.' });
  }

  try {
    const query = 'UPDATE users SET role = ? WHERE id = ?';
    const [result] = await pool.promise().execute(query, [role, id]);

    // Cek jika tidak ada user yang ter-update (mungkin karena ID tidak ada)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    res.status(200).json({ message: `Role untuk user ID ${id} berhasil diubah menjadi ${role}.` });

  } catch (error) {
    console.error("Gagal mengubah role:", error);
    res.status(500).json({ message: 'Gagal mengubah role pengguna.' });
  }
});


// Endpoint: Hapus seorang pengguna berdasarkan ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params; // Ambil ID dari parameter URL

  try {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await pool.promise().execute(query, [id]);

    // Cek jika tidak ada baris yang terhapus (ID tidak ditemukan)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Pengguna berhasil dihapus.' });

  } catch (error) {
    console.error("Gagal menghapus pengguna:", error);
    res.status(500).json({ message: 'Gagal menghapus pengguna.' });
  }
});


// Endpoint: Menyetujui (mengonfirmasi) pengembalian barang
app.patch('/peminjaman/:id/konfirmasi-kembali', async (req, res) => {
  const { id } = req.params;
  const connection = await pool.promise().getConnection();

  try {
    await connection.beginTransaction();

    // 1. Ambil detail peminjaman yang lebih LENGKAP
    const [peminjamanRows] = await connection.execute(
      `SELECT
        p.barang_id,
        p.jumlah,
        p.status,
        p.tanggal_pinjam,
        p.tanggal_kembali,
        u.full_name AS nama_peminjam,
        b.nama AS nama_barang
      FROM peminjaman p
      JOIN users u ON p.user_id = u.id
      JOIN barang b ON p.barang_id = b.id
      WHERE p.id = ?`,
      [id]
    );

    if (peminjamanRows.length === 0 || peminjamanRows[0].status !== 'menunggu konfirmasi') {
      throw new Error('Peminjaman tidak ditemukan atau statusnya tidak valid.');
    }
    const peminjaman = peminjamanRows[0];

    // 2. Tambahkan kembali stok barang
    await connection.execute('UPDATE barang SET stok = stok + ? WHERE id = ?', [peminjaman.jumlah, peminjaman.barang_id]);

    // 3. Ubah status menjadi 'sudah dikembalikan'
    await connection.execute("UPDATE peminjaman SET status = 'sudah dikembalikan' WHERE id = ?", [id]);

    await connection.commit();

    // 4. Kirim respons yang lebih detail ke frontend
    res.status(200).json({
      message: 'Pengembalian barang dikonfirmasi.',
      data: {
        nama_peminjam: peminjaman.nama_peminjam,
        nama_barang: peminjaman.nama_barang,
        tanggal_pinjam: peminjaman.tanggal_pinjam,
        tanggal_kembali: peminjaman.tanggal_kembali,
      }
    });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message || 'Gagal memproses pengembalian.' });
  } finally {
    if (connection) connection.release();
  }
});


// Endpoint: Menolak konfirmasi pengembalian
app.patch('/peminjaman/:id/tolak-kembali', async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = "UPDATE peminjaman SET status = 'disetujui' WHERE id = ? AND status = 'menunggu konfirmasi'";
    const [result] = await pool.promise().execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan atau statusnya tidak valid.' });
    }
    
    res.status(200).json({ message: 'Pengembalian ditolak, status kembali menjadi dipinjam.' });

  } catch (error) {
    res.status(500).json({ message: 'Gagal menolak pengembalian.' });
  }
});


// A. ENDPOINT UNTUK MENGAMBIL DAFTAR KONFIRMASI (GET)
app.get('/peminjaman/menunggu-konfirmasi', async (req, res) => {
  try {
    const query = `
      SELECT peminjaman.id, users.full_name AS nama_user, barang.nama AS nama_barang, peminjaman.jumlah, 
             peminjaman.tanggal_pinjam, peminjaman.tanggal_kembali, peminjaman.keterangan, peminjaman.status
      FROM peminjaman
      JOIN users ON peminjaman.user_id = users.id
      JOIN barang ON peminjaman.barang_id = barang.id
      WHERE peminjaman.status = 'menunggu konfirmasi'
      ORDER BY peminjaman.id DESC
    `;
    const [results] = await pool.promise().query(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data konfirmasi.' });
  }
});

// Endpoint: Pengguna mengajukan pengembalian barang
// Endpoint: Pengguna mengajukan pengembalian barang
app.patch('/peminjaman/:id/ajukan-pengembalian', async (req, res) => {
  const { id } = req.params;

  try {
    // Query ini hanya akan berhasil jika status barang saat ini adalah 'disetujui'
    const query = `
      UPDATE peminjaman 
      SET status = 'menunggu konfirmasi' 
      WHERE id = ? AND status = 'disetujui'
    `;
    
    const [result] = await pool.promise().execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan atau tidak bisa dikembalikan saat ini.' });
    }

    res.status(200).json({ message: 'Pengajuan pengembalian berhasil, menunggu konfirmasi admin.' });

  } catch (error) {
    console.error("Gagal mengajukan pengembalian:", error);
    res.status(500).json({ message: 'Gagal memproses permintaan.' });
  }
});

// Endpoint: Mengambil daftar barang yang sedang dipinjam oleh seorang user (status 'disetujui')
app.get('/users/:userId/peminjaman/disetujui', async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT 
        peminjaman.id,
        barang.nama AS namaBarang,
        peminjaman.jumlah,
        peminjaman.tanggal_pinjam AS tanggalPinjam,
        peminjaman.tanggal_kembali AS tanggalKembali
      FROM peminjaman
      JOIN barang ON peminjaman.barang_id = barang.id
      WHERE peminjaman.user_id = ? AND peminjaman.status = 'disetujui'
      ORDER BY peminjaman.tanggal_kembali ASC
    `;

    const [results] = await pool.promise().query(query, [userId]);
    res.status(200).json(results);

  } catch (error) {
    console.error('Gagal mengambil data pinjaman user:', error);
    res.status(500).json({ message: 'Gagal mengambil data pinjaman.' });
  }
});


// ✅ Endpoint tandai selesai
app.put('/peminjaman/:id/selesai', (req, res) => {
  const id = req.params.id;
  const tanggalKembali = new Date().toISOString().slice(0, 10);

  const query = `
    UPDATE peminjaman 
    SET status = 'Selesai', tanggal_kembali = ? 
    WHERE id = ?
  `;

  pool.query(query, [tanggalKembali, id], (err, result) => {
    if (err) {
      console.error('Gagal update data:', err);
      return res.status(500).json({ message: 'Gagal mengupdate data' });
    }
    res.json({ message: 'Status peminjaman berhasil diperbarui menjadi selesai' });
  });
});


// Endpoint: Ubah password pengguna
app.patch('/users/:id/password', async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // 1. Validasi input dasar
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Semua field password wajib diisi.' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Password baru tidak cocok.' });
  }

  const connection = await pool.promise().getConnection();

  try {
    await connection.beginTransaction();

    // 2. Ambil hash password saat ini dari database
    const [userRows] = await connection.execute('SELECT password FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      throw new Error('Pengguna tidak ditemukan.');
    }
    const currentHashedPassword = userRows[0].password;

    // 3. Bandingkan password saat ini yang diinput dengan yang ada di database
    const isMatch = await bcrypt.compare(currentPassword, currentHashedPassword);
    if (!isMatch) {
      // Menggunakan status 401 (Unauthorized) karena password lama salah
      return res.status(401).json({ message: 'Password saat ini salah.' });
    }

    // 4. Hash password baru
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update password di database dengan hash yang baru
    await connection.execute('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, id]);

    await connection.commit();
    res.status(200).json({ message: 'Password berhasil diperbarui.' });

  } catch (error) {
    await connection.rollback();
    console.error("Gagal mengubah password:", error);
    // Hindari mengirim detail error ke client
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  } finally {
    if (connection) connection.release();
  }
});

// Endpoint: Mengambil statistik peminjaman untuk satu user
app.get('/users/:userId/peminjaman/statistik', async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT
        -- Hitung semua record milik user ini sebagai Total Peminjaman
        COUNT(*) AS total_peminjaman,
        -- Hitung hanya yang statusnya 'pending' atau 'menunggu konfirmasi'
        COUNT(CASE WHEN status IN ('pending', 'menunggu konfirmasi') THEN 1 ELSE NULL END) AS pengajuan_diproses,
        -- Hitung hanya yang statusnya 'sudah dikembalikan' atau 'Selesai'
        COUNT(CASE WHEN status IN ('sudah dikembalikan', 'Selesai') THEN 1 ELSE NULL END) AS riwayat_selesai
      FROM peminjaman
      WHERE user_id = ?
    `;

    const [[stats]] = await pool.promise().query(query, [userId]);
    res.status(200).json(stats);

  } catch (error) {
    console.error('Gagal mengambil statistik user:', error);
    res.status(500).json({ message: 'Gagal mengambil data statistik.' });
  }
});


// Endpoint: Mengambil semua status pengajuan untuk satu user
app.get('/users/:userId/peminjaman', async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT 
        peminjaman.id,
        barang.nama AS barang,
        peminjaman.jumlah,
        peminjaman.tanggal_pinjam AS tanggal,
        peminjaman.status
      FROM peminjaman
      JOIN barang ON peminjaman.barang_id = barang.id
      WHERE peminjaman.user_id = ?
      ORDER BY peminjaman.id DESC
    `;

    const [results] = await pool.promise().query(query, [userId]);
    res.status(200).json(results);

  } catch (error) {
    console.error('Gagal mengambil status pengajuan user:', error);
    res.status(500).json({ message: 'Gagal mengambil data pengajuan.' });
  }
});

// Endpoint: Update profil pengguna (nama, username, email)
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { fullName, username, email } = req.body;

  // Validasi input
  if (!fullName || !username || !email) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  try {
    // 1. Cek apakah username atau email baru sudah digunakan oleh user LAIN
    const conflictQuery = `
      SELECT id FROM users 
      WHERE (username = ? OR email = ?) AND id != ?
    `;
    const [conflictUsers] = await pool.promise().query(conflictQuery, [username, email, id]);

    if (conflictUsers.length > 0) {
      return res.status(409).json({ message: 'Username atau email sudah digunakan oleh pengguna lain.' });
    }

    // 2. Jika tidak ada konflik, update data pengguna
    const updateQuery = `
      UPDATE users 
      SET full_name = ?, username = ?, email = ? 
      WHERE id = ?
    `;
    const [result] = await pool.promise().execute(updateQuery, [fullName, username, email, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Profil berhasil diperbarui.' });

  } catch (error) {
    console.error("Gagal update profil:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});



// Endpoint: Mengambil detail lengkap profil seorang pengguna
app.get('/users/:id/detail', async (req, res) => {
  const { id } = req.params;

  try {
    // Ambil kolom yang dibutuhkan, termasuk 'created_at' untuk tanggal bergabung
    const query = `
      SELECT id, full_name, username, email, role, created_at 
      FROM users 
      WHERE id = ?
    `;
    const [[user]] = await pool.promise().query(query, [id]); // Destructuring ganda

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }
    
    // Kirim kembali data profil lengkap
    res.status(200).json({
      nama: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role,
      bergabung: user.created_at // Ini akan menjadi tanggal bergabung
    });

  } catch (error) {
    console.error("Gagal mengambil detail profil:", error);
    res.status(500).json({ message: 'Gagal mengambil detail profil.' });
  }
});


// Start server
app.listen(5000, () => {
  console.log('🚀 Server jalan di http://localhost:5000');
});