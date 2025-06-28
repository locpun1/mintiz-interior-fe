import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { __VERSION__ } from '@/config';
import { Box, Button, Divider, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import IconButton from '@/components/IconButton/IconButton';
import { Facebook, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import InputText from '@/components/InputText';
import CommonImage from '@/components/Image/index';
import mintz_logo from "@/assets/images/users/mintzdg-logo.png";
import { useState } from 'react';
import { Dayjs } from 'dayjs';

interface ProfileFormData {
  email: string;
}

const Footer = () => {
  const [errors, setErrors] = useState<Partial<Record<'email' , string>>>({});
  const [formData, setFormData] = useState<ProfileFormData>({ email: '' });
  const handleCustomInputChange = (name: string, value: string | null | Dayjs | number ) => {
          if (Object.prototype.hasOwnProperty.call(formData, name)) {
          const validName = name as keyof ProfileFormData; 
      
          setFormData((prevData) => ({
              ...prevData,
              [validName]: String(value ?? ''), 
          }));

          if(validName === 'email' && typeof value === 'string'){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // chuẩn email đơn giản
            if(!emailRegex.test(value)){
              setErrors(prev => ({
                ...prev,
                email: "Email không hợp lệ"
              }));
              return;
            }
            }
  
          if (validName === 'email') {
              if (errors[validName as 'email']) {
                  setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors[validName as 'email'];
                      return newErrors;
                  });
              }
          }
          } else {
          console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
          }
      };
  return (
    <FooterRoot>
        <Box sx={{ height: {xs: '300px', md: '180px'}}}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid size={{ xs: 12, md: 6}}>
                <Box
                  sx={{
                    height:'100%',
                    display:'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    
                  }}
                >
                  <CommonImage
                    src={mintz_logo}
                    sx={{
                      width: 150,
                      height: 150,
                    }}
                  />
                  <Box
                    sx={{
                      mt: 2
                    }}
                  >
                  <Typography variant='h4' fontWeight={800}>Mintz Funi</Typography>
                  <Typography variant='h6' fontWeight={500}>FUNIRTURE</Typography>
                  </Box>
                </Box>

            </Grid>
            <Grid size={{ xs: 12, md: 6}}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Stack direction='column' sx={{ width: { xs: '100%', md: '60%'}, mb: { xs: 2, md: 0}}}>
                  <Typography fontWeight={500} textAlign={{ xs: 'center', md: 'start'}}>Đăng ký nhận thông báo</Typography>
                  <Box display='flex' flexDirection={{ xs: 'column', md: 'row'}}>
                    <InputText
                      label=''
                      name='email'
                      onChange={handleCustomInputChange}
                      type='text'
                      value={formData.email}
                      placeholder='Email của bạn'
                      sx={{ mt: 0, mr: 2 }}
                      margin="dense"
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                    <Button sx={{ width: { xs: '100%', md: '105px'}, height: '35px', bgcolor: '#1C1A1B', mt: { xs: 1, md: 0}}}>
                      Gửi đi
                    </Button>    
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ border: 'solid 1px #1C1A1B'}} />
        <Box sx={{ height: '40px', px: { xs: 0, md: 2}, mt: { xs: 1, md: 0}}} display='flex' justifyContent='space-between'  alignItems={{ xs: 'flex-start', md: 'center'}} flexDirection={{ xs: 'column', md:'row'}}>
            <Box display="flex" alignItems='center'>
              <IconButton
                handleFunt={() => {}}
                icon={<Twitter sx={{ height: 22, width: 22, color: 'white'}}/>}
                backgroundColor="#1C1A1B"
                border="1px solid black"
                width={28}
                height={28}
              />
              <IconButton
                handleFunt={() => {}}
                icon={<Facebook sx={{ height: '35px', width: '35px', color: '#1C1A1B'}}/>}
                sx={{ mx: 0.5}}
                href="https://www.facebook.com/profile.php?id=61576721774771"
              />
              <IconButton
                handleFunt={() => {}}
                icon={<Instagram sx={{ height: 22, width: 22, color: 'white'}}/>}
                backgroundColor="#1C1A1B"
                border="1px solid black"
                width={28}
                height={28}
              />
              <IconButton
                handleFunt={() => {}}
                icon={<LinkedIn sx={{ height: '38px', width: '38px', color: '#1C1A1B'}}/>}
                sx={{ mx: 0.5}}
              />
            </Box>
            <Typography>Copyright © 2022. Mintz Funi Group, All right reserved. </Typography>
        </Box>
    </FooterRoot>
  );
};

const FooterRoot = styled('footer')(({ theme }) => ({
  height: '220px',
  display: 'flex',
  flexDirection:'column',
  // justifyContent: 'center',
  // alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  // responsive cho xs
  [theme.breakpoints.down('sm')]: {
    height: '400px',
  },
}));

export default Footer;
