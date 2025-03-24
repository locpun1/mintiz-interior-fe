import type { FormHTMLAttributes } from 'react';
import Box from '@mui/material/Box';

const DialogForm = (props: FormHTMLAttributes<HTMLFormElement>) => {
  return <Box component="form" noValidate {...props} />;
};

export default DialogForm;