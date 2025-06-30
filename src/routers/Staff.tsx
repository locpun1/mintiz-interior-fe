import Loadable from "@/components/Loadable";
import { ROUTE_PATH } from "@/constants/routes";
import { lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";

const StaffHome = Loadable(lazy(() => import('@/views/Staff/Home/index')));

const Staff: RouteObject = {
    path:ROUTE_PATH.STAFF,
    element:<Outlet/>,
    children: [
        { path: ROUTE_PATH.STAFF_HOME, element:<StaffHome />},
    ]
}

export default Staff;
