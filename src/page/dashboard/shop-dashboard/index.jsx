import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  HistoryOutlined,
  HomeOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";
import { useAuthStore } from "../../../zustand/useAuthStore";

const { Header, Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/shop/${key}`}>{label}</Link>,
  };
}
const items = [
  getItem("Home", "", <HomeOutlined />),
  getItem("Post Manage", "post", <FileOutlined />),
  getItem("History Transaction", "historyTransaction", <HistoryOutlined />),
  getItem("Profile", "profile", <UserOutlined />),
];
const ShopDashboard = () => {
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
    <>
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
              width: "96%",
              marginLeft: "2%",
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
          <Footer />
        </Layout>
      </Layout>
    </>
  );
};
export default ShopDashboard;
