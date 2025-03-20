import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Row, Col, Typography, Divider, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../Api/AuthContext'; // Update with correct path
import './auth.css';
import axios from 'axios';


const { Title, Text, Paragraph } = Typography;

const Sign_in = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;
      const response = await axios.post('https://scs-backend-ue4a.onrender.com/api/auth/login', { email, password });
      console.log(response)
      // Don't need to show message here as it's handled in the auth context
    } catch (error) {
      // Error handling is done in the auth context
      console.error('Login submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Row>
          {/* Left Side - Branding */}
          <Col xs={24} md={12} className="left-panel">
            <div className="branding-content">
              <Title level={1} className="university-greeting">
                E-Clearance<br />Portal.
              </Title>
              <Paragraph className="university-tagline">
                Ibrahim Badamasi Babangida University - Excellence, Integrity, Innovation
              </Paragraph>
            </div>
          </Col>

          {/* Right Side - Login Form */}
          <Col xs={24} md={12} className="right-panel">
            <div className="login-form-container">
              <Title level={2} className="login-title">Login</Title>
              <Paragraph className="create-account-prompt">
                Don't have an account? <a href="/register">Create your account</a>, it takes less than a minute
              </Paragraph>

              <Spin spinning={loading}>
                <Form
                  form={form}
                  name="ibbu_login"
                  className="login-form"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your Username or Student ID!' }]}
                  >
                    <Input 
                      prefix={<UserOutlined className="site-form-item-icon" />} 
                      placeholder="Email or Student ID" 
                      size="large"
                      disabled={loading}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="Password"
                      size="large"
                      disabled={loading}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Row justify="space-between" align="middle">
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                      <a className="login-form-forgot" href="/forgot-password">
                        Forgot password?
                      </a>
                    </Row>
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      className="login-form-button" 
                      size="large" 
                      block
                      loading={loading}
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Sign_in;