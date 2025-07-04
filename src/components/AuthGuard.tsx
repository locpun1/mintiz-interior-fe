// src/components/AuthGuard.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';
import LoadingScreen from '@/components/LoadingScreen';
import { ROUTE_PATH } from '@/constants/routes';

const AuthGuard = () => {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.LOGIN}`} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;