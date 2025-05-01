import React, { useState, useEffect } from 'react';
import {
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
  Spin,
  Empty,
  Tooltip,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import API_ENDPOINTS from '../../Api/environtment';
import { useAuth } from '../../Api/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { api, user } = useAuth();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // Check if we have the necessary auth
  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const userObj = localStorage.getItem('user');
    
    console.log('Department page - Token exists:', !!token);
    console.log('Department page - User exists:', !!userObj);
    
    if (!token || !userObj) {
      message.warning('You need to be logged in to access this page');
      navigate('/sign-in');
      return false;
    }
    
    // Check if user has SUPER_ADMIN role
    try {
      const parsedUser = JSON.parse(userObj);
      if (parsedUser.role !== 'SUPER_ADMIN') {
        message.warning('You do not have permission to access this page');
        navigate('/dashboard');
        return false;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      return false;
    }
    
    return true;
  };

  // Fetch departments from API
  const fetchDepartments = async () => {
    if (!checkAuth()) return;
    
    setLoading(true);
    try {
      console.log('Fetching departments with endpoint:', API_ENDPOINTS.GET_ALL_DEPARTMENTS);
      const response = await api.get(API_ENDPOINTS.GET_ALL_DEPARTMENTS);
      
      console.log('Department API response:', response.data);
      
      if (response.data && response.data.success) {
        const departmentsWithKeys = response.data.data.map(dept => ({
          ...dept,
          key: dept._id || Math.random().toString(36).substring(2, 9)
        }));
        setDepartments(departmentsWithKeys);
      } else {
        message.error(response.data?.message || 'Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      
      if (error.response?.status === 401) {
        message.error('Your session has expired. Please log in again.');
        navigate('/sign-in');
      } else {
        message.error('Error fetching departments. Please try again.');
      }
      
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // Load departments on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchDepartments();
    }
  }, [user]);

  // Also check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const showAddModal = () => {
    setEditingDepartment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingDepartment(record);
    form.setFieldsValue({ 
      name: record.name,
      description: record.description || ''
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    if (!checkAuth()) return;
    
    setLoading(true);
    try {
      console.log(`Deleting department with ID: ${id}`);
      const response = await api.delete(`${API_ENDPOINTS.DELETE_DEPARTMENT}/${id}`);
      
      if (response.data && response.data.success) {
        message.success('Department deleted successfully');
        fetchDepartments();
      } else {
        message.error(response.data?.message || 'Failed to delete department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      
      if (error.response?.status === 401) {
        message.error('Your session has expired. Please log in again.');
        navigate('/sign-in');
      } else {
        message.error('Error deleting department. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    if (!checkAuth()) return;
    
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        
        try {
          if (editingDepartment) {
            // Update existing department
            console.log(`Updating department with ID: ${editingDepartment._id}`, values);
            const response = await api.put(
              `${API_ENDPOINTS.UPDATE_DEPARTMENT}/${editingDepartment._id}`,
              values
            );
            
            if (response.data && response.data.success) {
              message.success('Department updated successfully');
              fetchDepartments();
            } else {
              message.error(response.data?.message || 'Failed to update department');
            }
          } else {
            // Add new department
            console.log('Creating new department:', values);
            const response = await api.post(API_ENDPOINTS.ADD_DEPARTMENT, values);
            
            if (response.data && response.data.success) {
              message.success('Department added successfully');
              fetchDepartments();
            } else {
              message.error(response.data?.message || 'Failed to add department');
            }
          }
          setIsModalVisible(false);
          form.resetFields();
        } catch (error) {
          console.error('Error saving department:', error);
          
          if (error.response?.status === 401) {
            message.error('Your session has expired. Please log in again.');
            navigate('/sign-in');
          } else {
            message.error('Error saving department. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  // Filter departments based on search
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong style={{ color: '#006400' }}>{text}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text ? text : <Text type="secondary">No description</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Department">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record)}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
              shape="circle"
            />
          </Tooltip>
          <Tooltip title="Delete Department">
            <Popconfirm
              title="Are you sure you want to delete this department?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record._id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                shape="circle"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      className="department-card"
      style={{ 
        borderRadius: '10px', 
        boxShadow: '0 4px 12px rgba(0, 100, 0, 0.08)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <Title level={3} style={{ margin: 0, color: '#006400' }}>
          Departments Management
        </Title>
        <Space wrap>
          <Input
            placeholder="Search departments"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined style={{ color: '#006400' }} />}
            style={{ width: 250 }}
            allowClear
          />
          <Tooltip title="Refresh">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchDepartments}
              style={{ borderColor: '#52c41a', color: '#52c41a' }}
            />
          </Tooltip>
          <Button 
            type="primary" 
            onClick={showAddModal} 
            icon={<PlusOutlined />}
            style={{ 
              background: '#006400', 
              borderColor: '#006400'
            }}
          >
            Add Department
          </Button>
        </Space>
      </div>

      <Spin spinning={loading}>
        {filteredDepartments.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={filteredDepartments} 
            pagination={{ 
              pageSize: 8,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} departments`,
              showSizeChanger: true,
              pageSizeOptions: ['5', '8', '15']
            }}
            bordered
            style={{
              borderRadius: '8px',
              overflow: 'hidden'
            }}
            scroll={{ x: 'max-content' }}
            rowKey="_id"
          />
        ) : (
          <Empty 
            description={searchText ? "No departments match your search" : "No departments found"} 
            style={{ margin: '40px 0' }}
          />
        )}
      </Spin>

      <Modal
        title={
          <div style={{ color: '#006400', borderBottom: '1px solid #e8e8e8', paddingBottom: '10px' }}>
            {editingDepartment ? 'Edit Department' : 'Add New Department'}
          </div>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingDepartment ? "Update" : "Create"}
        okButtonProps={{ 
          style: { 
            background: '#006400', 
            borderColor: '#006400'
          } 
        }}
        cancelButtonProps={{ style: { borderColor: '#d9d9d9' } }}
        maskClosable={false}
        destroyOnClose
        confirmLoading={loading}
      >
        <Form 
          form={form} 
          layout="vertical" 
          name="departmentForm"
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            label="Department Name"
            rules={[{ required: true, message: 'Please enter the department name' }]}
          >
            <Input placeholder="e.g. Computer Science" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ max: 200, message: 'Description should not exceed 200 characters' }]}
          >
            <TextArea 
              placeholder="Enter department description" 
              rows={4}
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Departments;
