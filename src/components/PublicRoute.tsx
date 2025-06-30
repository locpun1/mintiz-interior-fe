import { Navigate } from 'react-router-dom';
import type { FCC } from '@/types/react';
import { useAppSelector } from '@/store';
import { ROUTE_PATH } from '@/constants/routes';

const PublicRoute: FCC = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATH.MANAGE} />;
  }

  return children;
};

export default PublicRoute;
