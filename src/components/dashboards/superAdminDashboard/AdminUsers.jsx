import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  message,
  Tag,
  Avatar,
  Tooltip,
  Input,
  Drawer,
  Divider,
  Form,
  Select,
  Statistic,
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  IdcardOutlined,
  UserAddOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import { useAuth } from '../../Api/AuthContext';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Define consistent theme colors
const themeColors = {
  primary: '#135200',      // Darker forest green (previously #52c41a)
  secondary: '#e6f7e6',    // Slightly darker background (previously #f6ffed)
  border: '#52c41a',       // Using the previous primary as border
  textPrimary: '#003300',  // Darker text (previously #006400)
  accent: '#1890ff'        // Keeping the blue accent
};

const AdminUsers = () => {
  const [form] = Form.useForm();
  const [admins, setAdmins] = useState([
    // Sample data - replace with actual API call in production
    { 
      key: '1', 
      name: 'John Admin', 
      email: 'john@ibbu.edu.ng', 
      phoneNumber: '08012345678',
      role: 'Department Admin', 
      department: 'Computer Science',
      departmentId: 'dept-1',
      status: 'Active'
    },
    { 
      key: '2', 
      name: 'Sarah Manager', 
      email: 'sarah@ibbu.edu.ng', 
      phoneNumber: '08023456789',
      role: 'Department Admin', 
      department: 'Physics',
      departmentId: 'dept-2',
      status: 'Active'
    },
    { 
      key: '3', 
      name: 'Michael Super', 
      email: 'michael@ibbu.edu.ng', 
      phoneNumber: '08034567890',
      role: 'Super Admin', 
      department: 'All Departments',
      departmentId: null,
      status: 'Active'
    },
  ]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [addAdminVisible, setAddAdminVisible] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const { getDepartments } = useAuth();

  // Fetch departments for the dropdown
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const response = await getDepartments();
      console.log('Departments response:', response);
      
      if (response.success) {
        setDepartments(response.data);
      } else {
        message.error('Failed to load departments');
        // Add placeholder departments for demonstration
        setDepartments([
          { id: 'dept-1', name: 'Computer Science' },
          { id: 'dept-2', name: 'Physics' },
          { id: 'dept-3', name: 'Chemistry' },
          { id: 'dept-4', name: 'Mathematics' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      message.error('Failed to load departments');
      // Add placeholder departments for demonstration
      setDepartments([
        { id: 'dept-1', name: 'Computer Science' },
        { id: 'dept-2', name: 'Physics' },
        { id: 'dept-3', name: 'Chemistry' },
        { id: 'dept-4', name: 'Mathematics' }
      ]);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // Apply search filter
  const filteredAdmins = admins.filter(admin => {
    const searchLower = searchText.toLowerCase();
    return (
      admin.name?.toLowerCase().includes(searchLower) ||
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.phoneNumber?.toLowerCase().includes(searchLower) ||
      admin.department?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = (key) => {
    setAdmins(admins.filter(admin => admin.key !== key));
    message.success('Admin user deleted successfully');
  };

  const handleAddAdmin = (values) => {
    console.log('Adding admin with values:', values);
    
    // Find the department name based on the selected departmentId
    const selectedDept = departments.find(dept => dept.id === values.departmentId);
    
    const newAdmin = {
      key: Date.now().toString(), // temporary key
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      role: values.role,
      department: values.role === 'Super Admin' ? 'All Departments' : (selectedDept?.name || 'Unknown Department'),
      departmentId: values.departmentId,
      status: 'Active'
    };
    
    setAdmins([...admins, newAdmin]);
    message.success('Admin user added successfully');
    setAddAdminVisible(false);
    form.resetFields();
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Super Admin':
        return themeColors.primary;
      case 'Department Admin':
        return themeColors.primary;
      default:
        return themeColors.accent;
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: themeColors.primary }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text) => <Tag color={themeColors.primary}>{text}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? themeColors.primary : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Admin">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              style={{ background: themeColors.primary, borderColor: themeColors.primary }}
              shape="circle"
            />
          </Tooltip>
          <Tooltip title="Delete Admin">
            <Button 
              danger 
              icon={<DeleteOutlined />}
              shape="circle"
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic 
                title="Total Admin Users" 
                value={admins.length} 
                prefix={<IdcardOutlined />} 
                valueStyle={{ color: themeColors.primary }}
              />
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ color: themeColors.textPrimary }}>Quick Actions</Text>
                </div>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<UserAddOutlined />} 
                    onClick={() => setAddAdminVisible(true)}
                    style={{ backgroundColor: themeColors.primary, borderColor: themeColors.primary }}
                  >
                    Add New Admin
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0, color: themeColors.primary }}>
              <SecurityScanOutlined /> Admin Users Management
            </Title>
            <Search
              placeholder="Search admin users..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
        }
        bordered={false}
        style={{ 
          borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' 
        }}
        headStyle={{ 
          borderBottom: `2px solid ${themeColors.border}`,
          backgroundColor: themeColors.secondary
        }}
      >
        <Table 
          columns={columns} 
          dataSource={filteredAdmins} 
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} admin users`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50']
          }}
          loading={loading}
          bordered
          style={{
            borderRadius: '8px',
            overflow: 'hidden'
          }}
          scroll={{ x: 'max-content' }}
          rowKey="key"
        />
      </Card>

      {/* Add Admin Drawer */}
      <Drawer
        title={
          <Title level={4} style={{ margin: 0 }}>
            <UserAddOutlined style={{ color: themeColors.primary, marginRight: 8 }} /> 
            Add New Admin User
          </Title>
        }
        width={600}
        open={addAdminVisible}
        onClose={() => setAddAdminVisible(false)}
        destroyOnClose={true}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button 
              onClick={() => setAddAdminVisible(false)} 
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={() => form.submit()}
              style={{ backgroundColor: themeColors.primary, borderColor: themeColors.primary }}
            >
              Add Admin
            </Button>
          </div>
        }
      >
        <Divider />
        <Form
          form={form}
          name="add_admin_form"
          layout="vertical"
          onFinish={handleAddAdmin}
          initialValues={{ role: 'Department Admin' }}
        >
          {/* Admin Name */}
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter admin full name' },
              { min: 3, message: 'Name must be at least 3 characters' },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Full Name (e.g., John Admin)" 
              size="large" 
            />
          </Form.Item>

          {/* Email Address */}
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email' },
              { pattern: /.*@ibbu\.edu\.ng$/, message: 'Email must be an IBBU email (ending with @ibbu.edu.ng)' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="University Email (e.g., john@ibbu.edu.ng)" 
              size="large" 
            />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter phone number' },
              { 
                pattern: /^[0-9]{11}$/, 
                message: 'Phone number must be 11 digits' 
              }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Phone Number (e.g., 08012345678)" 
              size="large" 
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              size="large" 
            />
          </Form.Item>

          {/* Admin Role */}
          <Form.Item
            name="role"
            label="Admin Role"
            rules={[{ required: true, message: 'Please select an admin role' }]}
          >
            <Select
              placeholder="Select Role"
              size="large"
            >
              <Option value="Department Admin">Department Admin</Option>
              <Option value="Super Admin">Super Admin</Option>
            </Select>
          </Form.Item>

          {/* Department - Only show if Department Admin is selected */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
          >
            {({ getFieldValue }) => 
              getFieldValue('role') === 'Department Admin' ? (
                <Form.Item
                  name="departmentId"
                  label="Department"
                  rules={[{ required: true, message: 'Please select a department' }]}
                >
                  <Select
                    placeholder="Select Department"
                    size="large"
                    loading={departmentsLoading}
                  >
                    {Array.isArray(departments) && departments.map(dept => (
                      <Option key={dept.id} value={dept.id}>
                        {dept.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default AdminUsers; 