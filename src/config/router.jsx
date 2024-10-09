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
import Manage from "../page/admin/Manage";
import { selectUser } from "../redux/features/counterSlice";
import { useSelector } from "react-redux";
import AdminDashboard from "../page/dashboard/AdminDashboard";
import ShopDashboard from "../page/dashboard/ShopDashboard";
import PostPackage from "../page/shop/PostPackage";
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
