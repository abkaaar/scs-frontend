import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layout,
    Typography,
    Card,
    Form,
    Input,
    Button,
    Avatar,
    Row,
    Col,
    Divider,
    Space,
    Upload,
    message,
    Tabs,
    Descriptions,
    ConfigProvider
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    EditOutlined,
    SaveOutlined,
    UploadOutlined,
    LockOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { greenTheme } from '../../theme';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const StudentProfile = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [studentData, setStudentData] = useState({
        first_name: 'John',
        last_name: 'Doe',
        other_name: '',
        email: 'john.doe@university.edu',
        matric_number: 'MAT123456',
        phone: '+234 800 123 4567',
        department: 'Computer Science',
        level: '400',
        avatar: null
    });

    const handleEdit = () => {
        form.setFieldsValue(studentData);
        setIsEditing(true);
    };

    const handleSave = (values) => {
        setLoading(true);
        console.log('Updated values:', values);
        // Here you would save the updated profile to your API
        setTimeout(() => {
            setStudentData({ ...studentData, ...values });
            setIsEditing(false);
            setLoading(false);
            message.success('Profile updated successfully!');
        }, 1000);
    };

    const handlePasswordChange = (values) => {
        setLoading(true);
        console.log('Password change:', values);
        // Here you would update the password via your API
        setTimeout(() => {
            passwordForm.resetFields();
            setLoading(false);
            message.success('Password changed successfully!');
        }, 1000);
    };

    const uploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <ConfigProvider theme={greenTheme}>

            <Layout style={{ minHeight: '100vh' }}>
                <Content className="site-layout-request" style={{ marginTop: 24 }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Space>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate('/dashboard/student')}
                            >
                                Back to Dashboard
                            </Button>
                        </Space>

                        <Title level={2}>Student Profile</Title>

                        <Row gutter={24}>
                            <Col xs={24} md={8}>
                                <Card>
                                    <div style={{ textAlign: 'center' }}>
                                        <Avatar size={100} icon={<UserOutlined />} src={studentData.avatar} />
                                        <Title level={4} style={{ marginTop: 16 }}>
                                            {studentData.first_name} {studentData.last_name}
                                        </Title>
                                        <Text type="secondary">{studentData.matric_number}</Text>
                                        <Divider />
                                        <Descriptions>
                                            <Descriptions.Item label="Email" span={3}>
                                                <Space>
                                                    <MailOutlined />
                                                    <Text>{studentData.email}</Text>
                                                </Space>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Department" span={3}>
                                                {studentData.department}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Level" span={3}>
                                                {studentData.level}
                                            </Descriptions.Item>
                                        </Descriptions>
                                        <Divider />
                                        <Upload {...uploadProps}>
                                            <Button icon={<UploadOutlined />}>Update Profile Picture</Button>
                                        </Upload>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} md={16}>
                                <Card>
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab="Personal Information" key="1">
                                            {!isEditing ? (
                                                <>
                                                    <Descriptions
                                                        bordered
                                                        column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                                                        size="small"
                                                    >
                                                        <Descriptions.Item label="First Name">{studentData.first_name}</Descriptions.Item>
                                                        <Descriptions.Item label="Last Name">{studentData.last_name}</Descriptions.Item>
                                                        <Descriptions.Item label="Other Name">{studentData.other_name || '—'}</Descriptions.Item>
                                                        <Descriptions.Item label="Email">{studentData.email}</Descriptions.Item>
                                                        <Descriptions.Item label="Matric Number">{studentData.matric_number}</Descriptions.Item>
                                                        <Descriptions.Item label="Phone Number">{studentData.phone}</Descriptions.Item>
                                                        <Descriptions.Item label="Department">{studentData.department}</Descriptions.Item>
                                                        <Descriptions.Item label="Level">{studentData.level}</Descriptions.Item>
                                                    </Descriptions>
                                                    <Button
                                                        type="primary"
                                                        icon={<EditOutlined />}
                                                        onClick={handleEdit}
                                                        style={{ marginTop: 16 }}
                                                    >
                                                        Edit Profile
                                                    </Button>
                                                </>
                                            ) : (
                                                <Form
                                                    form={form}
                                                    layout="vertical"
                                                    onFinish={handleSave}
                                                    initialValues={studentData}
                                                >
                                                    <Row gutter={16}>
                                                        <Col xs={24} md={8}>
                                                            <Form.Item
                                                                name="first_name"
                                                                label="First Name"
                                                                rules={[{ required: true, message: 'Please enter your first name' }]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} md={8}>
                                                            <Form.Item
                                                                name="last_name"
                                                                label="Last Name"
                                                                rules={[{ required: true, message: 'Please enter your last name' }]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} md={8}>
                                                            <Form.Item
                                                                name="other_name"
                                                                label="Other Name"
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>

                                                    <Row gutter={16}>
                                                        <Col xs={24} md={12}>
                                                            <Form.Item
                                                                name="email"
                                                                label="Email"
                                                                rules={[
                                                                    { required: true, message: 'Please enter your email' },
                                                                    { type: 'email', message: 'Please enter a valid email' }
                                                                ]}
                                                            >
                                                                <Input prefix={<MailOutlined />} disabled />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} md={12}>
                                                            <Form.Item
                                                                name="matric_number"
                                                                label="Matric Number"
                                                                rules={[{ required: true, message: 'Please enter your matric number' }]}
                                                            >
                                                                <Input disabled />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>

                                                    <Row gutter={16}>
                                                        <Col xs={24} md={8}>
                                                            <Form.Item
                                                                name="phone"
                                                                label="Phone Number"
                                                                rules={[{ required: true, message: 'Please enter your phone number' }]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} md={8}>
                                                            <Form.Item
                                                                name="department"
                                                                label="Department"
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input disabled />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} md={8}>
                                                            <Form.Item
                                                                name="level"
                                                                label="Level"
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input disabled />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>

                                                    <Form.Item>
                                                        <Space>
                                                            <Button
                                                                onClick={() => setIsEditing(false)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="primary"
                                                                icon={<SaveOutlined />}
                                                                loading={loading}
                                                                htmlType="submit"
                                                            >
                                                                Save Changes
                                                            </Button>
                                                        </Space>
                                                    </Form.Item>
                                                </Form>
                                            )}
                                        </TabPane>
                                        <TabPane tab="Change Password" key="2">
                                            <Form
                                                form={passwordForm}
                                                layout="vertical"
                                                onFinish={handlePasswordChange}
                                            >
                                                <Form.Item
                                                    name="current_password"
                                                    label="Current Password"
                                                    rules={[{ required: true, message: 'Please enter your current password' }]}
                                                >
                                                    <Input.Password prefix={<LockOutlined />} />
                                                </Form.Item>

                                                <Form.Item
                                                    name="new_password"
                                                    label="New Password"
                                                    rules={[
                                                        { required: true, message: 'Please enter your new password' },
                                                        { min: 8, message: 'Password must be at least 8 characters' }
                                                    ]}
                                                >
                                                    <Input.Password prefix={<LockOutlined />} />
                                                </Form.Item>

                                                <Form.Item
                                                    name="confirm_password"
                                                    label="Confirm New Password"
                                                    dependencies={['new_password']}
                                                    rules={[
                                                        { required: true, message: 'Please confirm your new password' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                if (!value || getFieldValue('new_password') === value) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('The two passwords do not match'));
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Input.Password prefix={<LockOutlined />} />
                                                </Form.Item>

                                                <Form.Item>
                                                    <Button
                                                        type="primary"
                                                        icon={<SaveOutlined />}
                                                        loading={loading}
                                                        htmlType="submit"
                                                    >
                                                        Update Password
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </TabPane>
                                    </Tabs>
                                </Card>
                            </Col>
                        </Row>
                    </Space>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default StudentProfile;