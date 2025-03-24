import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Image from '@/components/Image';
import LinkButton from '@/components/LinkButton';
import Page from '@/components/Page';

const NotFound = () => {
  return (
    <Page title='Page not found'>
      <Container
        sx={{
          display: 'grid',
          placeContent: 'center',
          flexGrow: 1,
          height: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image sx={{ width: '400px' }} src='/static/imgs/404.svg' alt='Not found' />
          <LinkButton
            to='/'
            variant='contained'
            startIcon={<ArrowBackIcon />}
            color='error'
            sx={{ mt: 2 }}
          >
            Back to Home
          </LinkButton>
        </Box>
      </Container>
    </Page>
  );
};

export default NotFound;
