import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Loading } from "../components/Preloaders";

const RouteGuard = ({ type, allowedRoles }) => {
  const { auth, profile, profileLoading, profileError } = useAuth();

  // Handle loading state
  if (profileLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Check login status and profile availability
  const isLoggedIn = !!auth?.token && !!auth?.user;
  const hasProfile = profile && !profileError;
  const hasRole = !allowedRoles || allowedRoles.includes(auth?.user?.role);

  // Guard for 'guest' type
  if (type === "guest") {
    if (isLoggedIn) {
      const redirectPath = auth?.user?.role === "user" ? "/homepage" : "/dashboard";
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  }

  // Guard for 'private' type
  if (type === "private") {
    if (!isLoggedIn) {
      return <Navigate to="/auth/login" replace />;
    }

    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
  }

  // Catch invalid `type`
  console.error(`Invalid RouteGuard type: ${type}`);
  return <Navigate to="/" replace />;
};

export default RouteGuard;
