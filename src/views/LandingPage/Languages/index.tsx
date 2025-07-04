import PageWrapper from '@/components/PageWrapper';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import comingSoon from '/imgs/coming_soon.jpg';

const Languages = () => {
  const { t } = useTranslation();
  return (
    <PageWrapper title="Mintz Funi">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={comingSoon}
          alt='logo'
          width={400}
          height={400}
          style={{ objectFit: 'contain' }}
        />
      </Box>
      <Typography>fdsfdsfdsfd</Typography>
    </PageWrapper>
  );
};

export default Languages;
