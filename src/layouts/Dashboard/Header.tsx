import { MINI_SIDEBAR_WIDTH, SIDEBAR_WIDTH } from '@/constants/layouts';
import { Box, MenuItem, Select, Typography, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { CSSObject, Theme, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import mintz_logo from "@/assets/images/users/mintzdg-logo.png";
import CommonImage from '@/components/Image/index';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DensityMedium } from '@mui/icons-material';
import CollapsedSideBar from '../LandingPage/CollapsedSideBar';


interface Props {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapsed: () => void;
}

const Header = (props: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const isActive = (path: string) => location.pathname === path;

  const [activeMenu, setActiveMenu] = useState<string>('home')

  const handleMenuClick = (key: string, path: string) => {
    setActiveMenu(key);
    navigate(path)
  }

  const styleMenu = (path: string) => ({
    fontWeight: 500,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    pb: 1,
    mt: 1,
    borderBottom: isActive(path)? '2px solid black' : '2px solid transparent',
    transition: 'border-bottom 0.3s',
    '&:hover':{
      borderBottom: '2px solid black',
    },
  });

  if(mdUp){
    return(
      <AppBar
            position='fixed'
            sx={{
              color: 'common.black',
              backgroundColor: '#fff',
              height: '64px',
              borderBottom: 'thin solid #E6E8F0',
              marginLeft: 'auto',
              zIndex: 9,
              width: '100%',
            }}
          >
            <Toolbar 
              disableGutters 
              sx={{ 
                display: 'flex', justifyContent: 'center', alignItems: 'center', height: 64, px: 6, // padding ngang để giới hạn chiều rộng
              }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 15, }}>
                <Typography sx={styleMenu('/home')} onClick={() =>  handleMenuClick('home','/home')}>Trang chủ</Typography>
                <Typography sx={styleMenu('/about-us')} onClick={() =>  handleMenuClick('about-us','/about-us')}>About us</Typography>

                <CommonImage
                  src={mintz_logo}
                  alt="mintz logo"
                  sx={{ width: 100, height:100 }}
                  />

                <Typography sx={styleMenu('/news')} onClick={() =>  handleMenuClick('news','/news')}>Tin tức</Typography>
                <Select
                  defaultValue="vi"
                  variant="standard"
                  disableUnderline
                  sx={{
                    fontWeight: 800,
                    cursor: 'pointer',
                    '& .MuiSelect-select': { padding: 0 },
                  }}
                >
                  <MenuItem value="vi">Ngôn ngữ</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </Box>
            </Toolbar>
          </AppBar>
    )
  }

  return (
    <AppBar
      position='fixed'
      sx={{
        color: 'common.black',
        backgroundColor: '#fff',
        height: '64px',
        borderBottom: 'thin solid #E6E8F0',
        marginLeft: 'auto',
        zIndex: 9,
        width: '100%',
        display:'flex',
        flexDirection:'row'
      }}
    >
      <IconButton
        onClick={handleToggleCollapsed}
        sx={{
          color: '#000',
          borderRadius: '4px',
          width: '36px',
          height: '36px',
          fontSize: '1rem',
          margin: 'auto 0px',
          // backgroundColor: '#f0f0f0',
        }}
      >
        <DensityMedium />
      </IconButton>
      <Toolbar 
        disableGutters 
        sx={{ 
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: 64, px: 6, // padding ngang để giới hạn chiều rộng
          margin: 'auto'
        }}>
        
          <CommonImage
            src={mintz_logo}
            alt="mintz logo"
            sx={{ width: 100, height:100 }}
          />
      </Toolbar>
      <CollapsedSideBar
        collapsed={collapsed}
        onToggleCollapsed={handleToggleCollapsed}
      />
    </AppBar>
  );
};

export default Header;
