import { useContext } from 'react';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CollapseContext } from '.';

const Logo = () => {
  const collapsed = useContext(CollapseContext);

  if (collapsed) {
    return (
      <Box sx={{ paddingX: '17px', paddingY: '20px' }}>
        <Typography sx={{ whiteSpace: 'nowrap' }}>TS</Typography>
      </Box>
    );
  }

  return (
    <Toolbar sx={{ whiteSpace: 'nowrap' }}>
      <Typography>Hello World</Typography>
    </Toolbar>
  );
};

export default Logo;
