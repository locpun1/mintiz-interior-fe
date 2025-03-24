import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { object } from 'yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Email } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Typography } from '@mui/material';
import ControllerTextField from '@/components/ControllerField/ControllerTextField';
import Page from '@/components/Page';

import { ROUTE_PATH } from '@/constants/routes';
import useBoolean from '@/hooks/useBoolean';
import { usernameValidateSchema } from '@/schemas/auth-schema';
import { verifyEmail } from '@/services/auth-service';

const forgotPasswordSchema = object().shape({
  username: usernameValidateSchema,
});

type ForgotPasswordFormInputs = {
  username: string;
};
export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(forgotPasswordSchema),
  });
  const [_loading, setLoading] = useBoolean(false);
  const navigate = useNavigate();
  const [_hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [_errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation('auth');

  useEffect(() => {
    setFocus('username');
  }, [setFocus]);

  const onSubmit = async (values: ForgotPasswordFormInputs) => {
    setLoading.on();
    try {
      const resp = await verifyEmail(values);
      if (resp.statusCode === axios.HttpStatusCode.Ok) {
        setHasErrors(false);
        setErrorMsg('');
      } else {
        setErrorMsg(t('email_not_found'));
        throw new Error(resp.message);
      }
    } catch (error: any) {
      setHasErrors(true);
    } finally {
      setLoading.off();
    }
  };

  return (
    <Page title='Forgot Password'>
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{ maxWidth: 400, margin: 'auto' }}
      >
        <Typography variant='h4' component='h1' gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant='body1' sx={{ mb: 2 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {_hasErrors === true && (
          <Alert variant='filled' severity='warning'>
            {_errorMsg}
          </Alert>
        )}

        {_hasErrors === false && (
          <Alert variant='filled' severity='success'>
            Sent password reset. Please check your email
          </Alert>
        )}

        <ControllerTextField<ForgotPasswordFormInputs>
          controllerProps={{
            name: 'username',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Email',
            error: !!errors.username,
            helperText: errors.username?.message,
          }}
          prefixIcon={Email}
        />
        <LoadingButton
          loading={_loading}
          type='submit'
          variant='contained'
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </LoadingButton>
        <Button
          onClick={() => navigate(`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.LOGIN}`)}
          variant='outlined'
          fullWidth
          sx={{ mt: 2 }}
        >
          Back to login
        </Button>
      </Box>
    </Page>
  );
}
