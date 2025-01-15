import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import RouteGuard from "../hoc/RouteGuard";
import React, { Suspense } from "react";
import { Loading } from "../components/Preloaders";

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

function RouterHandler() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/auth" element={<RouteGuard type="guest" />}>
            <Route path="login" element={<Login />} />
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
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-and-condition" element={<TermsCondition />} />
            <Route path="faq" element={<FAQ />} />
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
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default RouterHandler;
