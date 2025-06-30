import Box from '@mui/material/Box';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

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
