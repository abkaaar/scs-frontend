import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Typography, Divider, ConfigProvider, theme } from 'antd';
import { CaretDownFilled, UserOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import AdminSideNav from './AdminSideNav';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

  // Define menu items for admin side nav
  const menuItems = [
    {
      key: '/dashboard/admin',
      label: 'Dashboard',
    },
    {
      key: '/dashboard/admin/clearance-requests',
      label: 'Clearance Requests',
    },
  ];

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
            <Text style={{ color: 'green', textAlign: 'center', fontSize: '1rem', fontWeight: 'bold' }}>Admin</Text>
            <br />
            <Text type="secondary">Role: Admin</Text>
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
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ marginLeft: 16, marginTop: 25 }}>
            <img className="mobile-logo" src={logo} alt="" width="50rem" />
          </div>

          <h3>Admin Portal</h3>

          <div style={{ marginRight: 20 }}>
            <Dropdown overlay={profileMenu} placement="bottomRight">
              <p>
                <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                <CaretDownFilled />
              </p>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            // padding: '24px',
            margin: "5%",
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Bantigi Oasis ©{new Date().getFullYear()} Created by Bantigi Oasis
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
