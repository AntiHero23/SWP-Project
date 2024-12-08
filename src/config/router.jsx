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
import ProtectedRoute from "../components/ProtectedRoute";
import AccountDetails from "../page/admin/account-detail";
import PondStandard from "../page/admin/pond-standard";
import WaterStandard from "../page/admin/water-standard";
import PondStandardDetails from "../page/admin/pond-standard-details";
import AboutUs from "../page/about-us";
import BlogPage from "../page/blog";
import TempStandard from "../page/admin/temp-standard";
import FeedingStandard from "../page/admin/feeding-standard";
import KoiStandard from "../page/admin/koi-standard";
import KoiStandardDetails from "../page/admin/koi-standard-details";
import FeedingStandardDetails from "../page/admin/feeding-standard-details";
import Blog from "../page/admin/blog";
import BlogDetails from "../page/admin/blog-details";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // Public routes
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Resgiter /> },
      { path: "/aboutUs", element: <AboutUs /> },
      { path: "/contact", element: <Contact /> },
      { path: "/blog", element: <BlogPage /> },
      { path: "/recommendation", element: <Recommendation /> },
      { path: "/productDetail/:id", element: <ProductDetail /> },
      // Member-only routes
      {
        path: "/myKoi",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <ManagerKoi />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER", "SHOP", "ADMIN"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/managerKoi",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <ManagerKoi />
          </ProtectedRoute>
        ),
      },
      {
        path: "/addKoi",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <AddingKoi />
          </ProtectedRoute>
        ),
      },
      {
        path: "/koiInfo/:id",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <KoiInfo />
          </ProtectedRoute>
        ),
      },
      {
        path: "/managerPond",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <ManagerPond />
          </ProtectedRoute>
        ),
      },
      {
        path: "/addPond",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <AddingPond />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pondInfo/:id",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <PondInfo />
          </ProtectedRoute>
        ),
      },
      // Basic member routes
      {
        path: "/buyPlan",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]} requirePremium={false}>
            <Plan />
          </ProtectedRoute>
        ),
      },
      {
        path: "/waterReportHistory/:pondId",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <WaterReportHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/statisticsKoi",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]} requirePremium={true}>
            <StatisticKoi />
          </ProtectedRoute>
        ),
      },
      {
        path: "/statisticsPond",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]} requirePremium={true}>
            <StatisticsPond />
          </ProtectedRoute>
        ),
      },
      // Premium member features
      {
        path: "/calculateFood",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]} requirePremium={true}>
            <CalculateFood />
          </ProtectedRoute>
        ),
      },
      {
        path: "/koiFoodList",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]} requirePremium={true}>
            <KoiFoodList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/calculateSalt",
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]} requirePremium={true}>
            <CalculateSalt />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
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
            path: "details",
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
        path: "userManage",
        children: [
          {
            path: "",
            element: <UserManage />,
          },
          {
            path: "details/:id",
            element: <AccountDetails />,
          },
        ],
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
      {
        path: "pondStandards",
        children: [
          {
            path: "",
            element: <PondStandard />,
          },
          {
            path: "details/:id",
            element: <PondStandardDetails />,
          },
        ],
      },
      {
        path: "waterStandards",
        element: <WaterStandard />,
      },
      {
        path: "koiStandards",
        children: [
          {
            path: "",
            element: <KoiStandard />,
          },
          {
            path: "details/:id",
            element: <KoiStandardDetails />,
          },
        ],
      },
      {
        path: "feedingCoefficient",
        children: [
          {
            path: "",
            element: <FeedingStandard />,
          },
          {
            path: "details/:id",
            element: <FeedingStandardDetails />,
          },
        ],
      },
      {
        path: "temperatureCoefficient",
        children: [
          {
            path: "",
            element: <TempStandard />,
          },
          {
            path: "details/:id",
            element: <PondStandardDetails />,
          },
        ],
      },
      {
        path: "blogs",
        children: [
          {
            path: "",
            element: <Blog />,
          },
          {
            path: "details/:id",
            element: <BlogDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "/shop",
    element: (
      <ProtectedRoute allowedRoles={["SHOP"]}>
        <ShopDashboard />
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute>
        <CheckOut />
      </ProtectedRoute>
    ),
  },
]);
