import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  FolderOutlined,
  HomeOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../zustand/useAuthStore";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/admin/${key}`}>{label}</Link>,
  };
}
const items = [
  getItem("Home", "", <HomeOutlined />),
  getItem("Post Manage", "post", <FileOutlined />),
  getItem("Users Manage", "userManage", <TeamOutlined />),
  getItem("Packages", "package", <FolderOutlined />),
];
const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
        <Button
          type="primary"
          danger
          style={{
            width: "90%",
            marginLeft: "3%",
          }}
          className="profile-button profile-button-logout"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Sider>
      <Layout>
        {/* <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        /> */}
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          {/* <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>Manage</Breadcrumb.Item>
            <Breadcrumb.Item>Post</Breadcrumb.Item>
          </Breadcrumb> */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Sunside Koi Care ©{new Date().getFullYear()} Created by G7 SE1863
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AdminDashboard;
