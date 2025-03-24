import type { FC, PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
}

const Page: FC<PropsWithChildren<Props>> = (props) => {
  const { title, children } = props;

  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Fragment>
  );
};

export default Page;
