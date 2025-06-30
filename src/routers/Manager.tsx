import Loadable from "@/components/Loadable";
import { ROUTE_PATH } from "@/constants/routes";
import { lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";

const ManagementHome = Loadable(lazy(() => import('@/views/Manager/Home/index')));
const ManagementAccount = Loadable(lazy(() => import('@/views/Manager/Account/index')));
const ManagementBlog = Loadable(lazy(() => import('@/views/Manager/Blog/index')));



const Manager: RouteObject = {
    path:ROUTE_PATH.MANAGE,
    element:<Outlet/>,
    children: [
        { index: true, element:<ManagementHome />},
        { path: ROUTE_PATH.MANAGE_ACCOUNT, element:<ManagementAccount/>},
        { path: ROUTE_PATH.MANAGE_BLOG, element:<ManagementBlog/>}
    ]
}

export default Manager;
