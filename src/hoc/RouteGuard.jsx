import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Loading } from "../components/Preloaders";

export const GuestRoute = () => {
  const { auth } = useAuth();
  const isLoggedIn = !!auth.token && !!auth.user;

  if (isLoggedIn) {
    return <Navigate to={auth?.user?.role === "admin" || auth?.user?.role === "super" ? "/dashboard" : "/homepage"} replace />;
  }
  return <Outlet />;
};

export const AdminRoute = () => {
  const { auth } = useAuth();
  const isLoading = !auth;
  const isAdmin = auth?.user?.role === "admin" || auth?.user?.role === "super";
  const isLoggedIn = !!auth?.token && !!auth?.user;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export const UserPrivateRoute = () => {
  const { auth, profileLoading } = useAuth();
  const isLoading = profileLoading || !auth;
  const isLoggedIn = !!auth?.token && !!auth?.user;
  const isUser = auth.user?.role === "user";

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isUser) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default UserPrivateRoute;
