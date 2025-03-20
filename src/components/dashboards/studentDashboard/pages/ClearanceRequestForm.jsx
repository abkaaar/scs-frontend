import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Typography, 
  Form, 
  Select, 
  Button, 
  Card, 
  Upload, 
  message, 
  Space, 
  Divider,
  Alert
} from 'antd';
import { 
  InboxOutlined, 
  ArrowLeftOutlined,
  SaveOutlined,
  SendOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const ClearanceRequestForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const departments = [
    { id: '1', name: 'Library' },
    { id: '2', name: 'Finance' },
    { id: '3', name: 'Faculty' },
    { id: '4', name: 'Hostel' },
  ];

  const handleFinish = (values) => {
    setLoading(true);
    console.log('Form values:', values);
    // Here you would submit the form data to your API
    setTimeout(() => {
      setLoading(false);
      message.success('Clearance request submitted successfully!');
      navigate('/student/clearance/status');
    }, 1500);
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/student/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Space>
          
          <Title level={2}>Submit Clearance Request</Title>
          
          <Alert
            message="Important Notice"
            description="Ensure all information provided is accurate. Upload all required documents to avoid delays in processing your clearance request."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{ department_id: '' }}
            >
              <Form.Item
                name="department_id"
                label="Department for Clearance"
                rules={[{ required: true, message: 'Please select a department' }]}
              >
                <Select placeholder="Select department for clearance">
                  {departments.map(dept => (
                    <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Divider orientation="left">Document Upload</Divider>
              <Paragraph type="secondary">
                Please upload the required documents for your clearance request. Accepted file formats: PDF, JPG, PNG (Max: 5MB)
              </Paragraph>
              
              <Form.Item
                name="primary_document"
                label="Primary Document"
                rules={[{ required: true, message: 'Please upload your primary document' }]}
                extra="Upload your primary clearance document (e.g., receipt, completion certificate)"
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single file upload. Strictly prohibited from uploading company data or other
                    banned files.
                  </p>
                </Dragger>
              </Form.Item>
              
              <Form.Item
                name="supporting_document"
                label="Supporting Document (Optional)"
                extra="Upload any additional supporting documents if required"
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single file upload. Strictly prohibited from uploading company data or other
                    banned files.
                  </p>
                </Dragger>
              </Form.Item>
              
              <Form.Item>
                <Space>
                  <Button type="default" onClick={() => form.resetFields()}>
                    Reset
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
                    Submit Request
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

export default ClearanceRequestForm;