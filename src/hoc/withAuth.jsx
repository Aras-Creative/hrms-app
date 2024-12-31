import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
// import Unauthorized from "../pages/main/Unauthorized";

const withAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  // console.log(auth.user.role);
  console.log(auth.token && auth.user);

  const userHasRole = allowedRoles?.find((role) => role === auth?.user?.role) ? true : false;

  if (!auth?.token && !auth?.user) {
    return <Navigate to="/auth/login" />;
  }

  if (userHasRole) {
    return <Outlet />;
  } else {
    console.log(userHasRole);
    // return <Unauthorized />;
    // alert("warn");
  }
};

export default withAuth;
