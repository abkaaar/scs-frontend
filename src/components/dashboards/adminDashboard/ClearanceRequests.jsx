import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, message, 
  Input, Select, Tag, Card, Typography, Row, Col, Breadcrumb 
} from 'antd';
import axios from 'axios';
import API_BASE_URL from '../../Api/environtment'; // Corrected import
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ClearanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  const [comment, setComment] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    search: ''
  });

  // Fetch requests when component mounts or filters change
  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/clearance-requests`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      message.error('Failed to fetch clearance requests');
    } finally {
      setLoading(false);
    }
  };

  // Status tag rendering
  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: 'warning', icon: <ClockCircleOutlined /> },
      approved: { color: 'success', icon: <CheckCircleOutlined /> },
      rejected: { color: 'error', icon: <CloseCircleOutlined /> }
    };
    return (
      <Tag icon={statusMap[status]?.icon} color={statusMap[status]?.color}>
        {status.toUpperCase()}
      </Tag>
    );
  };

  // Handle approve/reject actions
  const handleAction = (request, type) => {
    setCurrentRequest(request);
    setActionType(type);
    setModalVisible(true);
  };

  // Process approval/rejection
  const processRequest = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/clearance-requests/${currentRequest.id}/${actionType}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      message.success(response.data.message);
      setModalVisible(false);
      setComment('');
      fetchRequests(); // Refresh the list
    } catch (error) {
      message.error('Failed to process request');
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Student',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: 'Matric No',
      dataIndex: 'matric_number',
      key: 'matric_number',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Date Submitted',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button 
                type="link" 
                onClick={() => handleAction(record, 'approve')}
                icon={<CheckCircleOutlined />}
              >
                Approve
              </Button>
              <Button 
                type="link" 
                onClick={() => handleAction(record, 'reject')}
                icon={<CloseCircleOutlined />}
                danger
              >
                Reject
              </Button>
            </>
          )}
          <Button type="link">View Details</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Clearance Requests</Breadcrumb.Item>
      </Breadcrumb>
      
      <Card>
        <Title level={3}>Clearance Requests Management</Title>
        
        {/* Filters Section */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search by name or matric no"
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by status"
              suffixIcon={<FilterOutlined />}
              value={filters.status}
              onChange={(value) => setFilters({...filters, status: value})}
              allowClear
            >
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by department"
              suffixIcon={<FilterOutlined />}
              value={filters.department}
              onChange={(value) => setFilters({...filters, department: value})}
              allowClear
            >
              <Option value="computer_science">Computer Science</Option>
              <Option value="electrical_engineering">Electrical Engineering</Option>
              <Option value="mechanical_engineering">Mechanical Engineering</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              type="primary" 
              onClick={fetchRequests}
              loading={loading}
            >
              Apply Filters
            </Button>
          </Col>
        </Row>

        {/* Requests Table */}
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Action Modal */}
      <Modal
        title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Request`}
        visible={modalVisible}
        onOk={processRequest}
        onCancel={() => {
          setModalVisible(false);
          setComment('');
        }}
        okText={actionType === 'approve' ? 'Approve' : 'Reject'}
        okButtonProps={{
          type: actionType === 'approve' ? 'primary' : 'danger'
        }}
      >
        <p>Student: {currentRequest?.student_name}</p>
        <p>Matric No: {currentRequest?.matric_number}</p>
        <p>Department: {currentRequest?.department}</p>
        
        <div style={{ marginTop: '16px' }}>
          <Text strong>Comments:</Text>
          <Input.TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Enter comments for ${actionType === 'approve' ? 'approval' : 'rejection'}`}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ClearanceRequests;
