import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import { GroupPermission } from '@/types/permission';
import { useAppSelector } from '@/store';
import { ROLE } from '@/constants/roles';
import { getRoleGroupToUser } from '@/services/permission-service';

const DashboardLayout = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const { profile } = useAppSelector((state) => state.auth);
  const [menuData, setMenuData] = useState<GroupPermission | null>(null);

  useEffect(() => {
    if(profile && profile.role === ROLE.EMPLOYEE){
        const getRoleGroupAssignedUser = async(id: string | number) => {
          const res = await getRoleGroupToUser(id);
          const data = res.data as any as GroupPermission;
          const menuCodes = data?.permission.map(el => el.code);
          localStorage.setItem('menuCodes', JSON.stringify(menuCodes));
          setMenuData(data)
        }
        getRoleGroupAssignedUser(profile.id)
    }
  },[profile])


  

  const handleToggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        collapsed={collapsed}
        openSidebar={openSidebar}
        onCloseSidebar={handleToggleSidebar}
        onToggleCollapsed={handleToggleCollapsed}
        menuData={menuData ? menuData :  null}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100svh',
          paddingTop: '64px',
          overflow: 'hidden',
        }}
      >
        <Header
          collapsed={collapsed}
          onToggleSidebar={handleToggleSidebar}
          onToggleCollapsed={handleToggleCollapsed}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
