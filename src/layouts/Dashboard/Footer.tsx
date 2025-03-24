import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { __VERSION__ } from '@/config';
import logo from '/imgs/logo.jpg';

const Footer = () => {
  return (
    <FooterRoot>
      <img src={logo} alt='logo' width={30} height={30} />
      <Typography variant='caption' sx={{ fontWeight: 500 }}>
        HOP v{__VERSION__}.
      </Typography>
    </FooterRoot>
  );
};

const FooterRoot = styled('footer')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
}));

export default Footer;
