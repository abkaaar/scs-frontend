import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Layout, Typography, Card, Row, Col, Table, Statistic, Space, Avatar, Badge, Divider } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  AppstoreOutlined,
  BellOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import SuperAdminSideNav from './SuperAdminSideNav';

const { Title, Text } = Typography;
const { Content, Header } = Layout;

const SuperAdminDashboard = () => {
  // Dashboard stats
  const [stats] = useState({
    totalClearanceRequests: 500,
    totalDepartments: 12,
    totalUsers: 150,
    pendingRequests: 45,
    approvedRequests: 425,
    rejectedRequests: 30
  });

  // Department approval data for charts
  const [approvalStats] = useState([
    { department: 'Computer Science', approvals: 120, color: '#52c41a' },
    { department: 'Electrical', approvals: 90, color: '#13c2c2' },
    { department: 'Mechanical', approvals: 70, color: '#1890ff' },
    { department: 'Civil', approvals: 50, color: '#722ed1' },
    { department: 'Medicine', approvals: 60, color: '#eb2f96' },
    { department: 'Business', approvals: 35, color: '#fa8c16' }
  ]);

  // Request status data for pie chart
  const requestStatusData = [
    { name: 'Approved', value: stats.approvedRequests, color: '#52c41a' },
    { name: 'Pending', value: stats.pendingRequests, color: '#faad14' },
    { name: 'Rejected', value: stats.rejectedRequests, color: '#ff4d4f' },
  ];

  // Recent activity logs
  const [activityLogs] = useState([
    {
      key: '1',
      user: 'Admin Smith',
      action: 'Approved clearance for student MAT123456',
      date: '2025-04-20 10:00',
      avatar: 'S',
      type: 'approval'
    },
    {
      key: '2',
      user: 'Dr. Johnson',
      action: 'Added new department: Environmental Science',
      date: '2025-04-19 15:30',
      avatar: 'J',
      type: 'department'
    },
    {
      key: '3',
      user: 'Admin Chen',
      action: 'Modified user permissions for Finance department',
      date: '2025-04-19 09:45',
      avatar: 'C',
      type: 'permission'
    },
    {
      key: '4',
      user: 'Prof. Williams',
      action: 'Rejected clearance request CS789012',
      date: '2025-04-18 14:20',
      avatar: 'W',
      type: 'rejection'
    },
    {
      key: '5',
      user: 'System',
      action: 'Backup completed successfully',
      date: '2025-04-18 01:00',
      avatar: 'S',
      type: 'system'
    },
  ]);

  // Action type colors for activity logs
  const getActionTypeColor = (type) => {
    switch (type) {
      case 'approval': return 'green';
      case 'rejection': return 'red';
      case 'department': return 'blue';
      case 'permission': return 'purple';
      case 'system': return 'gray';
      default: return 'green';
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: getActionTypeColor(record.type) }}>{record.avatar}</Avatar>
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Text>
          <Badge color={getActionTypeColor(record.type)} /> {text}
        </Text>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary">{text}</Text>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f5f0' }}>
      {/* <SuperAdminSideNav /> */}
      <Layout style={{  }}>
        <div style={{ background: '#1e6641',marginRight:'2%', marginLeft:'2%',padding: '16px 24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderRadius: '8px' }}>
          <Title level={3} style={{ margin: 0, color: '#fff' }}>Super Admin Dashboard</Title>
        
        </div>

        <Content style={{ padding: '24px', overflow: 'auto' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card hoverable style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                <Statistic
                  title={<Text strong style={{ color: '#1e6641' }}>Total Clearance Requests</Text>}
                  value={stats.totalClearanceRequests}
                  prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#1e6641' }}
                />
                <div style={{ marginTop: 8 }}>
                  <Badge status="success" text={<Text type="secondary">85% Processed</Text>} />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                <Statistic
                  title={<Text strong style={{ color: '#1e6641' }}>Total Departments</Text>}
                  value={stats.totalDepartments}
                  prefix={<AppstoreOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#1e6641' }}
                />
                <div style={{ marginTop: 8 }}>
                  <Badge status="processing" text={<Text type="secondary">2 Added this month</Text>} />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                <Statistic
                  title={<Text strong style={{ color: '#1e6641' }}>Total Users</Text>}
                  value={stats.totalUsers}
                  prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#1e6641' }}
                />
                <div style={{ marginTop: 8 }}>
                  <Badge status="warning" text={<Text type="secondary">12 New this week</Text>} />
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card
                title={<Title level={4} style={{ color: '#1e6641', margin: 0 }}>Clearance Request Status</Title>}
                style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
                extra={<Text type="secondary">Last 30 days</Text>}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Tooltip formatter={(value, name) => [`${value} Requests`, name]} />
                    <Pie
                      data={requestStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {requestStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                <Row gutter={16} style={{ marginTop: 8 }}>
                  <Col span={8}>
                    <Statistic
                      value={stats.approvedRequests}
                      title={<Text style={{ color: '#52c41a' }}><CheckCircleOutlined /> Approved</Text>}
                      valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      value={stats.pendingRequests}
                      title={<Text style={{ color: '#faad14' }}><ClockCircleOutlined /> Pending</Text>}
                      valueStyle={{ color: '#faad14', fontSize: '18px' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      value={stats.rejectedRequests}
                      title={<Text style={{ color: '#ff4d4f' }}><ClockCircleOutlined /> Rejected</Text>}
                      valueStyle={{ color: '#ff4d4f', fontSize: '18px' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={<Title level={4} style={{ color: '#1e6641', margin: 0 }}>Approvals by Department</Title>}
                style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
                extra={<Text type="secondary">Last 30 days</Text>}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={approvalStats}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value, name, props) => [`${value} Approvals`, props.payload.department]} />
                    <Legend />
                    <Bar dataKey="approvals" name="Approvals">
                      {approvalStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Card
            title={<Title level={4} style={{ color: '#1e6641', margin: 0 }}>Recent Activity Logs</Title>}
            style={{ marginTop: 16, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
            extra={<Badge count="New" style={{ backgroundColor: '#52c41a' }} />}
          >
            <Table
              columns={columns}
              dataSource={activityLogs}
              pagination={{ pageSize: 5 }}
              style={{ borderRadius: '8px' }}
              rowClassName={() => 'table-row-light'}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SuperAdminDashboard;