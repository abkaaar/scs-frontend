import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Layout, Typography, Card, Row, Col, Table, Statistic, Space, Avatar, Badge, Divider, message } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  AppstoreOutlined,
  BellOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import SuperAdminSideNav from './SuperAdminSideNav';
import axios from 'axios';
import API_ENDPOINTS from '../../Api/environtment';
import { useAuth } from '../../Api/AuthContext';
const { Title, Text } = Typography;
const { Content, Header } = Layout;

const SuperAdminDashboard = () => {
  const [clearanceRequests, setClearanceRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState(0);
  const [rejectedRequests, setRejectedRequests] = useState(0); 
  const [departments, setDepartments] = useState([]);
  const { getStudents, deleteStudent } = useAuth();
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  // Dashboard stats
  const [stats] = useState({
    totalClearanceRequests: 500,
    totalDepartments: 12,
    totalUsers: 150,
    pendingRequests: 1,
    approvedRequests: 0,
    rejectedRequests: 0
  });

  useEffect(() => {
    fetchRequests();
    fetchDepartments();
    fetchStudents();
  }, []);

  const fetchRequests = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.CLEARANCE_BASE}/all`, {

        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.data.success) {
        setClearanceRequests(response.data.data.length);
        console.log(response.data.data.filter((item)=>item.studentId === '5d99f019-33ed-46df-93b8-952bdd37387b'));
        setPendingRequests(response.data.data.filter((item)=>item.status === 'PENDING').length);
        setApprovedRequests(response.data.data.filter((item)=>item.status === 'APPROVED').length);
        setRejectedRequests(response.data.data.filter((item)=>item.status === 'REJECTED').length);
      } else {
        message.error('Failed to fetch clearance requests');
      }
    } catch (error) {
      message.error('Failed to fetch clearance requests');
    } finally {
      // setLoading(false);
    }
  };
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.GET_ALL_DEPARTMENTS}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        } 
      });
      if (response.data.success) {
        setDepartments(response.data.data);
        // Generate approval stats based on actual departments
        const colors = ['#52c41a', '#13c2c2', '#1890ff', '#722ed1', '#eb2f96', '#fa8c16', '#f5222d', '#faad14', '#a0d911', '#52c41a', '#13c2c2', '#1890ff'];
        const newApprovalStats = response.data.data.map((dept, index) => ({
          department: dept.name,
          approvals: Math.floor(Math.random() * 100) + 20, // Random number between 20-120 for demo
          color: colors[index % colors.length]
        }));
        setApprovalStats(newApprovalStats);
      } else {
        message.error('Failed to fetch departments');
      }
    } catch (error) {
      message.error('Failed to fetch departments');
    }
  };  
  const fetchStudents = async () => {
    // setLoading(true);
    try {
      const response = await getStudents();
      if (response.success) {
        // Transform data to match table structure
        const formattedStudents = response.data.data.map(student => ({
          key: student.id,
          name: student.name,
          email: student.user.email,
          matricNo: student.matricNo,
          phoneNumber: student.phoneNumber,
          departmentId: student.departmentId,
          departmentName: student.departmentName || 'Not assigned'
        }));
        setStudents(formattedStudents);
        setTotalStudents(response.data.data.length);
      } else {
        message.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to fetch students');
    } finally {
      // setLoading(false);
    }
  };
  
  // Department approval data for charts
  const [approvalStats, setApprovalStats] = useState([]);

  // Request status data for pie chart
  const requestStatusData = [
    { name: 'Approved', value: approvedRequests, color: '#52c41a' },
    { name: 'Pending', value: pendingRequests, color: '#faad14' },
    { name: 'Rejected', value: rejectedRequests, color: '#ff4d4f' },
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
      <Layout style={{}}>
        <div style={{ background: '#1e6641', marginRight: '2%', marginLeft: '2%', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderRadius: '8px' }}>
          <Title level={3} style={{ margin: 0, color: '#fff' }}>Super Admin Dashboard</Title>

        </div>

        <Content style={{ padding: '24px', overflow: 'auto' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card hoverable style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                <Statistic
                  title={<Text strong style={{ color: '#1e6641' }}>Total Clearance Requests</Text>}
                  value={clearanceRequests}
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
                  value={departments.length}
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
                  title={<Text strong style={{ color: '#1e6641' }}>Total Students</Text>}
                  value={totalStudents}
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
                  <Col span={8} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Statistic
                      value={approvedRequests}
                      style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'}}
                      title={<Text style={{ color: '#52c41a' }}><CheckCircleOutlined /> Approved</Text>}
                      valueStyle={{ color: '#52c41a', fontSize: '15px' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      value={pendingRequests}
                      style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'}}
                      title={<Text style={{ color: '#faad14' }}><ClockCircleOutlined /> Pending</Text>}
                      valueStyle={{ color: '#faad14', fontSize: '15px' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      value={rejectedRequests}
                      style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'}}
                      title={<Text style={{ color: '#ff4d4f' }}><ClockCircleOutlined /> Rejected</Text>}
                      valueStyle={{ color: '#ff4d4f', fontSize: '15px' }}
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
                    margin={{ top: 5, right: 0, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
                      interval={0}
                      height={60}
                    />
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