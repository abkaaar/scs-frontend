import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, message, 
  Input, Select, Tag, Card, Typography, Row, Col, Breadcrumb, Progress,
  List, Descriptions, theme
} from 'antd';
import axios from 'axios';
import API_ENDPOINTS from '../../Api/environtment';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  HomeOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Custom theme colors
const customTheme = {
  primaryColor: '#1890ff',
  secondaryColor: '#006400', // Dark green
  lightGreen: '#e6f7e6',
  darkGreen: '#003300',
  textColor: '#333',
  backgroundColor: '#f5f5f5'
};

const SuperAdminApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  const [comment, setComment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [approvalRecords, setApprovalRecords] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    search: ''
  });

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        const response = await axios.get(API_ENDPOINTS.GET_ALL_DEPARTMENTS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (response.data.success) {
        let departmentsArray = [];
      
      if (response.data && response.data.success) {
        if (Array.isArray(response.data.data)) {
          departmentsArray = response.data.data;
        } else if (response.data.departments && Array.isArray(response.data.departments)) {
          departmentsArray = response.data.departments;
        }
      } else if (Array.isArray(response.data)) {
        departmentsArray = response.data;
      }
      setDepartments(departmentsArray);
        }
      } catch (error) {
        message.error('Failed to fetch departments');
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch requests when component mounts or filters change
  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.CLEARANCE_BASE}/all`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.data.success) {
        // Process approval records
        const allApprovals = response.data.data.flatMap(request => 
          request.approvals.map(approval => ({
            key: approval.id,
            id: approval.id,
            clearanceId: approval.clearanceId,
            departmentId: approval.departmentId,
            departmentName: departments.find(dept => dept.id === approval.departmentId)?.name || 'Unknown',
            status: approval.status,
            comment: approval.comment,
            createdAt: approval.createdAt,
            updatedAt: approval.updatedAt,
            studentName: request.student.name,
            matricNo: request.student.matricNo
          }))
        );
        setRequests(allApprovals);
      } else {
        message.error('Failed to fetch clearance requests');
      }
    } catch (error) {
      message.error('Failed to fetch clearance requests');
    } finally {
      setLoading(false);
    }
  };

  // Get department name by ID
  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  // Calculate approval progress
  const calculateProgress = (approvals) => {
    const total = approvals.length;
    const approved = approvals.filter(a => a.status === 'APPROVED').length;
    return Math.round((approved / total) * 100);
  };

  // Enhanced status tag rendering with custom colors
  const getStatusTag = (status) => {
    const statusMap = {
      PENDING: { 
        color: 'warning', 
        icon: <ClockCircleOutlined />,
        backgroundColor: '#fffbe6',
        borderColor: '#ffe58f'
      },
      APPROVED: { 
        color: 'success', 
        icon: <CheckCircleOutlined />,
        backgroundColor: '#f6ffed',
        borderColor: '#b7eb8f'
      },
      REJECTED: { 
        color: 'error', 
        icon: <CloseCircleOutlined />,
        backgroundColor: '#fff2f0',
        borderColor: '#ffccc7'
      }
    };
    return (
      <Tag 
        icon={statusMap[status]?.icon} 
        color={statusMap[status]?.color}
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: statusMap[status]?.backgroundColor,
          borderColor: statusMap[status]?.borderColor
        }}
      >
        {status}
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
        `${API_ENDPOINTS.CLEARANCE_BASE}/${currentRequest.id}/${actionType}`,
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
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Matric Number',
      dataIndex: 'matricNo',
      key: 'matricNo',
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'APPROVED' ? 'success' : 
          status === 'REJECTED' ? 'error' : 'warning'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => comment || '-',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: customTheme.backgroundColor,
      minHeight: '100vh'
    }}>
      <Breadcrumb 
        style={{ 
          marginBottom: '24px',
          padding: '12px 16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <UserOutlined /> Super Admin
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FileTextOutlined /> Approval Records
        </Breadcrumb.Item>
      </Breadcrumb>
      
      <Card
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: 'none'
        }}
      >
        <Title 
          level={3} 
          style={{ 
            color: customTheme.secondaryColor,
            marginBottom: '24px',
            fontWeight: 600
          }}
        >
          Approval Records
        </Title>
        
        {/* Filters Section */}
        <Card
          style={{
            marginBottom: '24px',
            backgroundColor: customTheme.lightGreen,
            borderRadius: '8px',
            border: `1px solid ${customTheme.secondaryColor}20`
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search by name or matric no"
                prefix={<SearchOutlined style={{ color: customTheme.secondaryColor }} />}
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                style={{ borderRadius: '6px' }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                style={{ width: '100%', borderRadius: '6px' }}
                placeholder="Filter by status"
                suffixIcon={<FilterOutlined style={{ color: customTheme.secondaryColor }} />}
                value={filters.status}
                onChange={(value) => setFilters({...filters, status: value})}
                allowClear
              >
                <Option value="PENDING">Pending</Option>
                <Option value="APPROVED">Approved</Option>
                <Option value="REJECTED">Rejected</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Button 
                type="primary"
                onClick={fetchRequests}
                loading={loading}
                style={{
                  backgroundColor: customTheme.secondaryColor,
                  borderColor: customTheme.secondaryColor,
                  borderRadius: '6px',
                  width: '100%'
                }}
              >
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Approval Records Table */}
        <Table
          columns={columns}
          dataSource={requests}
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          style={{
            borderRadius: '8px',
            overflow: 'hidden'
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Action Modal */}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '8px',
            color: customTheme.secondaryColor,
            fontSize: '18px',
            fontWeight: 600
          }}>
            {actionType === 'approve' ? (
              <>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                Approve Request
              </>
            ) : (
              <>
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                Reject Request
              </>
            )}
          </div>
        }
        visible={modalVisible}
        onOk={processRequest}
        onCancel={() => {
          setModalVisible(false);
          setComment('');
        }}
        okText={actionType === 'approve' ? 'Approve' : 'Reject'}
        okButtonProps={{
          type: actionType === 'approve' ? 'primary' : 'danger',
          style: {
            backgroundColor: actionType === 'approve' ? customTheme.secondaryColor : undefined,
            borderColor: actionType === 'approve' ? customTheme.secondaryColor : undefined,
            borderRadius: '6px',
            padding: '0 24px',
            height: '40px',
            fontWeight: 500
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: '6px',
            padding: '0 24px',
            height: '40px',
            fontWeight: 500
          }
        }}
        width={800}
        style={{ 
          borderRadius: '12px',
          overflow: 'hidden',
          padding: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          margin: '0 auto'
        }}
        bodyStyle={{
          padding: '24px',
          maxHeight: '70vh',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: `${customTheme.secondaryColor} #f0f0f0`,
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f0f0f0',
            borderRadius: '3px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: customTheme.secondaryColor,
            borderRadius: '3px'
          }
        }}
        centered
      >
        {currentRequest && (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Student Info Card */}
            <Card
              style={{
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: `${customTheme.secondaryColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserOutlined style={{ 
                    fontSize: '24px',
                    color: customTheme.secondaryColor
                  }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, color: customTheme.secondaryColor }}>
                    {currentRequest.studentName}
                  </Title>
                  <Text type="secondary">{currentRequest.matricNo}</Text>
                </div>
              </div>

              <Descriptions 
                bordered 
                column={2}
                style={{ borderRadius: '8px' }}
                size="small"
              >
                <Descriptions.Item label="Department" labelStyle={{ fontWeight: 500 }}>
                  {currentRequest.departmentName}
                </Descriptions.Item>
                <Descriptions.Item label="Status" labelStyle={{ fontWeight: 500 }}>
                  {getStatusTag(currentRequest.status)}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Progress Section */}
            <Card
              style={{
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ 
                  color: customTheme.secondaryColor,
                  fontSize: '16px'
                }}>
                  Approval Progress
                </Text>
              </div>
              <Progress 
                percent={calculateProgress(currentRequest.approvals)} 
                status={currentRequest.status === 'APPROVED' ? 'success' : 'active'}
                strokeColor={customTheme.secondaryColor}
                strokeWidth={8}
                showInfo={false}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '8px'
              }}>
                <Text type="secondary">Pending</Text>
                <Text type="secondary">
                  {calculateProgress(currentRequest.approvals)}% Complete
                </Text>
              </div>
            </Card>

            {/* Department Approvals */}
            <Card
              style={{
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ 
                  color: customTheme.secondaryColor,
                  fontSize: '16px'
                }}>
                  Department Approvals
                </Text>
              </div>
              <List
                dataSource={currentRequest.approvals}
                renderItem={(approval) => (
                  <List.Item
                    style={{
                      padding: '16px',
                      marginBottom: '8px',
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Row justify="space-between" align="middle">
                        <Col>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: `${customTheme.secondaryColor}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <FileTextOutlined style={{ 
                                fontSize: '16px',
                                color: customTheme.secondaryColor
                              }} />
                            </div>
                            <Text strong>{getDepartmentName(approval.departmentId)}</Text>
                          </div>
                        </Col>
                        <Col>
                          {getStatusTag(approval.status)}
                        </Col>
                      </Row>
                      {approval.comment && (
                        <div style={{
                          marginTop: '8px',
                          padding: '8px 12px',
                          backgroundColor: '#fafafa',
                          borderRadius: '4px'
                        }}>
                          <Text type="secondary" style={{ color: '#666' }}>
                            {approval.comment}
                          </Text>
                        </div>
                      )}
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
            
            {/* Comments Section */}
            <Card
              style={{
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ 
                  color: customTheme.secondaryColor,
                  fontSize: '16px'
                }}>
                  {actionType === 'approve' ? 'Approval' : 'Rejection'} Comments
                </Text>
              </div>
              <Input.TextArea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Enter your comments for ${actionType === 'approve' ? 'approval' : 'rejection'}...`}
                style={{ 
                  borderRadius: '6px',
                  border: '1px solid #d9d9d9',
                  '&:hover': {
                    borderColor: customTheme.secondaryColor
                  },
                  '&:focus': {
                    borderColor: customTheme.secondaryColor,
                    boxShadow: `0 0 0 2px ${customTheme.secondaryColor}20`
                  }
                }}
              />
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuperAdminApprovals;
