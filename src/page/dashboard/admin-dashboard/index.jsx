import React, { useEffect, useState } from "react";
import {
  CalculatorOutlined,
  ControlOutlined,
  DesktopOutlined,
  ExperimentOutlined,
  FileOutlined,
  FolderOutlined,
  FormOutlined,
  HomeOutlined,
  PieChartOutlined,
  RadarChartOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../zustand/useAuthStore";
import { logout, selectUser } from "../../../redux/features/counterSlice";
import { useDispatch, useSelector } from "react-redux";
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
  getItem("Pond Standards", "pondStandards", <RadarChartOutlined />),
  getItem("Water Standards", "waterStandards", <ExperimentOutlined />),
  getItem("Koi Standards", "koiStandards", <StarOutlined />),
  getItem("Feeding Coefficient", "feedingCoefficient", <CalculatorOutlined />),
  getItem(
    "Temperature Coefficient",
    "temperatureCoefficient",
    <ControlOutlined />
  ),
  getItem("Blogs", "blogs", <FormOutlined />),
];
const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [avatar, setAvatar] = useState({});
  const user = useSelector(selectUser);

  const dispath = useDispatch();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleLogout = () => {
    dispath(logout());
    localStorage.removeItem("token");
    setAvatar({});
    navigate("/");
  };
  function getAvatar() {
    setAvatar(user);
  }
  useEffect(() => {
    getAvatar();
  }, [user]);
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        style={{ textAlign: "center" }}
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
          style={{ width: "90%" }}
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
