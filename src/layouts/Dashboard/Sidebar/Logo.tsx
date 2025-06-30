// src/layouts/Dashboard/Sidebar/Logo.tsx
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { CollapseContext } from '.';
import { ROUTE_PATH } from '@/constants/routes';
import { Typography } from '@mui/material';

const Logo = () => {
  const collapsed = useContext(CollapseContext);

  if (collapsed) {
    return (
      <Box
        component={RouterLink}
        to={ROUTE_PATH.HOME}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          px: 1,
          padding: '5px 0'
        }}
      >
        <Box
          component="img"
          src="/imgs/logo.png"
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
          }}
          alt="Mintz Fun"
        />
      </Box>
    );
  }

  return (
    <Toolbar
      component={RouterLink}
      to={ROUTE_PATH.HOME}
      sx={{
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        padding: '5px 0'
      }}
    >
      <Box
        component="img"
        src="/imgs/logo.png"
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
        }}
        alt="Mintz Fun"
      />
      <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
        MINTZ FUNI
      </Typography>
    </Toolbar>
  );
};

export default Logo;