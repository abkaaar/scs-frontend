import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/pages/Home";
import AdminDashboard from "./components/dashboards/adminDashboard/AdminDashboard";
import StudentLayout from "./components/dashboards/studentDashboard/StudentLayout";
import SuperAdminDashboard from "./components/dashboards/superAdminDashboard/SuperAdminDashboard";
import NotFound from "./components/pages/NotFound";
import Sign_in from "./components/auth/Sign_in";
import { AuthProvider } from "./components/Api/AuthContext";
import StudentDashboard from "./components/dashboards/studentDashboard/pages/DashboardPanel";
import ClearanceRequestForm from "./components/dashboards/studentDashboard/pages/ClearanceRequestForm";
import StudentProfile from "./components/dashboards/studentDashboard/pages/Profile";
import ClearanceRequests from "./components/dashboards/adminDashboard/ClearanceRequests";
import SuperAdminLayout from "./components/dashboards/superAdminDashboard/SuperAdminLayout";
import Departments from "./components/dashboards/superAdminDashboard/Departments";
import Users from "./components/dashboards/superAdminDashboard/Users";
import StudentUsers from "./components/dashboards/superAdminDashboard/StudentUsers";
import AdminUsers from "./components/dashboards/superAdminDashboard/AdminUsers";
import MainLayout from "./components/layout/Layout";
import AdminLayout from "./components/dashboards/adminDashboard/AdminLayout";
import SuperAdminClearanceRequests from "./components/dashboards/superAdminDashboard/ClearanceRequests";
import SuperAdminApprovals from "./components/dashboards/superAdminDashboard/SuperAdminApprovals";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<Sign_in />} />

          {/* Main Dashboard Route - Acts as role-based router */}
          <Route path="/dashboard" element={<MainLayout />} />

          {/* Role-specific routes */}
          <Route path="/dashboard/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="clearance-request" element={<ClearanceRequestForm />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          <Route path="/dashboard/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="clearance-requests" element={<ClearanceRequests />} />
          </Route>

          <Route path="/dashboard/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="departments" element={<Departments />} />
            <Route path="clearance-requests" element={<SuperAdminClearanceRequests />} />
            <Route path="approvals" element={<SuperAdminApprovals />} />
            <Route path="users" element={<Navigate to="/dashboard/super-admin/users/students" replace />} />
            <Route path="users/students" element={<StudentUsers />} />
            <Route path="users/admins" element={<AdminUsers />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;