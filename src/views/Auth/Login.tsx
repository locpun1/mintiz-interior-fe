import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import { AccountCircle, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import ControllerTextField from '@/components/ControllerField/ControllerTextField';
import Page from '@/components/Page';

import { ROUTE_PATH } from '@/constants/routes';
import useBoolean from '@/hooks/useBoolean';
import useNotification from '@/hooks/useNotification';
import { loginSchema } from '@/schemas/auth-schema';
import { setIsAuth } from '@/slices/auth';
import { setProfile } from '@/slices/user';
import { useAppDispatch } from '@/store';
import { setAccessToken } from '@/utils/AuthHelper';
import Logger from '@/utils/Logger';
import { signIn } from '@/services/auth-service';


export const ID_USER = 'user_id'
interface LoginFormInputs {
  username: string;
  password: string;
}

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });
  const { t } = useTranslation('auth');
  const [_loading, setLoading] = useBoolean();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = useNotification();
  const [_error, setError] = useState('');
  const [showPassword, setShowPassword] = useBoolean(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    setFocus('username');
  }, [setFocus]);

  const onSubmit = async (values: LoginFormInputs) => {
    setLoading.on();
    try {
      const respAuth = await signIn({
        username: values.username,
        password: values.password,
      });
      
      const accessToken = respAuth.data?.accessToken;
      const userProfile = respAuth.data?.user;
      if (accessToken && userProfile) {
        setAccessToken(accessToken);

        // Xét trường is_default
        if(userProfile.is_default === 1){
          localStorage.setItem(ID_USER, String(userProfile.id));

          navigate(`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.CHANGE_PASSWORD}`)
        }else{
          // 3. Cập nhật state của Redux/Context
          // Thông tin user đã có sẵn từ response login, không cần gọi /me nữa
          dispatch(setProfile(userProfile));
          dispatch(setIsAuth(true));

          // 4. Thông báo và chuyển hướng
          notify({
            message: t('login_success'),
            severity: 'success',
          });
          
          navigate(ROUTE_PATH.MANAGE, { replace: true });        
        }


      } else {
        setError(respAuth.message || 'Login failed, no access token returned.');
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading.off();
    }
  };

  return (
    <Page title='Mintz'>
      <Box>
        <Typography
          component='h1'
          variant='h4'
          fontWeight={500}
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
        >
          Đăng nhập
        </Typography>
      </Box>
      {_error && (
        <Alert variant='filled' severity='error'>
          {_error}
        </Alert>
      )}
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        <ControllerTextField<LoginFormInputs>
          controllerProps={{
            name: 'username',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Tài khoản',
            error: !!errors.username,
            helperText: errors.username?.message,
            sx: { ariaLabel: 'username' },
          }}
          prefixIcon={AccountCircle}
        />
        <ControllerTextField<LoginFormInputs>
          controllerProps={{
            name: 'password',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Mật khẩu',
            type: showPassword ? 'text' : 'password',
            error: !!errors.password,
            helperText: errors.password?.message,
            slotProps: {
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword.toggle()}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          }}
          prefixIcon={Lock}
        />
        <div>
          {/* <Box>
            <Typography
              color='primary'
              component={RouterLink}
              to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.FORGOT_PASSWORD}`}
              sx={{ textAlign: 'end', display: 'block' }}
            >
              Forgot password?
            </Typography>
          </Box> */}
          <FormControlLabel
            label={'Remember me'}
            control={
              <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            }
          />
        </div>
        <LoadingButton 
          loading={_loading} type='submit' variant='outlined' fullWidth
          sx={{
            color:"#1C1A1B",
            borderColor: "#1C1A1B",
            fontWeight:800
          }}
        >
          Đăng nhập
        </LoadingButton>
        {/* <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' gap={2}>
          <Typography>Don't have an account</Typography>
          <Typography
            to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.REGISTRATION}`}
            component={RouterLink}
            color='primary'
          >
            Create an account
          </Typography>
        </Box> */}
      </Box>
    </Page>
  );
}
