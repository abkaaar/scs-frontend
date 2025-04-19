import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const SuperAdminSideNav = () => {
  const location = useLocation();
  const selectedKey = location.pathname.includes('/departments')
    ? '2'
    : location.pathname.includes('/users')
    ? '3'
    : '1';

  return (
    <Sider
      width={200}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        background: '#fff',
        boxShadow: '2px 0 8px 0 rgba(29,35,41,0.05)',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/dashboard/super-admin/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<ApartmentOutlined />}>
          <Link to="/dashboard/super-admin/departments">Departments</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<TeamOutlined />}>
          <Link to="/dashboard/super-admin/users">Users</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SuperAdminSideNav;
