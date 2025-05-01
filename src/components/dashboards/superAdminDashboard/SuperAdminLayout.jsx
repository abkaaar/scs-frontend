import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Typography, Divider, ConfigProvider, theme } from 'antd';
import { 
  CaretDownFilled, 
  UserOutlined, 
  DashboardOutlined, 
  TeamOutlined, 
  BankOutlined,
  UserAddOutlined,
  IdcardOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { useAuth } from '../../Api/AuthContext';

const { Header, Content, Footer, Sider } = Layout;
const { Text, Title } = Typography;
const { SubMenu } = Menu;

// Define consistent theme colors
const themeColors = {
  primary: '#135200',      // Darker forest green (previously #52c41a)
  secondary: '#e6f7e6',    // Slightly darker background (previously #f6ffed)
  border: '#52c41a',       // Using the previous primary as border
  selectedBg: '#d4ebd4',   // Slightly darker selected background
  textPrimary: '#003300',  // Darker text (previously #006400)
  textHover: '#135200'     // Darker hover text (previously #52c41a)
};

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { api, user, logout } = useAuth();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
  };

  const profileMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Profile',
          icon: <UserOutlined />,
        },
        {
          key: '2',
          label: 'Settings',
          icon: <SettingOutlined />,
        },
        {
          key: '3',
          label: 'Logout',
          icon: <LogoutOutlined />,
          onClick: handleLogout
        },
      ]}
    />
  );

  // Get the base path for active menu highlighting
  const currentPath = location.pathname;
  const isStudentsActive = currentPath.includes('/users/students');
  const isAdminsActive = currentPath.includes('/users/admins');
  const isUsersActive = currentPath.includes('/users');

  // Define menu items for super admin side nav with icons and sub-menus
  const menuItems = [
    {
      key: '/dashboard/super-admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/dashboard/super-admin/departments',
      icon: <BankOutlined />,
      label: 'Departments',
    },
    {
      key: '/dashboard/super-admin/clearance-requests',
      icon: <BankOutlined />,
      label: 'Clearance Requests',
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Users',
      children: [
        {
          key: '/dashboard/super-admin/users/students',
          icon: <BookOutlined />,
          label: 'Students',
        },
        {
          key: '/dashboard/super-admin/users/admins',
          icon: <IdcardOutlined />,
          label: 'Admin Users',
        },
      ],
    },
  ];

  const onMenuClick = ({ key }) => {
    navigate(key);
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  };

  // Calculate content margin based on sidebar state
  const contentMarginLeft = collapsed ? 80 : 250;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="80"
        collapsed={collapsed}
        width={250}
        theme="light"
        onCollapse={(value) => setCollapsed(value)}
        style={{
          position: 'fixed',
          height: '100vh',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          overflow: 'auto'
        }}
      >
        <div className="logo" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '16px 0',
          borderBottom: `1px solid ${themeColors.border}` 
        }}>
          {collapsed ? (
            <img src={logo} alt="Logo" style={{ width: '40px', height: '40px' }} />
          ) : (
            <img src="https://ibbu.edu.ng/wp-content/uploads/2023/12/logo2.svg" style={{ width: '90%', maxHeight: '60px' }} alt="IBB University Logo" />
          )}
        </div>
        
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                colorItemText: themeColors.textPrimary,
                colorItemTextSelected: themeColors.primary,
                colorItemBgSelected: themeColors.selectedBg,
                colorItemTextHover: themeColors.textHover,
                colorItemBgHover: themeColors.secondary,
                colorActiveBarBorderSize: 3,
                colorActiveBarWidth: 3,
                colorActiveBarHeight: 0,
                colorItemBg: 'transparent',
                colorSubItemBg: 'transparent',
                itemSelectedColor: themeColors.primary,
                itemHoverColor: themeColors.primary,
                itemActiveBg: themeColors.selectedBg,
                horizontalItemSelectedColor: themeColors.primary,
                horizontalItemHoverColor: themeColors.primary,
              },
            },
            token: {
              colorPrimary: themeColors.primary,
            }
          }}
        >
          {!collapsed && (
            <div style={{ 
              margin: '16px 16px', 
              padding: '8px', 
              background: themeColors.secondary, 
              borderRadius: '8px',
              border: `1px solid ${themeColors.border}`
            }}>
              <Text style={{ color: themeColors.primary, fontSize: '14px', fontWeight: 'bold', display: 'block' }}>Super Admin</Text>
              <Text style={{ fontSize: '13px', wordBreak: 'break-word' }}>
                {user && user.email ? user.email : 'No email available'}
              </Text>
            </div>
          )}
          
          <Menu
            theme="light"
            defaultOpenKeys={isUsersActive ? ['users'] : []}
            selectedKeys={[
              currentPath === '/dashboard/super-admin' ? '/dashboard/super-admin' : 
              currentPath.includes('/departments') ? '/dashboard/super-admin/departments' :
              currentPath.includes('/clearance-requests') ? '/dashboard/super-admin/clearance-requests' :
              isStudentsActive ? '/dashboard/super-admin/users/students' :
              isAdminsActive ? '/dashboard/super-admin/users/admins' :
              isUsersActive ? 'users' : ''
            ]}
            onClick={onMenuClick}
            mode="inline"
            items={menuItems}
            style={{ 
              borderRight: 0,
            }}
          />
        </ConfigProvider>
      </Sider>
      <Layout style={{ marginLeft: contentMarginLeft, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 5,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
            height: '64px'
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: themeColors.primary }}>Super Admin Portal</Title>
          </div>

          <div>
            <Dropdown overlay={profileMenu} placement="bottomRight" trigger={['click']}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: themeColors.primary }} />
                <CaretDownFilled style={{ marginLeft: 8, color: '#8c8c8c' }} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            minHeight: 280,
           
            borderRadius: '8px',
            margin: '16px'
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', padding: '12px 16px' }}>
          Bantigi Oasis ©{new Date().getFullYear()} Created by Bantigi Oasis
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SuperAdminLayout;
