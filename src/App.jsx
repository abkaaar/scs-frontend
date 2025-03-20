import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
// import MainLayout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import AdminDashboard from "./components/dashboards/adminDashboard/AdminDashboard";
import StudentLayout from "./components/dashboards/studentDashboard/StudentLayout";
import SuperAdminDashboard from "./components/dashboards/superAdminDashboard/SuperAdminDashboard";
import NotFound from "./components/pages/NotFound";
import Sign_in from "./components/auth/Sign_in";
import { AuthProvider } from "./components/Api/AuthContext";
import StudentDashboard from "./components/dashboards/studentDashboard/pages/DashboardPanel";
import ClearanceRequestForm from "./components/dashboards/studentDashboard/pages/ClearanceRequestForm";

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Sign_in />} />

        {/* Protected Dashboard Routes (Wrapped in MainLayout) */}
        <Route path="/dashboard" element={<StudentLayout />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="student" element={<StudentDashboard />} />
          <Route path="student/clearance-request" element={<ClearanceRequestForm />} />
          <Route path="super-admin" element={<SuperAdminDashboard />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
