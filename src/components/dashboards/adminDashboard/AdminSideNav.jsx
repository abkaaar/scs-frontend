import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const AdminSideNav = () => {
  return (
    <Sider
      width={200}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        background: '#fff',
        boxShadow: '2px 0 8px 0 rgba(29,35,41,0.05)'
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/dashboard/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<FileTextOutlined />}>
          <Link to="/dashboard/admin/clearance-requests">Clearance Requests</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          <Link to="/dashboard/admin/students">Student Management</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />}>
          <Link to="/dashboard/admin/settings">Settings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminSideNav;
