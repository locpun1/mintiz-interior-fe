import axios from 'axios';
import { useEffect } from 'react';

import LoadingOverlay from '@/components/ProTable/core/LoadingOverlay';

import { setInitApp, setIsAuth, setProfile } from '@/slices/auth';
import { useAppDispatch, useAppSelector } from '@/store';
import { FCC } from '@/types/react';
import { getAccessToken, removeAccessToken } from '@/utils/AuthHelper';
import Logger from '@/utils/Logger';
import { getCurrentUser } from '@/services/auth-service';

const InitLoadingProvider: FCC = ({ children }) => {
  const { isInitialized } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const requestUser = async () => {
    try {
      const token = getAccessToken();
      if (token) {
        const resp = await getCurrentUser();
        const userProfile = resp.data;
        if (userProfile) {
          dispatch(setProfile(userProfile));
          dispatch(setIsAuth(true));
        } else {
          throw new Error('User profile not found in response');
        }
      }
    } catch (error) {
      removeAccessToken();
      Logger.log(error);
      dispatch(setIsAuth(false));
    } finally {
      dispatch(setInitApp());
    }
  };

  useEffect(() => {
    requestUser();
  }, []);

  return (
    <>
      <LoadingOverlay visible={!isInitialized} />
      {isInitialized && children}
    </>
  );
};

export default InitLoadingProvider;
