import { MINI_SIDEBAR_WIDTH, SIDEBAR_WIDTH } from '@/constants/layouts';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Typography, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { CSSObject, Theme, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Profile from './Sidebar/Profile';
import usePageTitle from '@/hooks/usePageTitle';

interface Props {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapsed: () => void;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: `calc(100% - ${MINI_SIDEBAR_WIDTH}px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
});

const Header = (props: Props) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const pageTitle = usePageTitle();

  return (
    <AppBar
      position='fixed'
      elevation={10}
      sx={{
        color: 'common.black',
        backgroundColor: '#fff',
        height: '64px',
        borderBottom: 'thin solid #E6E8F0',
        marginLeft: 'auto',
        zIndex: 9,
        width: lgUp
          ? props.collapsed
            ? openedMixin(theme).width
            : closedMixin(theme).width
          : '100%',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{display:'flex'}}>
          <IconButton
            onClick={props.onToggleCollapsed}
            edge='start'
            sx={{
              color: '#000',
              borderRadius: '4px',
              width: '36px',
              height: '36px',
              fontSize: '1rem',
              backgroundColor: '#f0f0f0',
            }}
          >
            {props.collapsed ? <MenuIcon /> : <MenuIcon />}
          </IconButton>
          <Typography noWrap sx={{fontSize:'24px',fontWeight:'700'}}>
            {pageTitle}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* <SelectLanguage /> */}
          <Profile />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;