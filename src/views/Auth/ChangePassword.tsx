import ControllerTextField from '@/components/ControllerField/ControllerTextField';
import Page from '@/components/Page';
import { ROUTE_PATH } from '@/constants/routes';
import useBoolean from '@/hooks/useBoolean';
import useNotification from '@/hooks/useNotification';
import { changePasswordSchema } from '@/schemas/auth-schema';
import { changePassword, forgotPassword } from '@/services/auth-service';
import { ChangePasswordRequest } from '@/types/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ID_USER } from './Login';

interface IChangePasswordForm {
  currentPassword?: string;
  password: string;
  confirmPassword: string;
}
export default function ChangePassword() {
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    getValues,
    trigger,
  } = useForm<IChangePasswordForm>({
    resolver: yupResolver(changePasswordSchema),
  });
  const password = watch('password');
  const [searchParams] = useSearchParams();
  const [_loading, setLoading] = useBoolean(false);
  const navigate = useNavigate();
  const { t } = useTranslation('auth');
  const notify = useNotification();
  const [_hasErrors, setHasErrors] = useBoolean(false);
  const [showCurrentPassword, setShowCurrentPassword] = useBoolean(false);
  const [showPassword, setShowPassword] = useBoolean(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useBoolean(false);
  const userId = localStorage.getItem(ID_USER)

  useEffect(() => {
    if (password && password?.length === getValues('confirmPassword')?.length) {
      trigger('confirmPassword');
    }
  }, [password, trigger]);
  
  const onSubmit = async(values: IChangePasswordForm) => {
    setLoading.on();
    const body: ChangePasswordRequest = {
      password: values.password,
      is_default: 0,
      user_id: userId ? Number(userId) : ''
    }
    try {
      await changePassword(body)
      notify({
        message: 'Thay đổi mật khẩu thành công',
        severity: 'success'
      })
      navigate(`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.LOGIN}`);
    } catch (error: any) {
      notify({
        message: `Thay đổi mật khẩu không thành công, ${error.message}`,
        severity: 'error',
      });
    }finally{
        setLoading.off();
    };
  };

  return (
    <Page title='Mintz'>
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}
      >
        <Typography textAlign='center' variant='h4' component='h1' gutterBottom>
          Thay đổi mật khẩu
        </Typography>
        {_hasErrors && (
          <Alert variant='filled' severity='warning'>
            Sorry, looks like there are some errors detected, please try again.
          </Alert>
        )}
        <ControllerTextField<IChangePasswordForm>
          controllerProps={{
            name: 'currentPassword',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Mật khẩu hiện tại',
            type: showCurrentPassword ? 'text' : 'password',
            slotProps:{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle current password visibility'
                      onClick={() => setShowCurrentPassword.toggle()}
                      edge='end'
                    >
                      {showCurrentPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }
          }}
          prefixIcon={Lock}
        />
        <ControllerTextField<IChangePasswordForm>
          controllerProps={{
            name: 'password',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Mật khẩu mới',
            type: showPassword ? 'text' : 'password',
            error: !!errors.password,
            helperText: errors.password?.message,
            slotProps:{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle current password visibility'
                      onClick={() => setShowPassword.toggle()}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }
          }}
          prefixIcon={Lock}
        />
        <ControllerTextField<IChangePasswordForm>
          controllerProps={{
            name: 'confirmPassword',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Nhập lại mật khẩu',
            type: showPasswordConfirm ? 'text' : 'password',
            error: !!errors.confirmPassword,
            helperText: errors.confirmPassword?.message,
            slotProps:{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle current password visibility'
                      onClick={() => setShowPasswordConfirm.toggle()}
                      edge='end'
                    >
                      {showPasswordConfirm ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }
          }}
          prefixIcon={Lock}
        />
        <LoadingButton
          loading={_loading}
          type='submit'
          variant='contained'
          fullWidth
          sx={{ mt: 2 }}
        >
          Lưu
        </LoadingButton>
      </Box>
    </Page>
  );
}
