import Loadable from '@/components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

// Customers
const ChangePassword = Loadable(lazy(() => import('@/views/Auth/ChangePassword')));
const Login = Loadable(lazy(() => import('@/views/Auth/Login')));
const ForgotPassword = Loadable(lazy(() => import('@/views/Auth/ForgotPassword')));
const Registration = Loadable(lazy(() => import('@/views/Auth/Registration')));

const AuthRoute: RouteObject = {
  path: 'auth',
  element: <Outlet />,
  children: [
    { index: true, element: <Navigate to={'login'} replace /> },
    { path: 'login', element: <Login /> },
    { path: 'registration', element: <Registration /> },
    { path: 'forgot-password', element: <ForgotPassword /> },
    { path: 'change-password', element: <ChangePassword /> },
  ],
};

export default AuthRoute;
