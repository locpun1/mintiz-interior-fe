import type { ReactNode } from 'react';
import Container from '@mui/material/Container';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  children: ReactNode;
}

const PageWrapper = (props: Props) => {
  const { title, children } = props;

  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Container
        sx={{
          height: 1,
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          pb: 3,
          maxWidth: '100% !important',
          bgcolor: 'white',
        }}
      >
        {children}
      </Container>
    </Fragment>
  );
};

export default PageWrapper;
