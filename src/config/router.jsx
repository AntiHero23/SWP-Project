import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
// import Test from "../component/Test";
import Zustand from "../Zustand";
import UseReactQuerry from "../component/UseReactQuerry";
import Layout from "../component/layout";
import Home from "../page/home";
import Login from "../page/login";
import Resgiter from "../page/register";
import ManagerKoi from "../page/koifish/manager-koi";
// import Dashboard from "../page/dashboard/Dashboard";
import Manage from "../page/admin/Manage";
import { selectUser } from "../redux/features/counterSlice";
import { useSelector } from "react-redux";
import AdminDashboard from "../page/dashboard/AdminDashboard";
import ShopDashboard from "../page/dashboard/ShopDashboard";
import PostPackage from "../page/shop/PostPackage";

// const ProtectedRouteAuth = ({ children }) => {
//   const user = useSelector(selectUser);
//   if (!user) {
//     alertFail("You need to login first!!");
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// const ProtectedRouteCreator = ({ children }) => {
//   const user = useSelector(selectUser);
//   console.log(user);
//   if (user?.role === "AUDIENCE") {
//     alertFail("You do not have permissions to access");
//     return <Navigate to="/go-pro" replace />;
//   }
//   return children;
// };

// const ProtectedADMIN = ({ children }) => {
//   const user = useSelector(selectUser);
//   console.log(user);
//   if (user?.role !== "ADMIN") {
//     alert("You do not have permissions to access");
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/Home", element: <Home /> },
      { path: "/Login", element: <Login /> },
      { path: "/Register", element: <Resgiter /> },
      { path: "/MyKoi", element: <ManagerKoi /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      {
        path: "postManager",
        element: <Manage />,
      },
      {
        path: "koi",
        element: <h1>Koi</h1>,
      },
    ],
  },
  {
    path: "/shop",
    element: <ShopDashboard />,
    children: [
      {
        path: "postManager",
        element: <PostPackage />,
      },
    ],
  },
]);
