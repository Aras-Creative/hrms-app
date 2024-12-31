import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const NoProfileRoute = () => {
  const { auth, profile, profileLoading, profileError } = useAuth();

  // Jika pengguna belum login, arahkan ke halaman login
  if (!auth?.token) {
    return <Navigate to="/auth/login" />;
  }

  // Jika profil sedang dimuat, tampilkan loading
  if (profileLoading) {
    return <div>Loading...</div>;
  }

  // Jika terjadi error saat mengambil profil atau profil sudah ada, arahkan ke dashboard
  if (!profileError || profile) {
    return <Navigate to="/dashboard" />;
  }

  // Jika kondisi sudah sesuai (login tetapi belum ada profil), tampilkan halaman yang dilindungi
  return <Outlet />;
};

export default NoProfileRoute;
