import React, { Children, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CaretDownFilled,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb,Typography, Layout, Menu, Dropdown, Avatar, theme, ConfigProvider, Divider } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '../../../assets/logo.png'

const { Text } = Typography;
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children, link) {
  return {
    label,
    key,
    icon,
    children,
    link
  };
}
const items = [
  getItem('Dashboard', '/dashboard/student', <PieChartOutlined />,  '','student' ),
  getItem('Clearance Request', '/dashboard/student/clearance-request', <DesktopOutlined />,'','student/clearance-request'),
  getItem('Clearance Status', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Profile', '9', <UserOutlined />),
];




const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();





  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const selectNav = ({ item, key, keyPath, domEvent }) => {
    if (item.props.link) {
      navigate(item.props.link);
      if (window.innerWidth < 768) {
        setCollapsed(!collapsed);
      }
    }
    console.log(item.props.link)
  };
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


  const selectedKey = items.find(item => item.link === location.pathname)?.key;

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}

      theme="light"
    >


      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        width={250} theme='light'
        onCollapse={(value) => setCollapsed(value)}
        style={{
          position: 'fixed',
          height: '100vh',
          zIndex: 1,
          // overflowY: 'scroll'
        }}
      >
        {/* <div className="demo-logo-vertical" onClick={() => setCollapsed(collapsed)} >
        <img src={logo} alt="" />
        </div> */}
        <img src="https://ibbu.edu.ng/wp-content/uploads/2023/12/logo2.svg" style={{ width: '15rem', margin: '3%' }} alt="IBB University Logo" />
        <br />
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
          <div style={{ margin: '5%' }}>

          <Text style={{ color: 'green', textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', margin:'' }}>John Doe</Text><br/>
          <Text type="secondary">Matric Number: MAT123456</Text>
          </div>
          <Divider/>
          {/* <Text style={{ color: 'black', textAlign: 'center', fontSize: '0.5rem', fontWeight: 'bold', margin:'5%' }}>E-Clearance Portal</Text> */}
          <Menu theme="light" color='green'  selectedKeys={[location.pathname]}  onClick={selectNav}    mode="inline" items={items} />
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
          <div style={{ marginLeft: 16, marginTop: 25 }} >
            <img className='mobile-logo' src={logo} alt="" width='50rem' />
          </div>

          <h3>E-Clearance Portal</h3>

          <div style={{ marginRight: 20 }}>
            <Dropdown overlay={profileMenu} placement="bottomRight">
              <p>

              <Avatar
                icon={<UserOutlined />}
                style={{ cursor: 'pointer' }}
              />
              <CaretDownFilled/>
              </p>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            // margin: '0 16px',
          }}
          className="site-layout"
        >

          <Outlet />
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
export default StudentLayout;