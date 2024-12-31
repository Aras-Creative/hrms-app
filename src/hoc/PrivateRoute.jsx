import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ allowedRoles }) => {
  const { auth, profile, profileLoading, profileError } = useAuth();
  if (!auth?.token) {
    return <Navigate to="/auth/login" />;
  }
  if (profileLoading) {
    return <div>Loading...</div>;
  }

  if (profileError || !profile) {
    return <Navigate to="/welcome" />;
  }

  const userHasRole = allowedRoles?.includes(auth?.user?.role);

  if (userHasRole) {
    return <Outlet />;
  }

  // Fallback jika pengguna tidak memiliki peran yang diizinkan
  return <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
