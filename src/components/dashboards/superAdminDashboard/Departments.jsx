import React, { useState } from 'react';
import {
  Layout,
  Typography,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from 'antd';
import SuperAdminSideNav from './SuperAdminSideNav';

const { Title } = Typography;

const Departments = () => {
  const [departments, setDepartments] = useState([
    { key: '1', name: 'Computer Science' },
    { key: '2', name: 'Electrical Engineering' },
    { key: '3', name: 'Mechanical Engineering' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [form] = Form.useForm();

  const showAddModal = () => {
    setEditingDepartment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingDepartment(record);
    form.setFieldsValue({ name: record.name });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (key) => {
    setDepartments(departments.filter((dept) => dept.key !== key));
    message.success('Department deleted');
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingDepartment) {
          // Edit existing
          setDepartments(
            departments.map((dept) =>
              dept.key === editingDepartment.key ? { ...dept, name: values.name } : dept
            )
          );
          message.success('Department updated');
        } else {
          // Add new
          const newDept = {
            key: (departments.length + 1).toString(),
            name: values.name,
          };
          setDepartments([...departments, newDept]);
          message.success('Department added');
        }
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this department?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SuperAdminSideNav />
      <Layout style={{ marginLeft: 200, padding: '24px' }}>
        <Card>
          <Title level={2}>Departments</Title>
          <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
            Add Department
          </Button>
          <Table columns={columns} dataSource={departments} pagination={{ pageSize: 5 }} />
        </Card>

        <Modal
          title={editingDepartment ? 'Edit Department' : 'Add Department'}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Save"
        >
          <Form form={form} layout="vertical" name="departmentForm">
            <Form.Item
              name="name"
              label="Department Name"
              rules={[{ required: true, message: 'Please input the department name!' }]}
            >
              <Input placeholder="Enter department name" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default Departments;
