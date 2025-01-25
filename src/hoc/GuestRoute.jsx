import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const GuestRoute = () => {
  const { auth } = useAuth();
  
  const isLoggedIn = !!auth.token && !!auth.user;

  if (isLoggedIn) {
    return <Navigate to={auth?.user?.role === "admin" ? "/dashboard" : "/homepage"} replace />;
  }

  return <Outlet />;
};
