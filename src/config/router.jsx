import React from "react";
import { Navigate, Outlet, createBrowserRouter, Route } from "react-router-dom";
// import Test from "../component/Test";
import Zustand from "../Zustand";
import UseReactQuerry from "../component/UseReactQuerry";
import Layout from "../component/layout";
import Home from "../page/home";
import Login from "../page/login";
import Resgiter from "../page/register";
import ManagerKoi from "../page/koifish/manager-koi";
// import Dashboard from "../page/dashboard/Dashboard";
import { selectUser } from "../redux/features/counterSlice";
import { useSelector } from "react-redux";
import AdminDashboard from "../page/dashboard/admin-dashboard";
import ShopDashboard from "../page/dashboard/shop-dashboard";
import AddingKoi from "../page/koifish/adding-koi";
import ManagerPond from "../page/pond/manager-pond";
import AddingPond from "../page/pond/adding-pond";
import PondInfo from "../page/pond/pond-info";
import Profile from "../page/profile";
import CalculateFood from "../page/calculate/calculateFood";
import CalculateSalt from "../page/calculate/calculateSalt";
import Recommendation from "../page/recommendation";
import Plan from "../page/plan";
import KoiInfo from "../page/koifish/koi-info";
import Contact from "../page/Contact";
import KoiFoodList from "../page/koifish/koifood-list";
import RejectPage from "../page/admin/reject-page";
import PostManage from "../page/admin/post-manage";
import UserManage from "../page/admin/user-manage";
import PostView from "../page/shop/post-view";
import ShopProfile from "../page/shop/profile-page";
import ShopHome from "../page/shop/shop-home";
import HistoryTransaction from "../page/shop/history-transaction";
import CheckOut from "../page/shop/check-out";
import PostDetail from "../page/shop/post-detail";
import WaterReportHistory from "../page/pond/waterreport-history";
import StatisticKoi from "../page/statistic-koi";
import AdminHome from "../page/admin/admin_home";
import PendingPostDetail from "../page/admin/pending-post-detail";
import ApprovedPostDetail from "../page/admin/approved-post-detail";
import Package from "../page/admin/package-manage";
import ShopPackage from "../page/admin/shop-package";
import MemberPackage from "../page/admin/user-package";
import ProductDetail from "../page/product-detail";
import StatisticsPond from "../page/statistic-pond";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/Home", element: <Home /> },
      { path: "/Login", element: <Login /> },
      { path: "/Register", element: <Resgiter /> },
      { path: "/MyKoi", element: <ManagerKoi /> },
      { path: "/", element: <Home /> },
      { path: "/profile", element: <Profile /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Resgiter /> },
      { path: "/managerKoi", element: <ManagerKoi /> },
      { path: "/addKoi", element: <AddingKoi /> },
      { path: "/koiInfo/:id", element: <KoiInfo /> },
      { path: "/managerPond", element: <ManagerPond /> },
      { path: "/addPond", element: <AddingPond /> },
      { path: "/pondInfo/:id", element: <PondInfo /> },
      { path: "/calculateFood", element: <CalculateFood /> },
      { path: "/calculateSalt", element: <CalculateSalt /> },
      { path: "/recommendation", element: <Recommendation /> },
      { path: "/buyPlan", element: <Plan /> },
      { path: "/contact", element: <Contact /> },
      { path: "/koiFoodList", element: <KoiFoodList /> },
      { path: "/waterReportHistory/:id", element: <WaterReportHistory /> },
      { path: "/statisticsKoi", element: <StatisticKoi /> },
      { path: "/statisticsPond", element: <StatisticsPond /> },
      { path: "/productDetail/:id", element: <ProductDetail /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      {
        path: "",
        element: <AdminHome />,
      },
      {
        path: "post",
        children: [
          {
            path: "reject",
            element: <RejectPage />,
          },
          {
            path: "",
            element: <PostManage />,
          },
          {
            path: "detail",
            children: [
              {
                path: "pending/:id",
                element: <PendingPostDetail />,
              },
              {
                path: "approved/:id",
                element: <ApprovedPostDetail />,
              },
            ],
          },
        ],
      },
      {
        path: "userManager",
        element: <UserManage />,
      },
      {
        path: "package",
        children: [
          {
            path: "",
            element: <Package />,
          },
          {
            path: "shop/:id",
            element: <ShopPackage />,
          },
          {
            path: "member/:id",
            element: <MemberPackage />,
          },
        ],
      },
    ],
  },
  {
    path: "/shop",
    element: <ShopDashboard />,
    children: [
      {
        path: "",
        element: <ShopHome />,
      },

      {
        path: "post",
        children: [
          {
            path: "",
            element: <PostView />,
          },
          {
            path: "detail/:id",
            element: <PostDetail />,
          },
        ],
      },
      {
        path: "historyTransaction",
        element: <HistoryTransaction />,
      },
      {
        path: "profile",
        element: <ShopProfile />,
      },
    ],
  },
  {
    path: "/checkout",
    element: <CheckOut />,
  },
]);
