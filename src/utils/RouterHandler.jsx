import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import { AuthProvider } from "../context/AuthContext";
import ProfileSetup from "../pages/onboarding/ProfileSetup";
import RouteGuard from "../hoc/RouteGuard";
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
import Leave from "../pages/user/Leave";
import LeaveRequest from "../pages/user/LeaveRequest";
import Leaves from "../pages/dashboard/Leaves";
import Contact from "../pages/user/profile/Contact";
import Password from "../pages/user/profile/Password";
import Documents from "../pages/dashboard/Documents";
import Files from "../pages/dashboard/settings/Files";
import JobRole from "../pages/dashboard/JobRole";

function RouterHandler() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<RouteGuard type="guest" />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/" element={<RouteGuard type={"private"} allowedRoles={["user"]} />}>
          <Route path="homepage" element={<Homepage />} />
          <Route path="settings" element={<Menu />} />
          <Route path="me" element={<Details />} />
          <Route path="security" element={<Security />} />
          <Route path="notification" element={<Notification />} />
          <Route path="leave" element={<Leave />} />
          <Route path="leave/request" element={<LeaveRequest />} />
          <Route path="security/contacts" element={<Contact />} />
          <Route path="security/password" element={<Password />} />
        </Route>
        <Route path="/" element={<RouteGuard type={"private"} allowedRoles={["admin"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/employee" element={<Employee />} />
          <Route path="dashboard/employee/:employeeId/details" element={<EmployeeDetails />} />
          <Route path="dashboard/employee/contract" element={<CreateEmployeeContract />} />
          <Route path="dashboard/jobrole" element={<JobRole />} />
          <Route path="dashboard/settings" element={<Settings />} />
          <Route path="dashboard/payroll" element={<Payroll />} />
          <Route path="dashboard/calendar" element={<MyCalendar />} />
          <Route path="dashboard/leaves" element={<Leaves />} />
          <Route path="dashboard/document" element={<Documents />} />
          <Route path="dashboard/document/:path" element={<Files />} />
        </Route>
        <Route path="/tes" element={<ProfileSetup />} />
        <Route path="/verify" element={<VerifyId />} />
        <Route path="/verification" element={<Verification />} />
      </Routes>
    </AuthProvider>
  );
}

export default RouterHandler;
