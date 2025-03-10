import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import MainLayout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import AdminDashboard from "./components/dashboards/adminDashboard/AdminDashboard";
import StudentDashboard from "./components/dashboards/studentDashboard/StudentDashboard";
import SuperAdminDashboard from "./components/dashboards/superAdminDashboard/SuperAdminDashboard";
import NotFound from "./components/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Protected Dashboard Routes (Wrapped in MainLayout) */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="student" element={<StudentDashboard />} />
          <Route path="super-admin" element={<SuperAdminDashboard />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
