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
  Statistic,
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  BookOutlined,
  TeamOutlined,
  UploadOutlined
} from '@ant-design/icons';
import AddStudentForm from '../../users/AddStudentForm';
import { useAuth } from '../../Api/AuthContext';

const { Title, Text } = Typography;
const { Search } = Input;

// Define consistent theme colors
const themeColors = {
  primary: '#135200',      // Darker forest green (previously #52c41a)
  secondary: '#e6f7e6',    // Slightly darker background (previously #f6ffed)
  border: '#52c41a',       // Using the previous primary as border
  textPrimary: '#003300',  // Darker text (previously#dda926)
  accent: '#1890ff'  ,      // Keeping the blue accent
  warning: '#dda926'        // Keeping the blue accent
};

const StudentUsers = () => {
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [addStudentVisible, setAddStudentVisible] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const { getStudents, deleteStudent } = useAuth();

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
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
        setTotalStudents(formattedStudents.length);
      } else {
        message.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // Apply search filter
  const filteredStudents = students.filter(student => {
    const searchLower = searchText.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.matricNo?.toLowerCase().includes(searchLower) ||
      student.phoneNumber?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id) => {
    try {
      const response = await deleteStudent(id);
      if (response.success) {
        setStudents(students.filter(student => student.key !== id));
        setTotalStudents(prev => prev - 1);
        message.success('Student deleted successfully');
      } else {
        message.error(response.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      message.error('Failed to delete student');
    }
  };

  const handleAddStudentSuccess = () => {
    setAddStudentVisible(false);
    fetchStudents(); // Refresh the student list
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
      title: 'Matric Number',
      dataIndex: 'matricNo',
      key: 'matricNo',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (text) => <Tag color={themeColors.primary}>{text}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Student">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              style={{ background: themeColors.primary, borderColor: themeColors.primary }}
              shape="circle"
            />
          </Tooltip>
          <Tooltip title="Delete Student">
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
                title="Total Students" 
                value={totalStudents} 
                prefix={<TeamOutlined />} 
                valueStyle={{ color: themeColors.primary }}
              />
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '2%' }}>
                <div>
                  <Text strong style={{ color: themeColors.textPrimary }}>Quick Actions</Text>
                </div>
                <Space style={{ marginTop: '1%' }}>
                  <Button 
                    type="primary" 
                    icon={<UserAddOutlined />} 
                    onClick={() => setAddStudentVisible(true)}
                    style={{ backgroundColor: themeColors.primary, borderColor: themeColors.primary }}
                  >
                    Add New Student
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<UploadOutlined />} 
                    onClick={() => setAddStudentVisible(true)}
                    style={{ backgroundColor: themeColors.warning, borderColor: themeColors.warning }}
                  >
                    Upload Bulk Students
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
              <BookOutlined /> Student Management
            </Title>
            <Search
              placeholder="Search students..."
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
          dataSource={filteredStudents} 
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
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

      {/* Add Student Drawer */}
      <Drawer
        title={
          <Title level={4} style={{ margin: 0 }}>
            <UserAddOutlined style={{ color: themeColors.primary, marginRight: 8 }} /> 
            Add New Student
          </Title>
        }
        width={600}
        open={addStudentVisible}
        onClose={() => setAddStudentVisible(false)}
        destroyOnClose={true}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button 
              onClick={() => setAddStudentVisible(false)} 
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <Divider />
        <AddStudentForm onSuccess={handleAddStudentSuccess} />
      </Drawer>
    </>
  );
};

export default StudentUsers; 