import React from "react";
import { Button, Typography, Row, Col, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import './home.css';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/sign-in");
  };

  return (
    <Layout className="body" style={{ minHeight: "100vh" }}>
      <Content>
        <Row
          justify="center"
          align="middle"
          style={{ minHeight: "100vh", padding: "0 20px" }}
        >
          <Col
            xs={24}
            sm={18}
            md={12}
            lg={10}
            xl={8}
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(27, 138, 90, 0.2)",
              textAlign: "center",
              border: "2px solid #1b8a5a",
            }}
          >
            <img
              src="https://ibbu.edu.ng/wp-content/uploads/2023/12/logo2.svg"
              alt="IBB University Logo"
              style={{ width: "80%", marginBottom: "24px" }}
            />
            <Title
              level={1}
              style={{ color: "#1b8a5a", marginBottom: "16px", fontWeight: "700" }}
            >
              Welcome to the Student Clearance System
            </Title>
            <Paragraph
              style={{
                fontSize: "16px",
                marginBottom: "32px",
                color: "#3a3a3a",
                fontWeight: "500",
              }}
            >
              Manage your clearance process efficiently and securely.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={handleLoginClick}
              style={{
                padding: "0 48px",
                fontSize: "16px",
                backgroundColor: "#1b8a5a",
                borderColor: "#1b8a5a",
                fontWeight: "600",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#166c44";
                e.currentTarget.style.borderColor = "#166c44";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "#1b8a5a";
                e.currentTarget.style.borderColor = "#1b8a5a";
              }}
            >
              Login
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
