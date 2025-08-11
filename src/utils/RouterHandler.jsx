import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { AdminRoute, GuestRoute, UserPrivateRoute } from "../hoc/RouteGuard";
import React, { Suspense, useEffect } from "react";
import { Loading } from "../components/Preloaders";
import Payslip from "../pages/user/Payslip";
import Success from "../pages/user/Success";
import UserCalendar from "../pages/user/Calendar";
import Shift from "../pages/dashboard/Shift";
import Summary from "../pages/dashboard/Summary";

const Login = React.lazy(() => import("../pages/Login"));
const Dashboard = React.lazy(() => import("../pages/dashboard/Dashboard"));
const Homepage = React.lazy(() => import("../pages/user/Homepage"));
const Menu = React.lazy(() => import("../pages/user/profile/Menu"));
const Details = React.lazy(() => import("../pages/user/profile/Details"));
const Security = React.lazy(() => import("../pages/user/profile/Security"));
const Employee = React.lazy(() => import("../pages/dashboard/employee/Employee"));
const EmployeeDetails = React.lazy(() => import("../pages/dashboard/employee/details/EmployeeDetails"));
const CreateEmployeeContract = React.lazy(() => import("../pages/dashboard/employee/create/CreateEmployeeContract"));
const Settings = React.lazy(() => import("../pages/dashboard/Settings"));
const Payroll = React.lazy(() => import("../pages/dashboard/Payroll"));
const MyCalendar = React.lazy(() => import("../pages/Calendar"));
const Notification = React.lazy(() => import("../pages/user/Notification"));
const Leave = React.lazy(() => import("../pages/user/Leave"));
const LeaveRequest = React.lazy(() => import("../pages/user/LeaveRequest"));
const Leaves = React.lazy(() => import("../pages/dashboard/Leaves"));
const Contact = React.lazy(() => import("../pages/user/profile/Contact"));
const Password = React.lazy(() => import("../pages/user/profile/Password"));
const Documents = React.lazy(() => import("../pages/dashboard/Documents"));
const Files = React.lazy(() => import("../pages/dashboard/settings/Files"));
const JobRole = React.lazy(() => import("../pages/dashboard/JobRole"));
const PrivacyPolicy = React.lazy(() => import("../pages/user/profile/PrivacyPolicy"));
const TermsCondition = React.lazy(() => import("../pages/user/profile/TermsCondition"));
const FAQ = React.lazy(() => import("../pages/user/profile/FAQ"));
const ChangeDevice = React.lazy(() => import("../pages/dashboard/ChangeDevice"));
const AttendanceCalendar = React.lazy(() => import("../pages/user/AttendanceCalendar"));
const Activity = React.lazy(() => import("../pages/user/Activity"));

function RouterHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/auth" element={<GuestRoute />}>
            <Route path="login" element={<Login />} />
          </Route>

          <Route element={<UserPrivateRoute />}>
            <Route path="homepage" element={<Homepage />} />
            <Route path="settings" element={<Menu />} />
            <Route path="calendar" element={<UserCalendar />} />
            <Route path="activity" element={<Activity />} />
            <Route path="calendar-attendance" element={<AttendanceCalendar />} />
            <Route path="me" element={<Details />} />
            <Route path="security">
              <Route path="" element={<Security />} />
              <Route path="contacts" element={<Contact />} />
              <Route path="password" element={<Password />} />
            </Route>
            <Route path="notification" element={<Notification />} />
            <Route path="leave">
              <Route path="" element={<Leave />} />
              <Route path="request" element={<LeaveRequest />} />
              <Route path="success" element={<Success />} />
            </Route>
            <Route path="payslip" element={<Payslip />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-and-condition" element={<TermsCondition />} />
            <Route path="faq" element={<FAQ />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="dashboard">
              <Route path="" element={<Dashboard />} />
              <Route path="employee">
                <Route path="" element={<Employee />} />
                <Route path=":employeeId/details" element={<EmployeeDetails />} />
                <Route path="contract" element={<CreateEmployeeContract />} />
              </Route>
              <Route path="jobrole" element={<JobRole />} />
              <Route path="shift" element={<Shift />} />
              <Route path="summary" element={<Summary />} />
              <Route path="settings" element={<Settings />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="calendar" element={<MyCalendar />} />
              <Route path="leaves" element={<Leaves />} />
              <Route path="change-device" element={<ChangeDevice />} />
              <Route path="document">
                <Route path="" element={<Documents />} />
                <Route path=":path" element={<Files />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default RouterHandler;
