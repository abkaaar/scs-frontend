import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layout, Typography, Card, Row, Col, Button, Progress,
  Table, Tag, Space, Statistic, Avatar, Divider, ConfigProvider, theme,
  Breadcrumb
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  HomeFilled
} from '@ant-design/icons';
import "../.././dashboard.css"
import { greenTheme } from '../../theme';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Custom theme with green colors


const StudentDashboard = () => {
  const navigate = useNavigate();
  const [clearanceData, setClearanceData] = useState({
      student: {
        first_name: 'John',
        last_name: 'Doe',
        matric_number: 'MAT123456',
        department: 'Computer Science',
        email: 'john.doe@university.edu',
      },
    departments: [
      { id: '1', name: 'Library', status: 'Approved', comments: 'All books returned', updatedAt: '2025-03-15' },
      { id: '2', name: 'Finance', status: 'Pending', comments: null, updatedAt: '2025-03-10' },
      { id: '3', name: 'Faculty', status: 'Rejected', comments: 'Outstanding project submission', updatedAt: '2025-03-17' },
      { id: '4', name: 'Hostel', status: 'Pending', comments: null, updatedAt: '2025-03-12' },
    ]
  });

  const items = [
    {
      path: `/dashboard/student`,
      title: <HomeFilled />,
    },


  ];

  function itemRender(currentRoute, params, items, paths) {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;

    // Assuming each route has an icon property
    const IconComponent = currentRoute.icon;

    return isLast ? (
      <span className="breadcrumb-item">
        <span className="breadcrumb-title">{currentRoute.title}</span>
        {IconComponent && <IconComponent className="breadcrumb-icon" />}
      </span>
    ) : (
      <Link to={`/${paths.join("/")}`} className="breadcrumb-item">
        <span className="breadcrumb-title">{currentRoute.title}</span>
        {IconComponent && <IconComponent className="breadcrumb-icon" />}
      </Link>
    );
  }

  // Calculate clearance progress
  const totalDepartments = clearanceData.departments.length;
  const approvedDepartments = clearanceData.departments.filter(dept => dept.status === 'Approved').length;
  const progress = Math.round((approvedDepartments / totalDepartments) * 100);

  const getStatusTag = (status) => {
    const statusMap = {
      Pending: { color: 'warning', icon: <ClockCircleOutlined /> },
      Approved: { color: 'success', icon: <CheckCircleOutlined /> },
      Rejected: { color: 'error', icon: <CloseCircleOutlined /> }
    };
    return (
      <Tag icon={statusMap[status].icon} color={statusMap[status].color}>
        {status}
      </Tag>
    );
  };

  // Responsive columns for different screen sizes
  const columns = [
    {
      title: 'Department',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
      render: (comments) => comments || '—',
      responsive: ['md', 'lg', 'xl'],
      ellipsis: true,
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      responsive: ['lg', 'xl'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/student/clearance/status/${record.id}`)}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider theme={greenTheme}>
      <Layout style={{ minHeight: '100vh', background: '#f0f8f0' }}>
        <Breadcrumb
          style={{
            marginLeft: '13%',
            marginTop: '2%',
            backgroundColor: 'white',
            width: '85%',
            color: 'white',  // Consider changing this to a visible color
            borderRadius: '15px',
            padding: '0.5%',
            textAlign: 'right'  // This is already aligning text to the right
          }}
          itemRender={itemRender}
          items={items}
        />
        <Content style={{ padding: '0 5%' }}>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} lg={20} xl={18}>
              <Title level={2} style={{ color: '#1b8a5a' }}>Student Clearance Dashboard</Title>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card hoverable bordered style={{ height: '100%', borderTop: '3px solid #1b8a5a' }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                      <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1b8a5a' }} />
                      <Title level={4}>{clearanceData.student.first_name} {clearanceData.student.last_name}</Title>
                      <Text type="secondary">Matric Number: {clearanceData.student.matric_number}</Text>
                      <Text type="secondary">Department: {clearanceData.student.department}</Text>
                      <Text type="secondary">Email: {clearanceData.student.email}</Text>
                      <Divider style={{ margin: '12px 0' }} />
                      <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        onClick={() => navigate('/dashboard/student/profile')}
                        block
                      >
                        View Profile
                      </Button>
                    </Space>
                  </Card>

                  <Card 
                    hoverable 
                    bordered 
                    style={{ marginTop: 16, borderTop: '3px solid #1b8a5a' }}
                    title={<Title level={4} style={{ color: '#1b8a5a' }}>Quick Links</Title>}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button 
                        type="link" 
                        block
                        onClick={() => navigate('/dashboard/student/clearance-request')}
                      >
                        Request New Clearance
                      </Button>
                      <Button 
                        type="link" 
                        block
                        onClick={() => navigate('/dashboard/student/payments')}
                      >
                        Make Payment
                      </Button>
                      <Button 
                        type="link" 
                        block
                        onClick={() => navigate('/dashboard/student/documents')}
                      >
                        Upload Documents
                      </Button>
                    </Space>
                  </Card>
                </Col>

                <Col xs={24} md={16}>
                  <Card hoverable bordered style={{ height: '100%', borderTop: '3px solid #1b8a5a' }}>
                    <Title level={4} style={{ color: '#1b8a5a' }}>Clearance Progress</Title>
                    <Progress
                      percent={progress}
                      status={progress === 100 ? "success" : "active"}
                      strokeColor={{
                        '0%': '#1b8a5a',
                        '100%': '#52c41a'
                      }}
                    />
                    <Row gutter={16} style={{ marginTop: 24 }}>
                      <Col xs={24} sm={8}>
                        <Statistic
                          title="Approved"
                          value={approvedDepartments}
                          suffix={`/ ${totalDepartments}`}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <Statistic
                          title="Pending"
                          value={clearanceData.departments.filter(dept => dept.status === 'Pending').length}
                          valueStyle={{ color: '#faad14' }}
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <Statistic
                          title="Rejected"
                          value={clearanceData.departments.filter(dept => dept.status === 'Rejected').length}
                          valueStyle={{ color: '#f5222d' }}
                        />
                      </Col>
                    </Row>
                  </Card>
                  
                  <Card 
                    hoverable 
                    bordered 
                    style={{ marginTop: 16, borderTop: '3px solid #1b8a5a' }}
                    title={<Title level={4} style={{ color: '#1b8a5a' }}>Department Notifications</Title>}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {clearanceData.departments
                        .filter(dept => dept.comments)
                        .map(dept => (
                          <div key={dept.id}>
                            <Text strong>{dept.name}:</Text> {dept.comments}
                          </div>
                        ))}
                      {clearanceData.departments.filter(dept => dept.comments).length === 0 && (
                        <Text type="secondary">No new notifications</Text>
                      )}
                    </Space>
                  </Card>
                </Col>
              </Row>

              <Card
                hoverable
                bordered
                style={{ marginTop: 16, borderTop: '3px solid #1b8a5a' }}
                bodyStyle={{ padding: '1px', overflow: 'auto' }}
              >
                <Space
                  style={{
                    marginBottom: 16,
                    display: 'flex',
                    padding: '2%',
                    justifyContent: 'space-between',
                    width: '100%',
                    flexDirection: window.innerWidth < 576 ? 'column' : 'row',
                    alignItems: window.innerWidth < 576 ? 'flex-start' : 'center',
                  }}
                >
                  <Title level={4} style={{ color: '#1b8a5a', margin: window.innerWidth < 576 ? '1% 0 16px 1%' : 0 }}>
                    Department Clearance Status
                  </Title>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}

                    onClick={() => navigate('/dashboard/student/clearance-request')}
                  >
                    New Clearance Request
                  </Button>
                </Space>
                <div style={{ overflowX: 'auto' }}>
                  <Table
                    columns={columns}
                    dataSource={clearanceData.departments}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    style={{ minWidth: '100%' }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default StudentDashboard;