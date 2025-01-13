import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const GuestRoute = () => {
  const { auth } = useAuth();

  if (auth?.token && auth?.user) {
    if (auth.user.role === "user") {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to={"/dashboard/department"} />;
    }
  }

  return <Outlet />;
};

export default GuestRoute;
