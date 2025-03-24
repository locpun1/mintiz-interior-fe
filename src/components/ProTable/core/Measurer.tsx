import useMeasure from '@/hooks/useMeasure';
import type { RefObject } from 'react';
import type { FCC } from '@/types/react';
import Box from '@mui/material/Box';

interface Props {
  element: RefObject<HTMLDivElement>;
}

const Measurer: FCC<Props> = (props) => {
  const { element, children } = props;
  const { width } = useMeasure(element);

  if (width === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 2,
        position: 'sticky',
        left: 0,
        maxWidth: width,
        borderLeft: 3,
        borderColor: 'primary.main',
      }}
    >
      {children}
    </Box>
  );
};

export default Measurer;
