import React, { useState, useEffect } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu,Dropdown, Avatar, theme, ConfigProvider } from 'antd';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminDashboard from '../dashboards/adminDashboard/AdminDashboard';
import StudentLayout from '../dashboards/studentDashboard/StudentLayout';
import SuperAdminLayout from '../dashboards/superAdminDashboard/SuperAdminLayout';
import StudentDashboard from '../dashboards/studentDashboard/pages/DashboardPanel';
import { useAuth } from '../Api/AuthContext';
import SuperAdminDashboard from '../dashboards/superAdminDashboard/SuperAdminDashboard';

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Clearance Request', '2', <DesktopOutlined />),
  getItem('Clearance Status', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Profile', '9', <UserOutlined />),
];

const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Redirect to the appropriate dashboard based on user role
    if (user) {
      const currentPath = location.pathname;
      
      if (currentPath === '/dashboard') {
        if (user.role === 'SUPER_ADMIN') {
          navigate('/dashboard/super-admin');
        } else if (user.role === 'admin') {
          navigate('/dashboard/admin');
        } else if (user.role === 'STUDENT') {
          navigate('/dashboard/student');
        }
      }
    }
  }, [user, navigate, location.pathname]);

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  // Just render the child routes
  return <Outlet />;
};

export default MainLayout;