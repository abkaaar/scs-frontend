import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Row, Col, Typography, Card, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../Api/AuthContext';
import './auth.css';

const { Title, Paragraph } = Typography;

const Sign_in = () => {
  const { requestLogin, verifyOtp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [email, setEmail] = useState(''); // State for email input

  // States for OTP flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [tempToken, setTempToken] = useState(null);
  const otpRefs = useRef([]);
  const [messageApi, contextHolder] = message.useMessage();
  const error = (message) => {
    messageApi.open({
      type: 'error',
      content:message,
    });
  };
  const success = (message) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };
  useEffect(() => {
    // Initialize refs when component mounts
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;

      // Determine if input is email or matric number
      const isMatric = /^[A-Za-z]{3}\/[0-9]{4}\/[0-9]{3}$/.test(email);
      const loginData = isMatric
        ? { matric_number: email, password }
        : { email, password };
      setEmail(email); // Store email for OTP verification

      const response = await requestLogin(loginData);

      if (response.success) {
        setTempToken(response.token);
        setOtpSent(true);
        success('Login successful. Please enter the OTP sent to your email.');
      } else {
        error(response.message || 'Login failed', 5);
      }
    } catch (error) {
      error('Login error occurred', 5);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Allow only single digit
    const digit = value.replace(/[^0-9]/g, '').slice(0, 1);
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = digit;
    setOtpValues(newOtpValues);
    
    // Auto-focus to next input if current input is filled
    if (digit && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const onOtpSubmit = async () => {
    const otpValue = otpValues.join('');
    if (otpValue.length !== 6) {
      error('Please enter the complete 6-digit OTP');
      return;
    }
    try {
      setLoading(true);
      const response = await verifyOtp(email, otpValue);
      if (response.success) {
        success('OTP verified. Redirecting to dashboard...');
        
      } else {
        error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      error('OTP verification error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {contextHolder}

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
                  <Paragraph>Please enter the 6-digit OTP sent to your email to complete login.</Paragraph>
                  
                  <div style={{ margin: '10px 0' }}>
                    <Row gutter={12} justify="center">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <Col key={index}>
                          <Input
                            ref={el => otpRefs.current[index] = el}
                            className="otp-input"
                            value={otpValues[index]}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            maxLength={1}
                            autoFocus={index === 0}
                            disabled={loading}
                            style={{
                              width: '40px',
                              height: '40px',
                              fontSize: '20px',
                              textAlign: 'center',
                              margin: '10px 4px',
                              borderRadius: '8px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                  
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={onOtpSubmit}
                    loading={loading}
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
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
