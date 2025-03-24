import Box from '@mui/material/Box';
import type { FormLabelProps } from '@mui/material/FormLabel';
import FormLabel, { formLabelClasses } from '@mui/material/FormLabel';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import { Fragment, ReactNode } from 'react';
import type { FCC } from '@/types/react';

interface Props extends Omit<FormLabelProps, 'title'> {
  name: string;
  title?: string | ReactNode;
  gutterBottom?: TypographyProps['gutterBottom'];
  gutterLeft?: TypographyProps['gutterBottom'];
  TypographyProps?: Partial<TypographyProps>;
  onClick?: () => void;
}

const ProFormLabel: FCC<Props> = (props) => {
  const {
    name,
    title,
    children,
    gutterBottom = true,
    gutterLeft = false,
    TypographyProps = {},
    onClick,
    sx,
    ...rest
  } = props;

  if (!title) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', ...sx }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <FormLabel
        sx={{
          [`& .${formLabelClasses.asterisk}`]: {
            color: 'error.light',
          },
        }}
        htmlFor={name}
        {...rest}
      >
        <Typography
          variant='subtitle2'
          gutterBottom={gutterBottom}
          sx={{
            ml: gutterLeft ? '0.5em' : void 0,
            color: 'text.primary',
            display: 'inline-block',
          }}
          {...TypographyProps}
        >
          {title}
        </Typography>
      </FormLabel>
      {children}
    </Box>
  );
};

export default ProFormLabel;
