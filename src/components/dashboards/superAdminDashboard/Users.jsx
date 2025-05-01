import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Select,
  Space,
  message,
  Tag,
  Avatar,
  Tooltip,
  Input,
  Modal,
  Drawer
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import AddStudentForm from '../../users/AddStudentForm';
import { useAuth } from '../../Api/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [addStudentVisible, setAddStudentVisible] = useState(false);
  const { getStudents, deleteStudent } = useAuth();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getStudents();
      if (response.success) {
        // Transform data to match table structure
        const formattedUsers = response.data.map(user => ({
          key: user.id,
          name: user.name,
          email: user.email,
          matricNo: user.matricNo,
          phoneNumber: user.phoneNumber,
          departmentId: user.departmentId,
          role: 'Student' // All users from this API are students
        }));
        setUsers(formattedUsers);
      } else {
        message.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
  };

  // Apply both role filter and search filter
  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.matricNo?.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesRole && matchesSearch;
  });

  const handleDelete = async (id) => {
    try {
      const response = await deleteStudent(id);
      if (response.success) {
        setUsers(users.filter(user => user.key !== id));
        message.success('User deleted successfully');
      } else {
        message.error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  // Get color for role tag
  const getRoleColor = (role) => {
    switch(role) {
      case 'Student':
        return 'blue';
      case 'Department Admin':
        return 'green';
      case 'Super Admin':
        return 'purple';
      default:
        return 'default';
    }
  };

  const handleAddStudentSuccess = () => {
    setAddStudentVisible(false);
    fetchUsers(); // Refresh the user list
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
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
      title: 'Matric Number',
      dataIndex: 'matricNo',
      key: 'matricNo',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit User">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
              shape="circle"
            />
          </Tooltip>
          <Tooltip title="Delete User">
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
      <Card 
        style={{ 
          borderRadius: '10px', 
          boxShadow: '0 4px 12px rgba(0, 100, 0, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <Title level={3} style={{ margin: 0, color: '#006400' }}>Users Management</Title>
          <Space wrap>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />} 
              onClick={() => setAddStudentVisible(true)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Add Student
            </Button>
            <Input
              placeholder="Search users"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined style={{ color: '#006400' }} />}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              value={roleFilter}
              style={{ width: 150 }}
              onChange={handleRoleFilterChange}
            >
              <Option value="All">All Roles</Option>
              <Option value="Student">Student</Option>
              <Option value="Department Admin">Department Admin</Option>
              <Option value="Super Admin">Super Admin</Option>
            </Select>
          </Space>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={filteredUsers} 
          pagination={{ 
            pageSize: 8,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            showSizeChanger: true,
            pageSizeOptions: ['5', '8', '15']
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

      {/* Add Student Drawer */}
      <Drawer
        title="Add New Student"
        width={600}
        open={addStudentVisible}
        onClose={() => setAddStudentVisible(false)}
        destroyOnClose={true}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setAddStudentVisible(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
          </div>
        }
      >
        <AddStudentForm onSuccess={handleAddStudentSuccess} />
      </Drawer>
    </>
  );
};

export default Users;