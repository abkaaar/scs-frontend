import React, { useState } from 'react';
import {
  Layout,
  Typography,
  Card,
  Table,
  Button,
  Select,
  Space,
  message,
} from 'antd';
import SuperAdminSideNav from './SuperAdminSideNav';

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([
    { key: '1', name: 'John Doe', role: 'Student', email: 'john@example.com' },
    { key: '2', name: 'Jane Smith', role: 'Department Admin', email: 'jane@example.com' },
    { key: '3', name: 'Bob Johnson', role: 'Student', email: 'bob@example.com' },
  ]);

  const [roleFilter, setRoleFilter] = useState('All');

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
  };

  const filteredUsers = roleFilter === 'All' ? users : users.filter(user => user.role === roleFilter);

  const handleDelete = (key) => {
    setUsers(users.filter(user => user.key !== key));
    message.success('User deleted');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.key)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SuperAdminSideNav />
      <Layout style={{ marginLeft: 200, padding: '24px' }}>
        <Card>
          <Title level={2}>Users</Title>
          <Select
            defaultValue="All"
            style={{ width: 200, marginBottom: 16 }}
            onChange={handleRoleFilterChange}
          >
            <Option value="All">All Roles</Option>
            <Option value="Student">Student</Option>
            <Option value="Department Admin">Department Admin</Option>
          </Select>
          <Table columns={columns} dataSource={filteredUsers} pagination={{ pageSize: 5 }} />
        </Card>
      </Layout>
    </Layout>
  );
};

export default Users;
