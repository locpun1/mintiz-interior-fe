import Loadable from "@/components/Loadable";
import { ROUTE_PATH } from "@/constants/routes";
import { lazy } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";

const ManagementHome = Loadable(lazy(() => import('@/views/Manager/Home/index')));
const ManagementAccount = Loadable(lazy(() => import('@/views/Manager/Account/index')));
const ManagementBlog = Loadable(lazy(() => import('@/views/Manager/Blog/index')));
const CreatePost = Loadable(lazy(() => import('@/views/Manager/Blog/CreatePost')));

const ManagementCustomersInformation = Loadable(lazy(() => import('@/views/Manager/AccountCus/index')));
const Profile = Loadable(lazy(() => import('@/views/Manager/Profile/index')));
const PortfolioServiceBuild = Loadable(lazy(() =>  import('@/views/Manager/PortfolioAndServiceAndBuild/index')))

const managerRoutes: RouteObject[] = [
  { index: true, element: <Navigate to={ROUTE_PATH.MANAGE_HOME} replace /> },
  { path: ROUTE_PATH.MANAGE_HOME, element: <ManagementHome /> },
  { path: ROUTE_PATH.MANAGE_ACCOUNT, element: <ManagementAccount /> },
  {
    path: ROUTE_PATH.MANAGE_BLOG, 
    element: <Outlet />,
    children: [
      { index: true, element: <ManagementBlog /> },
      { path: ROUTE_PATH.BLOG_CREATE, element: <CreatePost /> },
    ],
  },
  { path: ROUTE_PATH.MY_PROFILE, element: <ManagementCustomersInformation/>},
  { path: ROUTE_PATH.TO_PROFILE, element: <Profile/>},
  { path: ROUTE_PATH.MANAGE_SETTINGS, element: <PortfolioServiceBuild/>},

];

export default managerRoutes;
