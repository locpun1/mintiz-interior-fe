import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import homeImage from "@/assets/images/users/Background-xam-1.jpg";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContactConsultativeInfo from './components/ContactConsultativeInfo';
import ImageCarousel, { SrcSetWidth } from './components/ImageCarousel';
import image_slide from '@/assets/images/users/12.png';

const Home = () => {
  const fixedImages: SrcSetWidth[] = [
    {id: 1, name: 'image_slide', url: `${image_slide}`, srcSet1200: `${image_slide}`, srcSet768: `${image_slide}` },

  ]
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'black',
          position:'relative',
          height: {xs: 450, md: 500}, // Chiều cao thu gọn lại
          width: '100%',
          // backgroundImage: `url(${homeImage})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(88, 87, 87, 0.5)',
            zIndex: 1,
          }}
        >
          <Box 
            sx={{ 
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography sx={{ fontSize: { xs: '1.5rem', md: '2.5rem'}}} fontWeight={700} mb={1}>
              Chào mừng bạn đến với
            </Typography>
            <Typography sx={{ fontSize: { xs: '2rem', md: '4rem'}}} fontWeight={600} mb={3}>
              MINTZ FUNI
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/about-us')}
              sx={{
                color: 'white',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  color: 'black'
                },
              }}
            >
              Tìm hiểu ngay
            </Button>
          </Box>
          

        </Box>
      </Box>
      <Box
        sx={{ backgroundColor: '#06372D', p: 5}}
      >
        <ContactConsultativeInfo/>
      </Box>
      <ImageCarousel fixedImages={fixedImages}/>
    </Box>
  );
};

export default Home;
