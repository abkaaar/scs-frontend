import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import MainLayout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import AdminDashboard from "./components/dashboards/adminDashboard/AdminDashboard";
import StudentDashboard from "./components/dashboards/studentDashboard/StudentDashboard";
import SuperAdminDashboard from "./components/dashboards/superAdminDashboard/SuperAdminDashboard";
import NotFound from "./components/pages/NotFound";
import Sign_in from "./components/auth/Sign_in";
import { AuthProvider } from "./components/Api/AuthContext";

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
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="student" element={<StudentDashboard />} />
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
