import { Box, Stack, Typography } from '@mui/material';
import VisionIntroduction from './components/VisionIntroduction';
import ImageCarousel, { SrcSetWidth } from '../Home/components/ImageCarousel';
import MissionDevelopment from './components/MissionDevelopment';
import PlanDrawing from './components/PlanDrawing';
import { CONTENT_ITEM_REASON, CONTENT_REASON } from '@/constants/contentAbout';
import image_slide from '@/assets/images/users/10.png';

const AboutUs = () => {
  const fixedImages: SrcSetWidth[] = [
    {id: 1, name: 'image_slide', url: `${image_slide}`, srcSet1200: `${image_slide}`, srcSet768: `${image_slide}` },
  ]
  return (
    <Box sx={{ bgcolor: '#06372D', color: 'white',}}>
      <Box
        sx={{
          px: { xs: 2, sm: 8, md: 10 },
          py: { xs: 4, md: 6 },
          textAlign: 'left',
        }}
      >
        {/* Tiêu đề lớn */}
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          mb={2}
        >
          Giới thiệu
        </Typography>
        <Typography variant='body1' textAlign='center' mb={5}>Trang chủ/Giới thiệu</Typography>
        <VisionIntroduction/>
      </Box>
      <ImageCarousel fixedImages={fixedImages}/>
      <Box
        sx={{
          px: { xs: 2, sm: 8, md: 10},
          py: { xs: 4, md: 6},
          textAlign: 'left',
        }}
      >
        <MissionDevelopment/>
      </Box>
      <PlanDrawing/>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row'},
          justifyContent: { xs: 'flex-start', md: 'space-evenly'},
          width: '100%',
          gap: 2
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '70%'},
            display: 'flex',
            justifyContent:'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            py: { xs: 0, md: 5},
            px: { xs: 3, md: 0},
            pt: { xs: 5, md: 0}
          }}
        >
          <Typography fontWeight={700} variant="h4" sx={{ py: 2, borderTop: '2px solid white'}}>Lý Do Khách Hàng Chọn Mintz Funi</Typography>
          <Typography textAlign='left' fontWeight={500} variant="h6" mb={2}>Am hiểu thị trường khách sạn Việt Nam</Typography>
          <Stack direction='column'>
              {CONTENT_ITEM_REASON.map((item, idx) => {
                return (
                  <Typography 
                    key={idx}
                    textAlign='left' 
                    sx={{ 
                      whiteSpace: 'normal', wordBreak: 'break-word',fontSize: {xs: '13px', md: '15px'},
                    }}
                  >
                    {`• ${item}`}
                  </Typography>
                )
              })}
          </Stack>
        </Box>
        <Box
          sx={{
            width: { xs: '100%', md: '30%'},
            display: 'flex',
            flexDirection: 'column',
            py: 5,
            px: { xs: 4, md: 0},
          }}
        >
          {CONTENT_REASON.map((content, index) => {
            return(
              <Box
                sx={{
                  display: 'flex',
                    flexDirection: 'column',
                    justifyContent: { xs: 'center', sm: 'center', md: 'flex-start'},
                    alignItems: { xs: 'center', sm: 'center', md: 'flex-start'},
                    py: 2,
                    gap: 2,
                    borderTop: CONTENT_REASON.length > index ? '1px solid white' : 0,
                    width: { xs: '100%', md: '50%'}
                }}
              >
                <Typography fontWeight={700} variant="h4">{content.label}</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'normal', wordBreak: 'break-word', fontSize: { xs: '13px', md: '16px'}}}> 
                  {content.content}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;
