import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Typography, Divider, ConfigProvider, theme } from 'antd';
import { CaretDownFilled, UserOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/dashboard/super-admin',
    label: 'Dashboard',
  },
  {
    key: '/dashboard/super-admin/departments',
    label: 'Departments',
  },
  {
    key: '/dashboard/super-admin/users',
    label: 'Users',
  },
];


const SuperAdminSideNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const selectedKey = location.pathname.includes('/departments')
    ? '2'
    : location.pathname.includes('/users')
    ? '3'
    : '1';
    const onMenuClick = ({ key }) => {
      navigate(key);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
  return (
        <Layout style={{ minHeight: '100vh' }}>
    
     <Sider
           breakpoint="lg"
           collapsedWidth="0"
           collapsed={collapsed}
           width={250}
           theme="light"
           onCollapse={(value) => setCollapsed(value)}
           style={{
             position: 'fixed',
             height: '100vh',
             zIndex: 1,
           }}
         >
     <img src="https://ibbu.edu.ng/wp-content/uploads/2023/12/logo2.svg" style={{ width: '15rem', margin: '3%' }} alt="IBB University Logo" />
        <br />
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                colorItemText: '#006400',
                colorItemTextSelected: 'green',
                colorItemBgSelected: '#e6f7e6',
                colorItemTextHover: 'darkgreen',
              },
            },
          }}
        >
          <div style={{ margin: '5%' }}>
            <Text style={{ color: 'green', textAlign: 'center', fontSize: '1rem', fontWeight: 'bold' }}>Super Admin</Text>
            <br />
            <Text type="secondary">Role: Super Admin</Text>
          </div>
          <Divider />
          <Menu
            theme="light"
            selectedKeys={[location.pathname]}
            onClick={onMenuClick}
            mode="inline"
            items={menuItems}
          />
        </ConfigProvider>
      </Sider>
    </Layout>
  );
};

export default SuperAdminSideNav;
