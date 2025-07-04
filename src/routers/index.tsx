// src/routes/routes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, useRoutes } from 'react-router-dom';

import AuthGuard from '@/components/AuthGuard';
import PublicRoute from '@/components/PublicRoute';
import DashboardLayout from '@/layouts/Dashboard';
import AuthLayout from '@/layouts/Auth/AuthLayout';
import LandingPageLayout from '@/layouts/LandingPage';
import ChangePassword from '@/views/Auth/ChangePassword';
import Loadable from '@/components/Loadable';

import managerRoutes from './Manager';

const Login = Loadable(lazy(() => import('@/views/Auth/Login')));
const Home = Loadable(lazy(() => import('@/views/LandingPage/Home/index')));
const AboutUs = Loadable(lazy(() => import('@/views/LandingPage/AboutUs/index')));
const NotFound = Loadable(lazy(() => import('@/views/Errors/NotFound')));
const PermissionDenied = Loadable(lazy(() => import('@/views/Errors/PermissionDenied')));

// ManagementHome
const HomeManager = Loadable(lazy(() => import('@/views/Manager/Home/index')));
const ManagementAccount = Loadable(lazy(() => import('@/views/Manager/Account/index')));
const ManagementCustomersInformation = Loadable(lazy(() => import('@/views/Manager/AccountCus/index')));
const Profile = Loadable(lazy(() => import('@/views/Manager/Profile/index')));



const routes: RouteObject[] = [
  // --- NHÁNH 1: CÁC TRANG ĐƯỢC BẢO VỆ (PRIVATE) ---
  {
    path: '/manage',
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: managerRoutes,
      }

    ],
  },
  
  // --- NHÁNH 2: CÁC TRANG CÔNG KHAI (PUBLIC) ---
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          { path: 'login', element: <Login /> },
          { path: 'change-password', element: <ChangePassword /> },
        ],
      },
      {
        element: <LandingPageLayout />,
        children: [
          { path: 'home', element: <Home /> },
          { path: 'about-us', element: <AboutUs /> },
          // Nếu người dùng vào '/', mặc định hiển thị trang home
          { index: true, element: <Navigate to="/home" replace /> },
        ],
      },
    ],
  },

  // --- NHÁNH 3: CÁC TRANG LỖI (Nằm ngoài các layout chính) ---
  {
    path: '/403',
    element: <PermissionDenied />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const Routers = () => {
  const element = useRoutes(routes);
  return element;
};

export default Routers;