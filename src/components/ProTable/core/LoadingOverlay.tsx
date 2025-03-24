import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Overlay from './Overlay';

interface Props {
  visible?: boolean;
}

const LoadingOverlay = (props: Props) => {
  const { visible } = props;

  if (!visible) {
    return null;
  }

  return (
    <Overlay above backdrop>
      <Box
        sx={{
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    </Overlay>
  );
};

export default LoadingOverlay;
