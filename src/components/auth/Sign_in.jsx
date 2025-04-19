import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Row, Col, Typography, Card, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../Api/AuthContext';
import './auth.css';

const { Title, Paragraph } = Typography;

const Sign_in = () => {
  const { requestLogin, verifyOtp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // States for OTP flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [tempToken, setTempToken] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;

      // Determine if input is email or matric number
      const isMatric = /^[A-Za-z]{3}\/[0-9]{4}\/[0-9]{3}$/.test(email);
      const loginData = isMatric
        ? { matric_number: email, password }
        : { email, password };

      const response = await requestLogin(loginData);

      if (response.success) {
        setTempToken(response.token);
        setOtpSent(true);
        message.success('Login successful. Please enter the OTP sent to your email.');
      } else {
        message.error(response.message || 'Login failed', 5);
      }
    } catch (error) {
      message.error('Login error occurred', 5);
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async () => {
    if (!otpValue) {
      message.error('Please enter the OTP');
      return;
    }
    try {
      setLoading(true);
      const response = await verifyOtp(tempToken, otpValue);
      if (response.success) {
        message.success('OTP verified. Redirecting to dashboard...');
      } else {
        message.error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      message.error('OTP verification error occurred');
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

          {/* Right Side - Login or OTP Form */}
          <Col xs={24} md={12} className="right-panel">
            <div className="login-form-container">
              {!otpSent ? (
                <>
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
                          placeholder="Email or Matric Number (ABC/1234/567)"
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
                </>
              ) : (
                <>
                  <Title level={2} className="login-title">Enter OTP</Title>
                  <Paragraph>Please enter the OTP sent to your email to complete login.</Paragraph>
                  <Input
                    size="large"
                    placeholder="Enter OTP"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    disabled={loading}
                    style={{ marginBottom: 16 }}
                  />
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={onOtpSubmit}
                    loading={loading}
                  >
                    Verify OTP
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Sign_in;
