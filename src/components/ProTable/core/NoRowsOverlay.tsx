import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Overlay from './Overlay';

interface Props {
  visible?: boolean;
}

const NoRowsOverlay = (props: Props) => {
  const { visible } = props;

  if (!visible) {
    return null;
  }

  return (
    <Overlay>
      <Box
        sx={{
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <HorizontalSplitIcon
          fontSize="large"
          sx={{ color: 'text.secondary' }}
        />
        <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
          Không có dữ liệu
        </Typography>
      </Box>
    </Overlay>
  );
};

export default NoRowsOverlay;
