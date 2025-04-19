import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
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
import MainLayout from "./components/layout/Layout";
import AdminLayout from "./components/dashboards/adminDashboard/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<Sign_in />} />

          {/* Protected Dashboard Routes (Wrapped in MainLayout) */}
          <Route path="/dashboard" element={<MainLayout />}>
            <Route path="student" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="clearance-request" element={<ClearanceRequestForm />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>

            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="clearance-requests" element={<ClearanceRequests />} />
            </Route>

            <Route path="super-admin" element={<SuperAdminLayout />}>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="departments" element={<Departments />} />
              <Route path="users" element={<Users />} />
            </Route>

          </Route>

         

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;