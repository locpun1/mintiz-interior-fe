import NProgress from 'nprogress';
import type { FC } from 'react';
import { useEffect } from 'react';

const LoadingIndicator: FC = () => {
  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return null;
};

export default LoadingIndicator;
