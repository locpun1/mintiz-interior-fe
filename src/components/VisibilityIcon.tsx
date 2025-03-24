import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { MouseEventHandler } from 'react';

export default function VisibilityIcon({
  show,
  onClick,
}: {
  show?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <InputAdornment position='end'>
      <IconButton aria-label='toggle password visibility' onClick={onClick} edge='end'>
        {show ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
}
