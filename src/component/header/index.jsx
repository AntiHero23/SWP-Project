import "./index.scss";
import logo from "../../assets/icon.png";
import { IoIosNotifications } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu, Space } from "antd";
import { useEffect, useState } from "react";
// import { useAuthStore } from "../../zustand/useAuthStore";
// import api from "../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../redux/features/counterSlice";

function Header() {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const [avatar, setAvatar] = useState({});
  const user = useSelector(selectUser);
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

  const menuProps = {
    overlay: (
      <Menu>
        <Menu.Item onClick={() => navigate("/managerKoi")}>My Koi</Menu.Item>
        <Menu.Item onClick={() => navigate("/managerPond")}>My Pond</Menu.Item>
        <Menu.Item onClick={() => navigate("/calculateSalt")}>
          Calculate Salt
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/calculateFood")}>
          Calculate Food
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/statisticsKoi")}>
          Koi Statistics
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/statisticsPond")}>
          Pond Statistics
        </Menu.Item>
      </Menu>
    ),
    trigger: ["hover"],
    placement: "bottomRight",
  };

  const menuProps_user = {
    overlay: (
      <Menu>
        <Menu.Item onClick={() => navigate("/profile")}>Profile</Menu.Item>
        <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
      </Menu>
    ),
    trigger: ["click"],
    placement: "bottomRight",
  };

  return (
    <div className="header">
      <div className="header-left">
        <img
          src={logo}
          alt="logo"
          className="header-left-logo"
          onClick={() => navigate("/")}
        />
        <div className="header-left-title" onClick={() => navigate("/")}>
          SunSide Koi Care
        </div>
      </div>

      <ul className="header-center">
        <li onClick={() => navigate("/")}>Home</li>
        <li className="dropdown">
          <Dropdown {...menuProps}>
            <a className="dropdown-link" onClick={(e) => e.preventDefault()}>
              Features
            </a>
          </Dropdown>
        </li>
        <li onClick={() => navigate("/recommendation")}>Shopping</li>
        <li onClick={() => navigate("/aboutUs")}>About Us</li>
        <li onClick={() => navigate("/contact")}>Contact Us</li>
        <li onClick={() => navigate("/blog")}>Blog</li>
      </ul>

      <div className="header-right">
        {/* <IoIosNotifications className="header-right-notification-icon" /> */}
        <>
          {avatar?.name ? (
            <div className="dropdown" color="">
              <Dropdown {...menuProps_user}>
                <a className="dropdown-link">{avatar?.name}</a>
              </Dropdown>
            </div>
          ) : (
            <MdAccountCircle
              className="header-right-account-icon"
              onClick={() => navigate("/login")}
            />
          )}
        </>
      </div>
    </div>
  );
}

export default Header;
