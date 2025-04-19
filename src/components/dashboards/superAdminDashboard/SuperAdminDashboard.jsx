import React, { useState } from 'react';
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Table,
  Statistic,
  Space,
} from 'antd';
import {
  BarChartOutlined,
  PieChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import SuperAdminSideNav from './SuperAdminSideNav';

const { Title, Text } = Typography;
const { Content } = Layout;

const SuperAdminDashboard = () => {
  // Sample data for stats
  const [stats] = useState({
    totalClearanceRequests: 500,
    totalDepartments: 12,
    totalUsers: 150,
  });

  // Sample data for clearance approvals by department (for chart placeholder)
  const [approvalStats] = useState([
    { department: 'Computer Science', approvals: 120 },
    { department: 'Electrical Engineering', approvals: 90 },
    { department: 'Mechanical Engineering', approvals: 70 },
    { department: 'Civil Engineering', approvals: 50 },
  ]);

  // Sample data for activity logs
  const [activityLogs] = useState([
    {
      key: '1',
      user: 'admin1',
      action: 'Approved clearance for student MAT123456',
      date: '2025-03-15 10:00',
    },
    {
      key: '2',
      user: 'admin2',
      action: 'Added new department: Environmental Science',
      date: '2025-03-14 15:30',
    },
  ]);

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SuperAdminSideNav />
      <Layout style={{ marginLeft: 200, padding: '24px' }}>
        <Content>
          <Title level={2}>Super Admin Dashboard</Title>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Clearance Requests"
                  value={stats.totalClearanceRequests}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Departments"
                  value={stats.totalDepartments}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={stats.totalUsers}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Clearance Approvals by Department" style={{ marginTop: 24 }}>
            {/* Placeholder for bar/pie chart */}
            <p>Chart placeholder - implement with chart library</p>
            <ul>
              {approvalStats.map((item) => (
                <li key={item.department}>
                  {item.department}: {item.approvals} approvals
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Activity Logs" style={{ marginTop: 24 }}>
            <Table columns={columns} dataSource={activityLogs} pagination={{ pageSize: 5 }} />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SuperAdminDashboard;
