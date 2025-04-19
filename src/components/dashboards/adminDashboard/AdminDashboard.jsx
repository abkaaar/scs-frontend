import React, { useState } from 'react';
import { 
  Layout, Typography, Card, Row, Col, Button, 
  Table, Tag, Space, Statistic, Divider, ConfigProvider 
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  PieChartOutlined,
  BarChartOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { greenTheme } from '../theme';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Sample data - replace with API calls
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalRequests: 124,
      approved: 89,
      pending: 22,
      rejected: 13
    },
    recentRequests: [
      {
        id: '1',
        studentName: 'John Doe',
        matricNo: 'MAT123456',
        department: 'Computer Science',
        status: 'Approved',
        date: '2025-03-15'
      },
      {
        id: '2',
        studentName: 'Jane Smith',
        matricNo: 'MAT789012',
        department: 'Electrical Engineering',
        status: 'Pending',
        date: '2025-03-14'
      }
    ]
  });

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

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Matric No',
      dataIndex: 'matricNo',
      key: 'matricNo',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">View</Button>
          <Button type="link">Process</Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider theme={greenTheme}>
      <Layout style={{ minHeight: '100vh', background: '#f0f8f0' }}>
    <div style={{ 
      padding: '24px',
      marginLeft: '200px', // Match side nav width
      width: 'calc(100% - 200px)' // Subtract nav width
    }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Title level={2} style={{ color: '#1b8a5a' }}>Admin Dashboard</Title>
            </Col>

            {/* Metrics Row */}
            <Col span={24}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Card bordered>
                    <Statistic
                      title="Total Requests"
                      value={dashboardData.metrics.totalRequests}
                      prefix={<BarChartOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card bordered>
                    <Statistic
                      title="Approved"
                      value={dashboardData.metrics.approved}
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card bordered>
                    <Statistic
                      title="Pending"
                      value={dashboardData.metrics.pending}
                      valueStyle={{ color: '#faad14' }}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card bordered>
                    <Statistic
                      title="Rejected"
                      value={dashboardData.metrics.rejected}
                      valueStyle={{ color: '#f5222d' }}
                      prefix={<CloseCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>

            {/* Charts Section */}
            <Col span={24}>
              <Card 
                title={<Title level={4} style={{ color: '#1b8a5a' }}>Clearance Statistics</Title>}
                bordered
                style={{ marginTop: 16 }}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <div style={{ textAlign: 'center' }}>
                      <PieChartOutlined style={{ fontSize: '64px', color: '#1b8a5a' }} />
                      <Text type="secondary">Approval Rate: {Math.round((dashboardData.metrics.approved / dashboardData.metrics.totalRequests) * 100)}%</Text>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={{ textAlign: 'center' }}>
                      <BarChartOutlined style={{ fontSize: '64px', color: '#1b8a5a' }} />
                      <Text type="secondary">Requests by Department (Chart Placeholder)</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Recent Requests Table */}
            <Col span={24}>
              <Card 
                title={<Title level={4} style={{ color: '#1b8a5a' }}>Recent Clearance Requests</Title>}
                bordered
                style={{ marginTop: 16 }}
              >
                <Table
                  columns={columns}
                  dataSource={dashboardData.recentRequests}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>

            {/* Clearance Management Section */}
            <Col span={24}>
              <Card 
                title={<Title level={4} style={{ color: '#1b8a5a' }}>Clearance Management</Title>}
                bordered
                style={{ marginTop: 16 }}
              >
                <Space>
                  <Button 
                    type="primary" 
                    onClick={() => navigate('/admin/clearance-requests')}
                    icon={<CheckCircleOutlined />}
                  >
                    Manage All Requests
                  </Button>
                  <Button 
                    type="default" 
                    onClick={() => navigate('/admin/reports')}
                    icon={<FileTextOutlined />}
                  >
                    Generate Reports
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminDashboard;
