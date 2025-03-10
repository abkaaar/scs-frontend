import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#028f64", color: "#fff", textAlign: "center" }}>
        Student Clearance System
      </Header>
      <Content style={{ padding: "20px" }}>
        <Outlet /> {/* This is like Next.js children */}
      </Content>
      <Footer style={{ textAlign: "center" }}>© {new Date().getFullYear()} Student Clearance System</Footer>
    </Layout>
  );
};

export default MainLayout;
