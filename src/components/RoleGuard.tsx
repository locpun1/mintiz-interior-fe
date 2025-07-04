// src/components/RoleGuard.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { ROUTE_PATH } from '@/constants/routes';

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

const RoleGuard = ({ children, requiredRoles, requiredPermissions }: RoleGuardProps) => {
  const { profile } = useAppSelector((state) => state.auth);
  
  // Nếu không có profile, không thể kiểm tra quyền -> từ chối
  if (!profile) {
      return <Navigate to={ROUTE_PATH.PERMISSION_DENIED} replace />;
  }
  
  const { role, permissions } = profile;

  // Kiểm tra vai trò
  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return <Navigate to={ROUTE_PATH.PERMISSION_DENIED} replace />;
  }

  // Kiểm tra quyền hạn
  if (requiredPermissions && permissions && requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some((p) => permissions.includes(p));
    if (!hasPermission) {
      return <Navigate to={ROUTE_PATH.PERMISSION_DENIED} replace />;
    }
  }

  // Nếu vượt qua tất cả các kiểm tra, render component con
  return <>{children}</>;
};

export default RoleGuard;