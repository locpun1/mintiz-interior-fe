import PageWrapper from '@/components/PageWrapper';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import comingSoon from '/imgs/coming_soon.jpg';

const Home = () => {
  const { t } = useTranslation();
  return (
    <PageWrapper title={t('home')}>
      <Box></Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={comingSoon}
          alt='logo'
          width={400}
          height={400}
          style={{ objectFit: 'contain' }}
        />
      </Box>
    </PageWrapper>
  );
};

export default Home;
