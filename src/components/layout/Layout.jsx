import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu,Dropdown, Avatar, theme, ConfigProvider } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import AdminDashboard from '../dashboards/adminDashboard/AdminDashboard';
import StudentLayout from '../dashboards/studentDashboard/StudentLayout';
import SuperAdminLayout from '../dashboards/superAdminDashboard/SuperAdminLayout';
import StudentDashboard from '../dashboards/studentDashboard/pages/DashboardPanel';


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
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const pathParts = location.pathname.split('/'); // splits the URL by '/'

  const role = pathParts[2]; // because index 0 is '', 1 is 'dashboard', 2 is the role

  const profileMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Profile',
        },
        {
          key: '2',
          label: 'Settings',
        },
        {
          key: '3',
          label: 'Logout',
        },
      ]}
    />
  );



  return (
   <>
{/* {role === 'admin' && <AdminDashboard/>}
      {role === 'student' && <StudentDashboard/>}
      {role === 'super-admin' && <SuperAdminLayout/>} */}
      <Outlet/>
   </>
  );
};
export default MainLayout;