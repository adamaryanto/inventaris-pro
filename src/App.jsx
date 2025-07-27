import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";

import { Toaster } from "sonner";
import LayoutAdmin from "./Component/LayoutAdmin";
import DashboardAdmin from "./Page Admin/DashboardAdmin";
import DataBarang from "./Page Admin/DataBarang";
import PermintaanPeminjamanAdmin from "./Page Admin/PermintaanPeminjamanAdmin";
import PengembalianBarangAdmin from "./Page Admin/PengembalianBarangAdmin";
import RiwayatPeminjamanAdmin from "./Page Admin/RiwayatPeminjamanAdmin";
import ManajemenUser from "./Page Admin/ManajemenUser";
import Laporan from "./Page Admin/Laporan";
import ProfileAdmin from "./Page Admin/ProfileAdmin";
import LayoutUser from "./Component/LayoutUser";
import DashboardUser from "./PageUser.jsx/DashboardUSer";
import PengajuanUser from "./PageUser.jsx/PengajuanUser";
import PengembalianBarangUser from "./PageUser.jsx/PengembalianBarangUser";
import RiwayatPeminjamanUser from "./PageUser.jsx/RiwayatPeminjamanUser";
import StatusPengajuanUser from "./PageUser.jsx/StatusPengajuanUser";
import ProfileUser from "./PageUser.jsx/ProfileUser";
import TambahUser from "./Page Admin/TambahUSer";

// Layout dan Pages Admin



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
          <Route path="permintaan" element={<PermintaanPeminjamanAdmin />} />
          <Route path="pengembalian" element={<PengembalianBarangAdmin/>} />
          <Route path="riwayat" element={<RiwayatPeminjamanAdmin />} />
          <Route path="manajemen-user" element={<ManajemenUser />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="pengaturan" element={<ProfileAdmin />} />
        </Route>

        {/* Route User */}
        <Route path="/dashboard-user" element={<LayoutUser/>}>
          <Route index element={<DashboardUser/>}/>
          <Route path="ajukan" element={<PengajuanUser/>}/>
          <Route path="pengembalian" element={<PengembalianBarangUser/>}/>
          <Route path="riwayat" element={<RiwayatPeminjamanUser/>}/>
          <Route path="status" element={<StatusPengajuanUser/>}/>
          <Route path="profil" element={<ProfileUser/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
