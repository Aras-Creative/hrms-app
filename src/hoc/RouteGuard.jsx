import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ProfileSetup from "../pages/onboarding/ProfileSetup";

const isLoggedIn = (auth) => auth?.token && auth?.user;
const hasProfile = (profile, profileError) => !profileError && profile;
const hasRole = (auth, allowedRoles) => allowedRoles?.includes(auth?.user?.role);

const RouteGuard = ({ type, allowedRoles }) => {
  const { auth, profile, profileLoading, profileError } = useAuth();

  if (profileLoading) {
    return <div>Loading...</div>; // Consistent loading state
  }

  if (type === "guest") {
    if (isLoggedIn(auth)) {
      const redirectPath = auth.user.role === "user" ? "/homepage" : "/dashboard";
      return <Navigate to={redirectPath} />;
    }
    return <Outlet />;
  }

  if (type === "noProfile") {
    if (!isLoggedIn(auth)) {
      return <Navigate to="/auth/login" />;
    }
    if (auth?.user.role === "admin") {
      return <Navigate to="/dashboard" />;
    }
    if (hasProfile(profile, profileError)) {
      return <Navigate to="/homepage" />;
    }
    return <ProfileSetup />;
  }

  if (type === "private") {
    if (!isLoggedIn(auth)) {
      return <Navigate to="/auth/login" />;
    }
    if (!hasProfile(profile, profileError) && auth?.user.role === "user") {
      return <Navigate to="/welcome" />;
    }
    if (!hasRole(auth, allowedRoles)) {
      return <Navigate to="/unauthorized" />;
    }
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export default RouteGuard;
