import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

export interface LoadingProps {
  small?: boolean;
}

const LoadingScreen = (props: LoadingProps) => {
  const { t } = useTranslation('common');
  const { small } = props;
  return (
    <Box
      sx={{
        display: 'grid',
        placeContent: 'center',
        gridRowStart: 2,
        height: 1,
      }}
    >
      <Box>
        <Typography gutterBottom variant='subtitle2' align='center'>
          {t('loading')}
        </Typography>
        <Box
          sx={{
            width: small ? 250 : { xs: 250, sm: 400 },
          }}
        >
          <LinearProgress />
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
