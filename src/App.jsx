import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { Toaster } from "sonner";

// Layout dan Pages Admin
import LayoutAdmin from "./component/LayoutAdmin";

import DataBarang from "./Pages Admin/DataBarang";
import Permintaan from "./Pages Admin/Permintaan";
import Riwayat from "./Pages Admin/Riwayat";
import ManajemenUser from "./Pages Admin/ManajemenUser";
import Laporan from "./Pages Admin/Laporan";
import Pengaturan from "./Pages Admin/Pengaturan";
import DashboardAdmin from "./Pages Admin/DashboardAdmin";
import LayoutUser from "./component/LayoutUser";
import DashboardUser from "./Pages User/DashboardUser";
import Ajukan from "./Pages User/Ajukan";
import RiwayatPeminjaman from "./Pages User/RiwayatPeminjaman";
import StatusPengajuan from "./Pages User/StatusPengajuan";
import Profile from "./Pages User/Profile";
import TambahUser from "./Pages Admin/TambahUser";
import PengembalianBarang from "./Pages Admin/PengembalianBarang";
import PengembalianBarangUser from "./Pages User/PengembalianBarangUser";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        {/* Halaman umum (di luar layout) */}
        <Route path="/" element={<Login />} />
        
          <Route path="/tambah-user" element={<TambahUser/>}/>

        {/* Admin layout & halaman-halaman di dalamnya */}
        <Route path="/dashboard-admin" element={<LayoutAdmin />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="data-barang" element={<DataBarang/>} />
          <Route path="permintaan" element={<Permintaan />} />
          <Route path="pengembalian" element={<PengembalianBarang />} />
          <Route path="riwayat" element={<Riwayat />} />
          <Route path="manajemen-user" element={<ManajemenUser />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="pengaturan" element={<Pengaturan />} />
        </Route>

        {/* Route User */}
        <Route path="/dashboard-user" element={<LayoutUser/>}>
          <Route index element={<DashboardUser/>}/>
          <Route path="ajukan" element={<Ajukan/>}/>
          <Route path="pengembalian" element={<PengembalianBarangUser/>}/>
          <Route path="riwayat" element={<RiwayatPeminjaman/>}/>
          <Route path="status" element={<StatusPengajuan/>}/>
          <Route path="profil" element={<Profile/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
