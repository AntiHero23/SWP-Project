import React from "react";
import "./index.scss";
import { Button, Form, Input } from "antd";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/counterSlice";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("login", values);
      const { token } = data;
      dispatch(login(data));
      localStorage.setItem("token", token);

      const roleRoutes = {
        ADMIN: "/admin",
        SHOP: "/shop",
        default: "/",
      };
      navigate(roleRoutes[data.role] || roleRoutes.default);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-form-container">
        <div className="loginForm-header">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="./src/assets/Icon.png"
              style={{ width: "50px" }}
              alt="Sunside Koi Care Logo"
              className="loginForm-logo"
            />
          </div>
          <h1 className="loginForm-title">Welcome to Sunside Koi Care</h1>
        </div>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
          {error && <div className="loginForm-error">{error}</div>}
        </Form>
        <div className="loginForm-register">
          <p>
            Don't have an account?{" "}
            <Button type="link" onClick={() => navigate("/register")}>
              Register now
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
