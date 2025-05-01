import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, message, Typography, Row, Col, Spin } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../Api/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const AddStudentForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const { addStudent, getDepartments } = useAuth();
  const navigate = useNavigate();
  // Fetch departments for the dropdown
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Student added successfully',
    });
  };
  const error = (message) => {
    messageApi.open({
      type: 'error',
      content:message,
    });
  };

  useEffect(() => {
    const fetchDepartments = async () => {
    // success();
      try {
        setDepartmentsLoading(true);
        const response = await getDepartments();
        console.log('Departments API response:', response);
        
        if (response.success) {
          console.log('Processed departments:', response.data);
          
          // If no departments are returned, add a temporary mock department for testing
          if (!response.data || response.data.length === 0) {
            console.warn('No departments found, adding a placeholder for testing');
            const mockDepartments = [
              { id: 'mock-dept-1', name: 'Computer Science' },
              { id: 'mock-dept-2', name: 'Physics' },
              { id: 'mock-dept-3', name: 'Chemistry' }
            ];
            setDepartments(mockDepartments);
          } else {
            setDepartments(response.data);
          }
        } else {
          console.error('Failed to load departments:', response.message);
          message.error('Failed to load departments');
          setDepartments([]); // Set empty array as fallback
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        message.error('Failed to load departments');
        setDepartments([]); // Set empty array as fallback
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, [getDepartments]);
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
  // Handle form submission
  const onFinish = async (values) => {
    if (!checkAuth()) return;

    try {
      setLoading(true);
      const response = await addStudent(values);
      
      if (response.success) {
        message.success('Student added successfully');
        success();
        form.resetFields();
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        error(response.message || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      message.error('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Card title={<Title level={3}>Add New Student</Title>} style={{ width: '100%', borderRadius: '8px' }}>
      {contextHolder}
      <Spin spinning={loading || departmentsLoading}>
        <Form
          form={form}
          name="add_student_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Student Name */}
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter student full name' },
              { min: 3, message: 'Name must be at least 3 characters' },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Full Name (e.g., Ibrahim Musa)" 
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
              // { pattern: /.*@ibbu\.edu\.ng$/, message: 'Email must be an IBBU email (ending with @ibbu.edu.ng)' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="University Email (e.g., ibrahim@ibbu.edu.ng)" 
              size="large" 
            />
          </Form.Item>

          {/* Matric Number */}
          <Form.Item
            name="matricNo"
            label="Matric Number"
            rules={[
              { required: true, message: 'Please enter matric number' },
              { 
                message: 'Format should be like IBBU/21/PHY/0103' 
              }
            ]}
          >
            <Input 
              prefix={<IdcardOutlined />} 
              placeholder="Matric Number (e.g., IBBU/21/PHY/0103)" 
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

          {/* Department */}
          <Form.Item
            name="departmentName"
            label="Department"
            rules={[{ required: true, message: 'Please select a department' }]}
          >
            <Select
              placeholder="Select Department"
              size="large"
              loading={departmentsLoading}
            >
              {Array.isArray(departments) && departments.length > 0 ? (
                departments.map(dept => (
                  <Option key={dept.name} value={dept.name}>
                    {dept.name}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>No departments available</Option>
              )}
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Row justify="end">
              <Col>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  loading={loading}
                  style={{ 
                    minWidth: '150px',
                    backgroundColor: '#135200', 
                    borderColor: '#135200'
                  }}
                >
                  Add Student
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default AddStudentForm; 