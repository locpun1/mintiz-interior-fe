import Paper from '@mui/material/Paper';
import type { FormHTMLAttributes, ReactNode } from 'react';

type Props =
  | {
      children: [ReactNode, ReactNode, ReactNode];
      disableHeader?: never;
      disableFooter?: never;
    }
  | {
      children: [ReactNode, ReactNode];
      disableHeader: true;
      disableFooter?: never;
    }
  | {
      children: [ReactNode, ReactNode];
      disableFooter: true;
      disableHeader?: never;
    };

const ProFormGrid = (props: Props & FormHTMLAttributes<HTMLFormElement>) => {
  const { children, disableHeader, disableFooter, ...rest } = props;
  return (
    <Paper
      component="form"
      noValidate
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        rowGap: 1,
        p: 2,
        height: 1,
        ...(disableHeader && {
          gridTemplateRows: '1fr auto',
        }),
        ...(disableFooter && {
          gridTemplateRows: 'auto 1fr',
        }),
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default ProFormGrid;
