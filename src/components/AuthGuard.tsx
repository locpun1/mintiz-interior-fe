// src/components/AuthGuard.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';
import LoadingScreen from '@/components/LoadingScreen';
import { ROUTE_PATH } from '@/constants/routes';
import { ROLE } from '@/constants/roles';

const AuthGuard = () => {
  const { isAuthenticated, isInitialized, profile } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const permission = profile?.permission;

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.LOGIN}`} state={{ from: location }} replace />;
  }
  // if(!permission && profile?.role !== ROLE.ADMIN){
  //   return <Navigate to={ROUTE_PATH.PERMISSION_DENIED} replace/>
  // }

  return <Outlet />;
};

export default AuthGuard;