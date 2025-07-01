// Pages
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';


import Loadable from '@/components/Loadable';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';

import AuthLayout from '@/layouts/Auth/AuthLayout';
import DashboardLayout from '@/layouts/Dashboard';
import Login from '@/views/Auth/Login';
import LandingPageLayout from '@/layouts/LandingPage';
import Manager from './Manager';

// Home, AboutUs, News, Languages
const Home = Loadable(lazy(() => import('@/views/LandingPage/Home/index')));
const AboutUs = Loadable(lazy(() => import('@/views/LandingPage/AboutUs/index')));
const News = Loadable(lazy(() => import('@/views/LandingPage/News/index')));
const Languages = Loadable(lazy(() => import('@/views/LandingPage/Languages/index')));

// Error
const NotFound = Loadable(lazy(() => import('@/views/Errors/NotFound')));
const PermissionDenied = Loadable(lazy(() => import('@/views/Errors/PermissionDenied')));

// ManagementHome
const HomeManager = Loadable(lazy(() => import('@/views/Manager/Home/index')));


const routes: RouteObject[] = [
  {
    path: '/manager',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomeManager /> }, 
      Manager,
    ],
  },
  {
    path: 'auth',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { index: true, element: <Navigate to={'login'} replace /> },
      { path: 'login', element: <Login /> },
    ],
  },
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      { index: true, element: <Navigate to={'home'} replace /> },
      { path: 'home', element: <Home /> },
      { path: 'about-us', element: <AboutUs /> },
      { path: 'news', element: <News /> },
      { path: 'languages', element: <Languages /> },
    ],
  },
  {
    path: '*',
    element: <Outlet />,
    children: [
      { index: true, element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/403',
    element: <PermissionDenied />,
  },
];

const Routers = () => {
  const element = useRoutes(routes);
  return element;
};

export default Routers;
