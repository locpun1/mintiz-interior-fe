import Box from '@mui/material/Box';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Dashboard/Header';
import Footer from '../Dashboard/Footer';

const LandingPageLayout = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100svh',
          overflow: 'hidden',
          paddingTop: '64px',
        }}
    >
        <Header
          collapsed={collapsed}
          onToggleSidebar={handleToggleSidebar}
          onToggleCollapsed={handleToggleCollapsed}
        />
        <Box
          sx={{
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
            }, 
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
    </Box>
  );
};

export default LandingPageLayout;
