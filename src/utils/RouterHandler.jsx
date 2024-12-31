import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Department from "../pages/dashboard/Department";
import DepartmentDetails from "../pages/DepartmentDetails";
import SignUp from "../pages/SignUp";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../hoc/PrivateRoute";
import GuestRoute from "../hoc/GuestRoute";
import HasProfileRoute from "../hoc/NoProfileRoute";
import NoProfileRoute from "../hoc/NoProfileRoute";
import ProfileSetup from "../pages/onboarding/ProfileSetup";
import RouteGuard from "../hoc/RouteGuard";
import Welcome from "../pages/Welcome";
import Homepage from "../pages/user/Homepage";
import Menu from "../pages/user/profile/Menu";
import VerifyId from "../pages/verification/VerifyId";
import Verification from "../pages/verification/Verification";
import Details from "../pages/user/profile/Details";
import Security from "../pages/user/profile/Security";
import Register from "../pages/auth/Register";
import Employee from "../pages/dashboard/employee/Employee";
import EmployeeDetails from "../pages/dashboard/employee/details/EmployeeDetails";
import CreateEmployeeContract from "../pages/dashboard/employee/create/CreateEmployeeContract";
import Settings from "../pages/dashboard/Settings";
import Payroll from "../pages/dashboard/Payroll";
import MyCalendar from "../pages/Calendar";
import Notification from "../pages/user/Notification";
// import ProfileSettings from "../pages/user/profile/ProfileSettings";
// import Details from "../pages/user/profile/Details";
// import Personal from "../pages/user/profile/details/Personal";
// import Contact from "../pages/user/profile/details/Contact";
// import Job from "../pages/user/profile/details/Job";

function RouterHandler() {
  return (
    <AuthProvider>
      <Routes>
        {/* <Route path="/auth" element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="tes" element={<SignUp />} />
        </Route>
        <Route path="/" element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/department" element={<HasProfileRoute />} />
        </Route>
        <Route path="/welcome" element={<NoProfileRoute />} />
        <Route path="/dashboard/department/:departmentId/details" element={<DepartmentDetails />} /> */}

        <Route path="/auth" element={<RouteGuard type="guest" />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/welcome" element={<RouteGuard type="noProfile" />}>
          <Route element={<ProfileSetup />} />
        </Route>
        {/* <Route path="/" element={<RouteGuard type="private" allowedRoles={["user"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route> */}
        <Route path="/" element={<RouteGuard type={"private"} allowedRoles={["user"]} />}>
          <Route path="homepage" element={<Homepage />} />
          <Route path="settings" element={<Menu />} />
          <Route path="me" element={<Details />} />
          <Route path="security" element={<Security />} />
          <Route path="notification" element={<Notification />} />

          {/* <Route path="me" element={<Details />} />
          <Route path="/me">
            <Route path="profile" element={<Personal />} />
            <Route path="contacts" element={<Contact />} />
            <Route path="jobs" element={<Job />} />
          </Route> */}

          {/* <Route path="/secuirty"  */}
        </Route>

        <Route path="/" element={<RouteGuard type={"private"} allowedRoles={["admin"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/employee" element={<Employee />} />
          <Route path="dashboard/employee/:employeeId/details" element={<EmployeeDetails />} />
          <Route path="dashboard/employee/contract" element={<CreateEmployeeContract />} />
          <Route path="dashboard/department" element={<Department />} />
          <Route path="dashboard/settings" element={<Settings />} />
          <Route path="dashboard/payroll" element={<Payroll />} />
          <Route path="dashboard/calendar" element={<MyCalendar />} />
        </Route>

        <Route path="/tes" element={<ProfileSetup />} />
        <Route path="/verify" element={<VerifyId />} />
        <Route path="/verification" element={<Verification />} />
      </Routes>
    </AuthProvider>
  );
}

export default RouterHandler;
