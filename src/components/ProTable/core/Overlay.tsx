import AutoSizer from 'react-virtualized-auto-sizer';

import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';

import type { FCC } from '@/types/react';

interface Props {
  above?: boolean;
  backdrop?: boolean;
}

const Overlay: FCC<Props> = (props) => {
  const { children, above = false, backdrop = false } = props;

  return (
    <Wrapper above={above}>
      {({ width, height }) => {
        return (
          <Box
            sx={{
              display: 'grid',
              placeContent: 'center',
              width: width - 20,
              height: height - 20,
              ...(backdrop && {
                bgcolor: alpha('rgba(255, 255, 255)', 0.38),
              }),
            }}
          >
            {children}
          </Box>
        );
      }}
    </Wrapper>
  );
};

const Wrapper = styled(AutoSizer, {
  shouldForwardProp: (prop: string) => !['above'].includes(prop),
})<Pick<Props, 'above'>>(({ theme, above }) => ({
  position: 'sticky',
  inset: 0,
  ...(above && {
    zIndex: theme.zIndex.appBar + 3,
  }),
}));

export default Overlay;
