import { lazy } from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import Loadable from '@/components/Loadable';
import ProtectedRoute from '@/components/ProtectedRoute';

import { ROLE } from '@/constants/roles';
import { ROUTE_PATH } from '@/constants/routes';

// Customers
const List = Loadable(lazy(() => import('@/views/Customers/ListCustomers')));
const Create = Loadable(lazy(() => import('@/views/Customers/FormDetail')));

const Customers: RouteObject = {
  path: ROUTE_PATH.CUSTOMERS_LIST,
  element: (
    <ProtectedRoute requiredRoles={[ROLE.ADMIN, ROLE.ACCOUNTANT, ROLE.SALES]}>
      <Outlet />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <List /> },
    { path: 'create', element: <Create /> },
    { path: 'update/:id', element: <Create /> },
  ],
};

export default Customers;
