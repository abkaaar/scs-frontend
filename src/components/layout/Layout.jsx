import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu,Dropdown, Avatar, theme, ConfigProvider } from 'antd';


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
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
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



  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}

      theme="light"
    >


      <Sider collapsible collapsed={collapsed}  width={250} theme='light' onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <img  src="https://ibbu.edu.ng/wp-content/uploads/2023/12/logo2.svg"style={{width:'15rem',margin:'3%'}} alt="IBB University Logo" />
       <br/>
       <ConfigProvider
    theme={{
      components: {
        Menu: {
          // Customize menu colors        // Background color of menu items
          colorItemText: '#006400',        // Text color of menu items
          colorItemTextSelected: 'green',  // Text color of selected item
          colorItemBgSelected: '#e6f7e6',  // Background of selected item
          colorItemTextHover: 'darkgreen', // Text color on hover
          // You can add more customizations as needed
        },
      },
    }}
  >

        <Menu theme="light" color='green' defaultSelectedKeys={['1']} mode="inline" items={items} />
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
        <div style={{ marginLeft: 16 }}>
          {/* Your logo or title can go here */}
          <span>Dashboard</span>
        </div>
        
        <div style={{ marginRight: 20 }}>
          <Dropdown overlay={profileMenu} placement="bottomRight">
            <Avatar 
              icon={<UserOutlined />} 
              style={{ cursor: 'pointer' }}
            />
          </Dropdown>  
        </div>
      </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Bill is a cat.
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Bantigi Oasis ©{new Date().getFullYear()} Created by Bantigi Oasis
        </Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;