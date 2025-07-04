import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { ROUTE_PATH } from '@/constants/routes';

const PublicRoute = ({  }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={`/${ROUTE_PATH.MANAGE}`} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
