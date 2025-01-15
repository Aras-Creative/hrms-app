import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Loading } from "../components/Preloaders";

const RouteGuard = ({ type, allowedRoles }) => {
  const { auth, profile, profileLoading, profileError, isProfileComplete } = useAuth();

  const isLoading = profileLoading || !auth;
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const isLoggedIn = !!auth?.token && !!auth?.user;
  const hasProfile = profile && !profileError;
  const hasRole = !allowedRoles || allowedRoles.includes(auth?.user?.role);

  if (type === "guest") {
    if (isLoggedIn) {
      const redirectPath = auth?.user?.role === "user" ? "/homepage" : "/dashboard";
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  }

  if (type === "private") {
    if (!isLoggedIn || (!hasProfile && auth?.user?.role === "user")) {
      return <Navigate to="/auth/login" replace />;
    }
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default RouteGuard;
