import { useTranslation } from 'react-i18next';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinkButton from '@/components/LinkButton';
import Page from '@/components/Page';

const PermissionDenied = () => {
  const { t } = useTranslation('common');

  return (
    <Page title='Permission Denied'>
      <Container
        sx={{
          display: 'grid',
          placeContent: 'center',
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AdminPanelSettingsIcon fontSize='large' color='error' />
          <Typography
            variant='h5'
            gutterBottom
            sx={{ mt: 1.5, fontWeight: 'medium' }}
            color='error'
          >
            {t('permission_denied')}
          </Typography>
          <Typography variant='subtitle2'>
            {t('have_not_permission')}
          </Typography>
          <LinkButton
            to='/'
            variant='contained'
            startIcon={<ArrowBackIcon />}
            color='error'
            sx={{ mt: 4 }}
          >
            {t('back_to_home')}
          </LinkButton>
        </Box>
      </Container>
    </Page>
  );
};

export default PermissionDenied;
