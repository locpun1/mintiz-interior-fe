import { ReactNode } from 'react';

import { Divider } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';

import type { FCC } from '@/types/react';

interface ProFormHeaderProps extends BoxProps {
  children: ReactNode;
  typographyProps?: TypographyProps;
}

const ProFormHeader: FCC<ProFormHeaderProps> = (props) => {
  const { children, typographyProps, ...rest } = props;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }} {...rest}>
      <Typography variant='h5' sx={{ fontWeight: 'medium' }} {...typographyProps}>
        {children}
      </Typography>
      <Divider />
    </Box>
  );
};

export default ProFormHeader;
